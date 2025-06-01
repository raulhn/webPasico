import { View, Text, StyleSheet } from "react-native";
import { useState, useEffect } from "react";

import { AuthContext } from "../../providers/AuthContext";
import { useContext } from "react";
import serviceEventoConcierto from "../../servicios/serviceEventoConcierto"; // Asegúrate de importar tu servicio correctamente

import ModalExito from "../componentesUI/ModalExito";

import {
  EntradaTexto,
  EntradaFecha,
  Boton,
} from "../componentesUI/ComponentesUI";

export default function FormularioEvento({ cancelar, callback, nidEvento }) {
  const [nombreEvento, setNombreEvento] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaEvento, setFechaEvento] = useState(new Date());

  const { cerrarSesion } = useContext(AuthContext);

  const [exito, setExito] = useState(false);

  useEffect(() => {
    if (!nidEvento) return;

    serviceEventoConcierto
      .obtenerEventoConcierto(nidEvento, cerrarSesion)
      .then((response) => {
        if (!response.error) {
          setNombreEvento(response.evento_concierto.nombre);
          setDescripcion(response.evento_concierto.descripcion);
          setFechaEvento(new Date(response.evento_concierto.fecha_evento));
        }
      })
      .catch((error) => {
        console.error("Error al obtener el evento:", error);
        cerrarSesion();
      });
  }, [nidEvento]);

  function registrarEventoConcierto() {
    if (nombreEvento === "" || descripcion === "") {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const evento = {
      nombre: nombreEvento,
      fecha_evento: formatearFecha(fechaEvento),
      descripcion: descripcion,
      tipo_evento: "Concierto",
      publicado: "N",
    };

    console.log("Evento a registrar:", evento);
    serviceEventoConcierto
      .registrarEventoConcierto(evento, cerrarSesion)
      .then((response) => {
        if (response.error) {
          console.error("Error al obtener eventos:", response.mensaje);
          return;
        }
        console.log("Evento registrado:", response);

        setExito(true); // Cambia el estado de éxito a verdadero
        if (callback) {
          callback();
        }
      })
      .catch((error) => {
        console.error("Error al registrar el evento:", error);
        alert("Error al registrar el evento");
      });
  }

  function actualizarEventoConcierto() {
    if (nombreEvento === "" || descripcion === "") {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const evento = {
      nid_evento_concierto: nidEvento,
      nombre: nombreEvento,
      fecha_evento: formatearFecha(fechaEvento),
      descripcion: descripcion,
      tipo_evento: "Concierto",
      publicado: "N",
    };

    console.log("Evento a actualizar:", evento);
    serviceEventoConcierto
      .actualizarEventoConcierto(evento, cerrarSesion)
      .then((response) => {
        if (response.error) {
          console.error("Error al actualizar el evento:", response.mensaje);
          return;
        }
        console.log("Evento actualizado:", response);
        setExito(true); // Cambia el estado de éxito a verdadero
        if (callback) {
          callback();
        }
      })
      .catch((error) => {
        console.error("Error al actualizar el evento:", error);
        alert("Error al actualizar el evento");
      });
  }

  function formatearFecha(fecha) {
    const formattedDate = `${fecha.getFullYear()}-${String(
      fecha.getMonth() + 1
    ).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;
    return formattedDate;
  }

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Crear evento</Text>
      <Text>Nombre de Evento</Text>
      <EntradaTexto
        placeholder="Nombre del Evento"
        setValor={(text) => setNombreEvento(text)}
        valor={nombreEvento}
      ></EntradaTexto>

      <Text>Descripción</Text>
      <EntradaTexto
        placeholder="Descripción del Evento"
        setValor={(text) => setDescripcion(text)}
        ancho={300}
        alto={100}
        multiline={true}
        valor={descripcion}
      ></EntradaTexto>

      <Text>Fecha</Text>
      <EntradaFecha
        onChangeFecha={(fecha) => {
          setFechaEvento(fecha);
          console.log("Fecha recuperada " + fecha);
        }}
        valorFecha={fechaEvento}
      ></EntradaFecha>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          gap: 10,
          width: "100%",
        }}
      >
        <Boton
          nombre="Guardar"
          onPress={() => {
            if (nidEvento) {
              actualizarEventoConcierto();
            } else {
              registrarEventoConcierto();
            }
          }}
        />
        <Boton nombre="Cancelar" color="red" onPress={cancelar} />
      </View>
      <ModalExito
        visible={exito} // Cambia esto según tu lógica
        callback={() => {
          setExito(false);
          callback(); // Llama a la función de callback para refrescar la lista de eventos
        }} // Cambia esto según tu lógica
        mensaje="Evento registrado con éxito"
        textBoton="Aceptar"
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titulo: {
    fontSize: 24, // Tamaño de fuente grande
    fontWeight: "bold", // Negrita para destacar
    color: "#007CFA", // Color azul para resaltar
    marginBottom: 20, // Espacio debajo del título
    textAlign: "center", // Centrado horizontalmente
  },
});
