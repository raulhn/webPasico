import { View, Text, StyleSheet } from "react-native";

import ServicePartituras from "../../servicios/servicePartituras";

import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../../providers/AuthContext";
import {
  Boton,
  EntradaTexto,
  ModalAviso,
  ModalExito,
  RadioInput,
  GroupRadioInput,
} from "../componentesUI/ComponentesUI";

import { SelectorCategoria } from "./SelectorCategoria";
import { use } from "react";

export default function FormularioPartitura({
  accionCancelar,
  callback,
  nidPartitura,
}) {
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState(null);
  const [autor, setAutor] = useState("");
  const [urlPartitura, setUrlPartitura] = useState("");

  const [aviso, setAviso] = useState(false);
  const [exito, setExito] = useState(false);

  const [mensaje, setMensaje] = useState("");

  const { cerrarSesion } = useContext(AuthContext);

  useEffect(() => {
    if (nidPartitura) {
      ServicePartituras.obtenerPartitura(nidPartitura, cerrarSesion).then(
        (respuesta) => {
          if (!respuesta.error) {
            setNombre(respuesta.partitura.titulo);
            setAutor(respuesta.partitura.autor);
            setCategoria({
              valor: respuesta.partitura.nid_categoria,
              etiqueta: respuesta.partitura.nombre_categoria,
            });

            setUrlPartitura(respuesta.partitura.url_partitura);
          }
        }
      );
    }
  }, []);

  async function registrarPartitura() {
    const partitura = {
      titulo: nombre,
      autor: autor,
      categoria: categoria.valor,
      url_partitura: urlPartitura,
    };

    try {
      const respuesta = await ServicePartituras.registrarPartitura(
        partitura,
        cerrarSesion
      );

      if (!respuesta.error) {
        callback(respuesta.nid_partitura);
        setExito(true);
      } else {
        setMensaje("Error al registrar la partitura");
        setAviso(true);
      }
    } catch (error) {
      setMensaje("Error al registrar la partitura");
      setAviso(true);
    }
  }

  async function actualizarPartitura() {
    const partitura = {
      nid_partitura: nidPartitura,
      titulo: nombre,
      autor: autor,
      categoria: categoria.valor,
      url_partitura: urlPartitura,
    };

    try {
      const respuesta = await ServicePartituras.actualizarPartitura(
        partitura,
        cerrarSesion
      );
      if (!respuesta.error) {
        callback(respuesta.nid_partitura);
        setExito(true);
      } else {
        setMensaje("Error al registrar la partitura");
        setAviso(true);
      }
    } catch (error) {
      setMensaje("Error al registrar la partitura");
      setAviso(true);
    }
  }

  const actualizarCategoria = (valor) => {
    setCategoria(valor);
  };

  const refrescarModal = () => {
    console.log("Refrescando modal");
    setAviso(false);
    setExito(false);
    setMensaje("");
  };

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Formulario de Partitura</Text>

      <Text>Titulo</Text>
      <EntradaTexto
        placeholder="Titulo"
        valor={nombre}
        setValor={(text) => setNombre(text)}
      ></EntradaTexto>

      <Text>Categoria</Text>
      <SelectorCategoria
        setTexto={actualizarCategoria}
        valorDefecto={categoria}
      />

      <Text>Autor</Text>
      <EntradaTexto
        placeholder="Autor"
        valor={autor}
        setValor={(text) => setAutor(text)}
      />
      <Text>Url Partitura</Text>
      <EntradaTexto
        placeholder="Url Partitura"
        valor={urlPartitura}
        setValor={(text) => setUrlPartitura(text)}
      />
      <View style={estilos.botones}>
        <Boton
          nombre="Registrar Partitura"
          onPress={() => {
            if (nombre === "") {
              setMensaje("El campo Titulo es obligatorio");
              setAviso(true);
              return;
            }
            if (nidPartitura) {
              console.log("Actualizando partitura con nid:", nidPartitura); // Para depuración
              actualizarPartitura();
            } else {
              console.log("Registrando nueva partitura"); // Para depuración
              registrarPartitura();
            }
          }}
        />
        <Boton
          nombre="Cancelar"
          color="red"
          onPress={() => {
            accionCancelar();
          }}
        />
      </View>

      <ModalAviso
        visible={aviso}
        setVisible={refrescarModal}
        mensaje={mensaje}
        textBoton={"Aceptar"}
      />
      <ModalExito
        visible={exito}
        setVisible={refrescarModal}
        mensaje={"Partitura registrada exitosamente"}
        textBoton={"Aceptar"}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  botones: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    marginTop: 20,
  },
  titulo: {
    fontSize: 24, // Tamaño de fuente grande
    fontWeight: "bold", // Negrita para destacar
    color: "#007CFA", // Color azul para resaltar
    marginBottom: 20, // Espacio debajo del título
    textAlign: "center", // Centrado horizontalmente
  },
});
