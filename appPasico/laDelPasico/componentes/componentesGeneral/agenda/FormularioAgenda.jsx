import { useAgendaEventos } from "../../../hooks/general/useAgendaEventos";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import Constantes from "../../../config/constantes.js";
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
  const [hora, setHora] = useState(evento.hora ? hora.split(":")[0] : "");
  const [minutos, setMinutos] = useState(evento.hora ? hora.split(":")[1] : "");

  console.log("Evento recibido en el formulario:", evento);
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
    <ScrollView>
      <View style={estilos.container}>
        <Text style={estilos.titulo}>Registrar Agenda </Text>

        <Text style={estilos.label}>Nombre</Text>
        <EntradaTexto
          placeholder={"Nombre"}
          setValor={(valor) => {
            setNombre(valor);
          }}
          valor={nombre}
        />

        <Text style={estilos.label}>Descripción</Text>
        <EntradaTexto
          placeholder={"Descripción"}
          setValor={(valor) => {
            setDescripcion(valor);
          }}
          valor={descripcion}
          ancho={300}
          alto={100}
          multiline={true}
        />

        <Text style={estilos.label}>Fecha</Text>
        <EntradaFecha
          onChangeFecha={(valor) => {
            setFecha(valor);
          }}
          valorFecha={fecha}
        />

        <Text style={estilos.label}>Hora</Text>
        <View style={{ flexDirection: "row", gap: 10, alignItems: "center" }}>
          <EntradaTexto
            placeholder={"HH"}
            ancho={50}
            setValor={(valor) => {
              const valorHora = parseInt(valor);
              if ((valorHora >= 0 && valorHora < 24) || valorHora === "") {
                setHora(valorHora);
              }
            }}
            valor={hora}
          />
          <Text>:</Text>
          <EntradaTexto
            ancho={50}
            placeholder={"MM"}
            setValor={(valor) => {
              const valorMinuto = parseInt(valor);
              if (
                (valorMinuto >= 0 && valorMinuto < 60) ||
                valorMinuto === ""
              ) {
                setMinutos(valorMinuto);
              }
            }}
            valor={minutos}
          />
        </View>
        <CheckBox
          item={{ etiqueta: "Público", valor: publicado }}
          valorSeleccionado={publicado == "S" ? true : false}
          setValorSeleccionado={(item, seleccionado) => {
            setPublicado(seleccionado ? "S" : "N");
          }}
        />

        <View style={estilos.actionsRow}>
          <Boton
            nombre="Guardar"
            onPress={() => {
              registrarEventoAgenda();
            }}
          />
          <Boton
            nombre="Volver"
            color={Constantes.COLOR_ROJO}
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
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  titulo: {
    fontSize: 22,
    fontWeight: "700",
    color: Constantes.COLOR_AZUL,
    marginBottom: 16,
    textAlign: "center",
  },
  label: {
    alignSelf: "flex-start",
    marginLeft: 12,
    marginBottom: 6,
    color: "#444",
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    width: "100%",
    marginTop: 12,
  },
});
