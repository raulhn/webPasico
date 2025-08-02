import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Modal } from "react-native";
import { useTipoTablon } from "../../hooks/useTipoTablon.js";
import { AuthContext } from "../../providers/AuthContext.js";
import {
  EntradaTexto,
  Boton,
  EntradaGroupRadioButton,
  ModalAviso,
} from "../componentesUI/ComponentesUI.jsx";
const ServiceTablon = require("../../servicios/serviceTablon.js");

export default function FormularioTablon({ accionCancelar, callback }) {
  const [descripcion, setDescripcion] = useState("");
  const [nidTablonAnuncio, setNidTablonAnuncio] = useState(null);
  const [titulo, setTitulo] = useState("");

  const [aviso, setAviso] = useState(false);
  const [exito, setExito] = useState(false);

  const [mensaje, setMensaje] = useState("");

  const { cerrarSesion } = useContext(AuthContext);

  const [tipoTablon, setTipoTablon] = useState({
    valor: null,
    descripcion: "",
  });

  const { tiposTablon, cargando, error } = useTipoTablon(cerrarSesion);

  function CapitalCase(val) {
    return (
      String(val).charAt(0).toUpperCase() + String(val).slice(1).toLowerCase()
    );
  }

  const listaTiposTablon = tiposTablon.map((tipo) => ({
    valor: tipo.nid_tipo_tablon,
    etiqueta: CapitalCase(tipo.descripcion),
  }));

  async function registrarTablonAnuncio() {
    const anuncio = {
      titulo: titulo,
      descripcion: descripcion,
      nid_tipo_tablon: tipoTablon.valor,
    };

    try {
      console.log("Registrando anuncio:", anuncio);
      if (!anuncio.titulo || !anuncio.descripcion || !anuncio.nid_tipo_tablon) {
        setMensaje("Todos los campos son obligatorios");
        setAviso(true);
        return;
      }
      const respuesta = await ServiceTablon.registrarTablonAnuncio(
        anuncio,
        cerrarSesion
      );

      if (!respuesta.error) {
        callback(respuesta.nid_tipo_tablon);
        setExito(true);
      } else {
        setMensaje("Error al registrar el tipo de tablón");
        setAviso(true);
      }
    } catch (error) {
      setMensaje("Error al registrar el tipo de tablón");
      setAviso(true);
    }
  }

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Registrar Anuncio</Text>
      <Text>Título</Text>

      <EntradaTexto label="Título" value={titulo} setValor={setTitulo} />
      <Text>Categoría</Text>
      <EntradaGroupRadioButton
        titulo="Categoría del Anuncio"
        opciones={listaTiposTablon}
        valorSeleccionado={tipoTablon.valor}
        setValorSeleccionado={(valor) => setTipoTablon(valor)}
      />
      <Text style={{ paddingTop: 10 }}>Descripción</Text>
      <EntradaTexto
        label="Descripción"
        value={descripcion}
        setValor={setDescripcion}
        multiline={true}
        maxLength={500}
        ancho={300}
        alto={100}
      />
      <View style={estilos.botonContainer}>
        <Boton nombre="Guardar" onPress={registrarTablonAnuncio} />
        <Boton nombre="Cancelar" onPress={accionCancelar} color="#FF0000" />
      </View>

      <ModalAviso
        visible={aviso}
        setVisible={setAviso}
        mensaje={mensaje}
        textBoton={"Aceptar"}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  botonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    paddingHorizontal: 20,
    marginTop: 20,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
