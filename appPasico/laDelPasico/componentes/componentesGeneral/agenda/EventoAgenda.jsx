import { View, Text, StyleSheet, Modal } from "react-native";
import { obtenerFechaFormateada } from "../../../comun/fechas.js";
import {
  BotonFixed,
  ModalConfirmacion,
} from "../../componentesUI/ComponentesUI.jsx";
import * as Constantes from "../../../config/constantes.js";
import { useState } from "react";
import { useRol } from "../../../hooks/useRol.js";
import FormularioAgenda from "./FormularioAgenda.jsx";
import { useAgendaEventos } from "../../../hooks/general/useAgendaEventos.js";
import { AuthContext } from "../../../providers/AuthContext";
import { useContext } from "react";
import FormularioEvento from "../../componentesBanda/FormularioEvento.jsx";

export default function EventoAgenda({ evento, accion }) {
  const [modalEdicionVisible, setModalEdicionVisible] = useState(false);
  const [visibleAvisoEliminalo, setVisibleAvisoEliminado] = useState(false);
  const { esRol } = useRol();
  const { cerrarSesion } = useContext(AuthContext);
  const { eliminarEvento } = useAgendaEventos(cerrarSesion);

  function Formulario(evento) {
    if (evento.tipo === "Agenda") {
      return (
        <FormularioAgenda
          evento={evento}
          volver={() => {
            setModalEdicionVisible(false);
            accion();
          }}
        />
      );
    } else if (evento.tipo === "Concierto") {
      return (
        <FormularioEvento
          cancelar={() => setModalEdicionVisible(false)}
          callback={() => {
            setModalEdicionVisible(false);
            accion();
          }}
          nidEvento={evento.nid_evento}
        />
      );
    }
  }
  function addBotonEditar() {
    if (esRol([Constantes.ROL_ADMINISTRADOR])) {
      return (
        <BotonFixed
          onPress={() => {
            setModalEdicionVisible(true);
          }}
          icon="mode-edit"
          colorBoton={Constantes.COLOR_AZUL}
          size={30}
        />
      );
    }
    return null;
  }

  function addBotonEliminar() {
    if (esRol([Constantes.ROL_ADMINISTRADOR])) {
      return (
        <BotonFixed
          onPress={() => {
            setVisibleAvisoEliminado(true);
          }}
          icon="delete"
          colorBoton={Constantes.COLOR_ROJO}
          size={30}
        />
      );
    }
    return null;
  }

  return (
    <View style={estilos.contenedorEvento}>
      <Text style={estilos.tituloEvento}>{evento.nombre}</Text>
      <Text style={estilos.descripcionEvento}>{evento.descripcion}</Text>
      <Text style={estilos.fechaEvento}>
        {obtenerFechaFormateada(evento.fecha)}
      </Text>
      <View style={{ flexDirection: "row", marginTop: 10, gap: 10 }}>
        {addBotonEditar()}
        {addBotonEliminar()}
      </View>
      <Modal
        visible={modalEdicionVisible}
        animationType="slide"
        onRequestClose={() => setModalEdicionVisible(false)}
      >
        {/* Aquí iría el formulario de edición del evento */}
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          {Formulario(evento)}
        </View>
      </Modal>
      <ModalConfirmacion
        visible={visibleAvisoEliminalo}
        setVisible={() => {
          setVisibleAvisoEliminado(false);
        }}
        titulo="Eliminar Evento"
        mensaje="¿Estás seguro de que deseas eliminar este evento?"
        accion={() => {
          eliminarEvento(evento.nid_evento).then(() => {
            setVisibleAvisoEliminado(false);
            accion();
          });
        }}
        accionCancelar={() => {
          setVisibleAvisoEliminado(false);
        }}
        textBoton={"Eliminar"}
        textBotonCancelar={"Cancelar"}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedorEvento: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#f9f9f9",
  },
  tituloEvento: {
    fontSize: 16,
    fontWeight: "bold",
  },
  descripcionEvento: {
    fontSize: 14,
    color: "#666",
  },
  fechaEvento: {
    fontSize: 12,
    color: "#999",
  },
});
