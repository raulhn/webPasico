import { useAgendaEventos } from "../../../hooks/general/useAgendaEventos";
import { View, Text, StyleSheet } from "react-native";
import {
  EntradaTexto,
  Boton,
  ModalAviso,
  EntradaFecha,
  CheckBox,
} from "../../componentesUI/ComponentesUI.jsx";
import { useState } from "react";

export default function FormularioAgenda({
  evento = { nombre: "", descripcion: "", fecha: null, publicado: "N" },
  fechaDefecto,
  volver = () => {},
  cerrar_sesion,
}) {
  const { registrarEvento, actualizarEvento, eliminarEvento } =
    useAgendaEventos(cerrar_sesion);
  const [nombre, setNombre] = useState(evento.nombre);
  const [descripcion, setDescripcion] = useState(evento.descripcion);
  const [fecha, setFecha] = useState(
    evento.fecha ? evento.fecha : fechaDefecto
  );
  const [publicado, setPublicado] = useState(evento.publicado);
  const [nidEvento, setIdEvento] = useState(evento.nid_evento || null);
  const [error, setError] = useState(null);

  function formatearFecha(fecha) {
    const formattedDate = `${fecha.getFullYear()}-${String(
      fecha.getMonth() + 1
    ).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;
    return formattedDate;
  }

  function registrarEventoAgenda() {
    if (!nidEvento) {
      const nuevoEvento = {
        nombre: nombre,
        descripcion: descripcion,
        fecha: fecha,
        publicado: publicado,
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
        publicado: publicado,
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
      <EntradaFecha
        onChangeFecha={(valor) => {
          setFecha(valor);
        }}
        valorFecha={fecha}
      />
      <CheckBox
        item={{ etiqueta: "Publico", valor: publicado }}
        valorSeleccionado={publicado == "S" ? true : false}
        setValorSeleccionado={(item, seleccionado) => {
          console.log("Item seleccionado", item);
          console.log("Seleccionado", seleccionado);
          setPublicado(seleccionado ? "S" : "N");
          console.log(publicado);
        }}
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <Boton
          nombre="Guardar"
          onPress={() => {
            registrarEventoAgenda();
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
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    justifyContent: "center",
    alignItems: "center",
  },
});
