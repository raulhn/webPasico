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
  const [nidEvento, setIdEvento] = useState(evento.nid_agenda_evento || null);
  const [error, setError] = useState(null);
  const [tipoSeleccionado, setTipoSeleccionado] = useState(null);

  const tipos = [
    { etiqueta: "General", valor: 1 },
    { etiqueta: "Banda", valor: 2 },
  ];
  function registrarEventoFormulario() {
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
        <Text>Tipo</Text>
        <EntradaGroupRadioButton
          titulo={"Tipo de Evento"}
          opciones={tipos}
          valor={tipoSeleccionado}
          setValorSeleccionado={(valor) => {
            setTipoSeleccionado(valor);
          }}
        />
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
