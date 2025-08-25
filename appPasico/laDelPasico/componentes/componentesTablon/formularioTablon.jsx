import React, { useState, useEffect, useContext } from "react";
import { View, Text, StyleSheet, Modal, ActivityIndicator } from "react-native";
import { useTipoTablon } from "../../hooks/useTipoTablon.js";
import { AuthContext } from "../../providers/AuthContext.js";
import { useTablonAnuncio } from "../../hooks/useTablonAnuncios.js";
import {
  EntradaTexto,
  Boton,
  EntradaGroupRadioButton,
  ModalAviso,
} from "../componentesUI/ComponentesUI.jsx";
const ServiceTablon = require("../../servicios/serviceTablon.js");
import { useAsignaturas, useAsignaturasProfesor } from "../../hooks/escuela/useAsignaturas.js";
import Constantes from "../../config/constantes.js";
import { useRol } from "../../hooks/useRol.js";


export default function FormularioTablon({
  accionCancelar,
  callback,
  nidTablonAnuncionDefecto,
}) {
  const [descripcion, setDescripcion] = useState("");
  const [nidTablonAnuncio, setNidTablonAnuncio] = useState(null);
  const [titulo, setTitulo] = useState("");
  const { esRol } = useRol();

  const [aviso, setAviso] = useState(false);

  const [mensaje, setMensaje] = useState("");

  const { cerrarSesion } = useContext(AuthContext);
  const {
    anuncio,
    cargando: cargandoAnuncio,
    error: errorAnuncio,
  } = useTablonAnuncio(nidTablonAnuncionDefecto, cerrarSesion);

  const [tipoTablon, setTipoTablon] = useState({
    valor: null,
    descripcion: "",
  });

  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState({
    valor: null,
    etiqueta: "",
  });

  const { tiposTablon, cargando, error } = useTipoTablon(cerrarSesion);
  const {
    asignaturas,
    cargando: cargandoAsignaturas,
    error: errorAsignaturas,
    lanzarRefresco,
  } = useAsignaturas();

  const {asignaturas: asignaturasProfesor} = useAsignaturasProfesor();

  function CapitalCase(val) {
    return (
      String(val).charAt(0).toUpperCase() + String(val).slice(1).toLowerCase()
    );
  }

  useEffect(() => {
    if (anuncio && anuncio.nid_tablon_anuncio) {
      setNidTablonAnuncio(anuncio.nid_tablon_anuncio);
      setTitulo(anuncio.titulo);
      setDescripcion(anuncio.descripcion);

      setTipoTablon({
        valor: anuncio.nid_tipo_tablon,
        etiqueta: CapitalCase(anuncio.tipo_tablon),
      });

      setAsignaturaSeleccionada({
        valor: anuncio.nid_asignatura,
        etiqueta: CapitalCase(anuncio.asignatura),
      });
    }
  }, [anuncio]);

  const listaTiposTablon = tiposTablon.map((tipo) => ({
    valor: tipo.nid_tipo_tablon,
    etiqueta: CapitalCase(tipo.descripcion),
  }));

  const listaAsignaturas = asignaturas.map((asignatura) => ({
    valor: asignatura.nid_asignatura,
    etiqueta: CapitalCase(asignatura.descripcion),
  }));

  const listaAsignaturasProfesor = asignaturasProfesor.map((asignatura) => ({
    valor: asignatura.nid_asignatura,
    etiqueta: CapitalCase(asignatura.descripcion),
  }));

  async function registrarTablonAnuncio() {
    const anuncioEnvio = {
      titulo: titulo,
      descripcion: descripcion,
      nid_tipo_tablon: tipoTablon.valor,
      nid_asignatura: asignaturaSeleccionada.valor,
    };

    try {
      if (
        !anuncioEnvio.titulo ||
        !anuncioEnvio.descripcion ||
        !anuncioEnvio.nid_tipo_tablon
      ) {
        setMensaje("Todos los campos son obligatorios");
        setAviso(true);
        return;
      }
      if(esRol(["PROFESOR"]) && tipoTablon.valor == Constantes.ESCUELA && 
        (!asignaturaSeleccionada || !asignaturaSeleccionada.valor))
      {
        setMensaje("La asignatura es obligatoria");
        setAviso(true);
        return;
      }
      const respuesta = await ServiceTablon.registrarTablonAnuncio(
        anuncioEnvio,
        cerrarSesion
      );

      if (!respuesta.error) {
        callback(respuesta.nid_tipo_tablon);
      } else {
        setMensaje("Error al registrar el tipo de tablón");
        setAviso(true);
      }
    } catch (error) {
      setMensaje("Error al registrar el tipo de tablón");
      setAviso(true);
    }
  }

  async function actualizarTablonAnuncio() {
    const anuncioActualiza = {
      nid_tablon_anuncio: nidTablonAnuncio,
      titulo: titulo,
      descripcion: descripcion,
      nid_tipo_tablon: tipoTablon.valor,
      nid_asignatura: asignaturaSeleccionada.valor,
    };
    try {
      if (
        !anuncioActualiza.titulo ||
        !anuncioActualiza.descripcion ||
        !anuncioActualiza.nid_tipo_tablon
      ) {
        setMensaje("Todos los campos son obligatorios");
        setAviso(true);
        return;
      }

      if(esRol(["PROFESOR"]) && tipoTablon.valor == Constantes.ESCUELA && 
        (!asignaturaSeleccionada || !asignaturaSeleccionada.valor))
      {
        setMensaje("La asignatura es obligatoria");
        setAviso(true);
        return;
      }
      const respuesta = await ServiceTablon.actualizarTablonAnuncio(
        anuncioActualiza,
        cerrarSesion
      );

      if (!respuesta.error) {
        callback(respuesta.nid_tipo_tablon);
        
      } else {
        console.log("Error al actualizar el tipo de tablón:", respuesta);
        setMensaje("Error al actualizar el tipo de tablón");
        setAviso(true);
      }
    } catch (error) {
      console.log("Error al actualizar el tipo de tablón 2:", error);
      setMensaje("Error al actualizar el tipo de tablón");
      setAviso(true);
    }
  }

  if (cargandoAnuncio) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  function muestraAsignaturas() {
    if (tipoTablon.valor === Constantes.ESCUELA) {
      let listaAsignaturasMostradas = listaAsignaturas;
    
      if(esRol(["PROFESOR"]))
      {
        listaAsignaturasMostradas = listaAsignaturasProfesor;
      
      }
      return (
        <>
          <Text>Asignatura</Text>
          <EntradaGroupRadioButton
            titulo="Asignatura"
            opciones={listaAsignaturasMostradas}
            valor={asignaturaSeleccionada}
            setValorSeleccionado={(valor) => setAsignaturaSeleccionada(valor)}
          />
        </>
      );
    }
  }

  function muestraCategoria()
  {
    if (esRol(["PROFESOR"]))
    {
      const listaFiltrada = listaTiposTablon.filter(tipo => tipo.valor == Constantes.ESCUELA);
       return (<>
    <Text>Categoría</Text> 
     <EntradaGroupRadioButton
        titulo="Categoría del Anuncio"
        opciones={listaFiltrada}
        valor={tipoTablon}
        setValorSeleccionado={(valor) => setTipoTablon(valor)}
      /></>)
    }
    return (<>
    <Text>Categoría</Text> 
     <EntradaGroupRadioButton
        titulo="Categoría del Anuncio"
        opciones={listaTiposTablon}
        valor={tipoTablon}
        setValorSeleccionado={(valor) => setTipoTablon(valor)}
      /></>)
  }

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Registrar Anuncio</Text>
      <Text>Título</Text>
      <EntradaTexto label="Título" valor={titulo} setValor={setTitulo} />
    {muestraCategoria()}
      {muestraAsignaturas()}
      <Text style={{ paddingTop: 10 }}>Descripción</Text>
      <EntradaTexto
        label="Descripción"
        valor={descripcion}
        setValor={setDescripcion}
        multiline={true}
        maxLength={500}
        ancho={300}
        alto={100}
      />

      <View style={estilos.botonContainer}>
        <Boton
          nombre="Guardar"
          onPress={() => {
            if (nidTablonAnuncio) {
              actualizarTablonAnuncio();
            } else {
              registrarTablonAnuncio();
            }
          }}
        />
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
