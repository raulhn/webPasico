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
import { useEventoConcierto } from "../../../hooks/banda/useEventoConcierto.js";
import { AuthContext } from "../../../providers/AuthContext";
import { useContext } from "react";
import FormularioEvento from "../../componentesBanda/FormularioEvento.jsx";

export default function EventoAgenda({ evento, accion }) {
  const [modalEdicionVisible, setModalEdicionVisible] = useState(false);
  const [visibleAvisoEliminalo, setVisibleAvisoEliminado] = useState(false);
  const { esRol } = useRol();
  const { cerrarSesion } = useContext(AuthContext);
  const { eliminarEvento } = useAgendaEventos(cerrarSesion);
  const { eliminarEventoConcierto } = useEventoConcierto(cerrarSesion);

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
      <View style={estilos.row}>
        <View style={estilos.content}>
          <View style={estilos.titleRow}>
            <Text style={estilos.tituloEvento} numberOfLines={1}>
              {evento.nombre}
            </Text>
            <View style={[estilos.badge, evento.tipo === "Concierto" ? estilos.badgeConcierto : estilos.badgeAgenda]}>
              <Text style={estilos.badgeText}>{evento.tipo === "Concierto" ? "Concierto" : "Agenda"}</Text>
            </View>
          </View>

          <Text style={estilos.descripcionEvento} numberOfLines={2}>
            {evento.descripcion}
          </Text>

          <Text style={estilos.fechaEvento}>
            {obtenerFechaFormateada(evento.fecha)}
          </Text>
        </View>

        <View style={estilos.actions}>
          {addBotonEditar()}
          <View style={{ height: 8 }} />
          {addBotonEliminar()}
        </View>
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
          if (evento.tipo === "Concierto") {
            eliminarEventoConcierto(evento.nid_evento).then(() => {
              setVisibleAvisoEliminado(false);
              accion();
            });
          } else {
            eliminarEvento(evento.nid_evento).then(() => {
              setVisibleAvisoEliminado(false);
              accion();
            });
          }
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
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 6,
    elevation: 2,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  content: {
    flex: 1,
    paddingRight: 8,
  },
  actions: {
    width: 54,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    color: "#fff",
  },
  badgeConcierto: {
    backgroundColor: "#ff7043",
  },
  badgeAgenda: {
    backgroundColor: "#42a5f5",
  },
  tituloEvento: {
    fontSize: 16,
    fontWeight: "700",
    color: "#212121",
  },
  descripcionEvento: {
    fontSize: 14,
    color: "#616161",
    marginBottom: 6,
  },
  fechaEvento: {
    fontSize: 12,
    color: "#9e9e9e",
    marginTop: 2,
  },
});
