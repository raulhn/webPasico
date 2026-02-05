import { useAgendaEventos } from "../../../hooks/general/useAgendaEventos";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  EntradaTexto,
  Boton,
  ModalAviso,
  EntradaFecha,
  EntradaGroupRadioButton,
} from "../../componentesUI/ComponentesUI.jsx";
import { useState } from "react";
import { useEventoConcierto } from "../../../hooks/banda/useEventoConcierto.js";
import { obtenerFechaFormateada } from "../../../comun/fechas.js";

export default function FormularioAgenda({
  evento = { nombre: "", descripcion: "", fecha: null },
  volver = () => {},
  cerrar_sesion,
}) {
  const { registrarEvento, actualizarEvento, eliminarEvento } =
    useAgendaEventos(cerrar_sesion);
  const [nombre, setNombre] = useState(evento.nombre);
  const [descripcion, setDescripcion] = useState(evento.descripcion);
  const [fecha, setFecha] = useState(evento.fecha);
  const [nidEvento, setIdEvento] = useState(evento.nid_evento || null);
  const [error, setError] = useState(null);
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);
  const { registrarEventoConcierto, actualizarEventoConcierto } =
    useEventoConcierto(cerrar_sesion);

  const tipos = [
    { etiqueta: "General", valor: 1 },
    { etiqueta: "Banda", valor: 2 },
  ];

  function formatearFecha(fecha) {
    const formattedDate = `${fecha.getFullYear()}-${String(
      fecha.getMonth() + 1
    ).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;
    return formattedDate;
  }
  function registrarEventoConciero() {
    if (!nidEvento) {
      const nuevoEvento = {
        nombre: nombre,
        fecha_evento: formatearFecha(fecha),
        descripcion: descripcion,
        tipo_evento: "Concierto",
        publicado: "N",
        tiposEvento: [],
      };

      registrarEventoConcierto(nuevoEvento)
        .then((respuesta) => {
          if (respuesta.error) {
            console.log(
              "Error al registrar el evento de concierto:",
              respuesta.error
            );
            setError(respuesta.error);
          } else {
            console.log("Evento de concierto registrado con éxito:", respuesta);
            volver();
          }
        })
        .catch((error) => {
          console.log("Error al registrar el evento de concierto:", error);
          setError(error);
        });
    } else {
      console.log("actualizar evento");
      const eventoActualizado = {
        nid_evento: nidEvento,
        nombre: nombreEvento,
        fecha_evento: formatearFecha(fecha),
        descripcion: descripcion,
        tipo_evento: "Concierto",
        publicado: "N",
      };

      actualizarEventoConcierto(eventoActualizado)
        .then((respuesta) => {
          if (respuesta.error) {
            console.log(
              "Error al actualizar el evento de concierto:",
              respuesta.error
            );
            setError(respuesta.error);
          } else {
            console.log(
              "Evento de concierto actualizado con éxito:",
              respuesta
            );
            volver();
          }
        })
        .catch((error) => {
          console.log("Error al actualizar el evento de concierto:", error);
          setError(error);
        });
    }
  }

  function registrarEventoAgenda() {
    if (!nidEvento) {
      const nuevoEvento = {
        nombre: nombre,
        descripcion: descripcion,
        fecha: fecha,
      };

      registrarEvento(nuevoEvento)
        .then((respuesta) => {
          if (respuesta.error) {
            console.log("Error al registrar el evento:", respuesta.error);
            setError(respuesta.error);
          } else {
            console.log("Evento registrado con éxito:", respuesta);
            volver();
          }
        })
        .catch((error) => {
          console.log("Error al registrar el evento:", error);
          setError(error);
        });
    } else {
      console.log("actualizar evento");
      const eventoActualizado = {
        nid_evento: nidEvento,
        nombre: nombre,
        descripcion: descripcion,
        fecha: fecha,
      };

      actualizarEvento(eventoActualizado)
        .then((respuesta) => {
          if (respuesta.error) {
            console.log("Error al actualizar el evento:", respuesta.error);
            setError(respuesta.error);
          } else {
            console.log("Evento actualizado con éxito:", respuesta);
            volver();
          }
        })
        .catch((error) => {
          console.log("Error al actualizar el evento:", error);
          setError(error);
        });
    }
  }
  function registrarEventoFormulario() {
    console.log(nidEvento);
    if (nidEvento) {
      registrarEventoAgenda();
      return;
    }
    const valorTipoSeleccionado = tipoSeleccionado.valor;
    if (valorTipoSeleccionado === 1) {
      registrarEventoAgenda();
    } else if (valorTipoSeleccionado === 2) {
      registrarEventoConciero();
    } else {
      setError("Por favor, selecciona un tipo de evento.");
    }
  }

  function recuperaTipoEvento() {
    if (!nidEvento) {
      return (
        <>
          {" "}
          <Text>Tipo</Text>
          <EntradaGroupRadioButton
            titulo={"Tipo de Evento"}
            opciones={tipos}
            valor={tipoSeleccionado}
            setValorSeleccionado={(valor) => {
              setTipoSeleccionado(valor);
            }}
          />
        </>
      );
    }
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={estilos.contenedor}>
        <Text>Formulario de Agenda</Text>
        <Text>Nombre</Text>
        <EntradaTexto
          setValor={(valor) => {
            setNombre(valor);
          }}
          valor={nombre}
        />
        <Text>Descripción</Text>
        <EntradaTexto
          setValor={(valor) => {
            setDescripcion(valor);
          }}
          valor={descripcion}
        />
        {recuperaTipoEvento()}
        <Text>Fecha</Text>
        <EntradaFecha
          onChangeFecha={(valor) => {
            setFecha(valor);
          }}
          valorFecha={fecha}
        />
        <Boton
          nombre="Guardar"
          onPress={() => {
            registrarEventoFormulario();
          }}
        />
        <Boton
          nombre="Volver"
          onPress={() => {
            volver();
          }}
        />
      </View>
      <ModalAviso
        visible={error}
        setVisible={() => {
          setError(false);
        }}
        textBoton="Aceptar"
        mensaje={"Se ha producido un error"}
      />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
