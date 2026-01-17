import { useAgendaEventos } from "../../../hooks/general/useAgendaEventos";
import { View, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EntradaTexto, Boton } from "../../componentesUI/ComponentesUI.jsx";
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
  const [nidEvento, setIdEvento] = useState(evento.nid_evento || null);

  function registrarEventoFormulario() {
    if (!nidEvento) {
      const nuevoEvento = {
        nombre: nombre,
        descripcion: descripcion,
        fecha: fecha,
      };
      const respuesta = registrarEvento(nuevoEvento);
      if (respuesta.error) {
        console.log("Error al registrar el evento:", respuesta.error);
      } else {
        console.log("Evento registrado con éxito:", respuesta);
      }
    } else {
      const eventoActualizado = {
        nid_evento: nidEvento,
        nombre: nombre,
        descripcion: descripcion,
        fecha: fecha,
      };
      const respuesta = actualizarEvento(eventoActualizado);
      if (respuesta.error) {
        console.log("Error al actualizar el evento:", respuesta.error);
      } else {
        console.log("Evento actualizado con éxito:", respuesta);
      }
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
        <Text>Fecha</Text>
        <EntradaTexto
          setValor={(valor) => {
            setFecha(valor);
          }}
          valor={fecha}
        />
        <Boton
          nombre="Guardar"
          onPress={() => {
            registrarEventoFormulario();
            volver();
          }}
        />
        <Boton
          nombre="Volver"
          onPress={() => {
            volver();
          }}
        />
      </View>
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
