import {
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  StyleSheet,
  Modal,
} from "react-native";
import { useAgendaEvento } from "../../../hooks/general/useAgendaEventos.js";
import { useRol } from "../../../hooks/useRol.js";
import { Boton, BotonFixed } from "../../componentesUI/ComponentesUI.jsx";
import { router } from "expo-router";
import { obtenerFechaFormateadaSoloFecha } from "../../../comun/fechas.js";
import FormularioNotificacion from "../../notificaciones/FormularioNotificacion.jsx";
import { useState } from "react";
import Constantes from "../../../config/constantes.js";

export default function DetalleEvento({ nid_evento, tipo, cerrar_sesion }) {
  const [modalVisibleNotificacion, setModalVisibleNotificacion] =
    useState(false);
  const { evento, error, cargando } = useAgendaEvento(
    nid_evento,
    tipo,
    cerrar_sesion
  );

  const { esRol } = useRol();
  if (cargando) {
    return (
      <View style={styles.cargandoContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.cargandoText}>Cargando evento...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorIcon}>⚠️</Text>
        <Text style={styles.errorText}>Error al cargar el evento</Text>
        <Text style={styles.errorSubText}>Por favor, inténtalo de nuevo</Text>
      </View>
    );
  }
  function botonNotificar() {
    let rol_director = esRol(["DIRECTOR", "ADMINISTRADOR"]);
    if (!rol_director) {
      return null; // No mostrar el botón si no es director o administrador
    }
    return (
      <View style={styles.botonFixed}>
        <BotonFixed
          onPress={() => {
            setModalVisibleNotificacion(true);
          }}
          size={45}
          icon="notifications"
          color={Constantes.COLOR_AZUL}
        />
      </View>
    );
  }

  function addBotonBanda() {
    if (esRol(["MUSICO"]) && evento.tipo == "Banda") {
      return (
        <View
          style={{
            marginTop: 10,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Boton
            nombre="Ver Banda"
            onPress={() => {
              router.push({
                pathname: "stackAgenda/evento/[nidEvento]",
                params: {
                  nidEvento: evento.nid_evento,
                },
              });
            }}
          />
        </View>
      );
    }
  }

  const getTipoColor = (tipoEvento) => {
    switch (tipoEvento?.toLowerCase()) {
      case "banda":
        return "#ea580c";
      case "agenda":
        return "#3498db";
      case "clase":
        return "#f39c12";
      default:
        return "#667eea";
    }
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header del evento */}
      <View style={styles.header}>
        <Text style={styles.eventoTitle}>{evento?.nombre || "Sin título"}</Text>
        {evento?.tipo && (
          <View
            style={[
              styles.tipoBadge,
              { backgroundColor: getTipoColor(evento.tipo) },
            ]}
          >
            <Text style={styles.tipoText}>{evento.tipo}</Text>
          </View>
        )}
      </View>

      {/* Información principal */}
      <View style={styles.infoCard}>
        <View style={styles.infoRow}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>📅</Text>
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Fecha</Text>
            <Text style={styles.infoValue}>
              {evento.fecha
                ? obtenerFechaFormateadaSoloFecha(evento.fecha)
                : "No especificada"}
            </Text>
          </View>
        </View>

        <View style={styles.separator} />

        <View style={styles.infoRow}>
          <View style={styles.iconContainer}>
            <Text style={styles.iconText}>⏰</Text>
          </View>
          <View style={styles.infoContent}>
            <Text style={styles.infoLabel}>Hora</Text>
            <Text style={styles.infoValue}>
              {evento?.hora || "No especificada"}
            </Text>
          </View>
        </View>
      </View>

      {/* Descripción */}
      {evento?.descripcion && (
        <View style={styles.descripcionCard}>
          <View style={styles.descripcionHeader}>
            <Text style={styles.iconText}>📋</Text>
            <Text style={styles.descripcionTitle}>Descripción</Text>
          </View>
          <Text style={styles.descripcionText}>{evento.descripcion}</Text>
        </View>
      )}
      {addBotonBanda()}
      {botonNotificar()}
      <Modal
        animationType="slide"
        visible={modalVisibleNotificacion}
        onRequestClose={() => {
          setModalVisibleNotificacion(false);
        }}
      >
        <FormularioNotificacion
          cancelar={() => {
            setModalVisibleNotificacion(false);
          }}
          callback={() => {
            setModalVisibleNotificacion(false);
          }}
          valorMensaje={
            "Infomar sobre el evento: " +
            (evento?.nombre || "Evento sin título")
          }
          valorTitulo={evento?.nombre || "Evento sin título"}
          tipo={Constantes.GENERAL}
          data={{
            pathname: "/stackAgenda/[nidAgenda]",
            params: {
              nidAgenda: nid_evento,
              tipo: tipo,
            },
          }}
        />
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // === CONTENEDORES PRINCIPALES ===
  container: {
    height: "100%",
    backgroundColor: "#f8fafc",
  },
  scrollContent: {
    paddingBottom: 30,
  },

  // === ESTADOS DE CARGA Y ERROR ===
  cargandoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 20,
  },
  cargandoText: {
    marginTop: 16,
    fontSize: 18,
    color: "#667eea",
    fontWeight: "500",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 30,
  },
  errorIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 20,
    color: "#e74c3c",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  errorSubText: {
    fontSize: 16,
    color: "#64748b",
    textAlign: "center",
    lineHeight: 22,
  },

  // === HEADER DEL EVENTO ===
  header: {
    backgroundColor: "#2563eb", // Azul moderno
    // backgroundColor: "#059669", // Verde elegante
    // backgroundColor: "#dc2626", // Rojo vibrante
    // backgroundColor: "#7c3aed", // Púrpura
    // backgroundColor: "#ea580c", // Naranja
    // backgroundColor: "#0891b2", // Cian
    // backgroundColor: "#be185d", // Rosa magenta
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 30,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 24,
    shadowColor: "#2563eb",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  eventoTitle: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 32,
  },

  // === BADGE DEL TIPO ===
  tipoBadge: {
    alignSelf: "center",
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  tipoText: {
    color: "#ffffff",
    fontWeight: "600",
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  // === TARJETAS DE INFORMACIÓN ===
  infoCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    borderRadius: 16,
    paddingVertical: 20,
    paddingHorizontal: 24,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  // === FILAS DE INFORMACIÓN ===
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  iconText: {
    fontSize: 20,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    color: "#64748b",
    fontWeight: "500",
    marginBottom: 4,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 18,
    color: "#1e293b",
    fontWeight: "600",
    lineHeight: 24,
  },
  separator: {
    height: 1,
    backgroundColor: "#e2e8f0",
    marginVertical: 16,
    marginHorizontal: -8,
  },

  // === TARJETA DE DESCRIPCIÓN ===
  descripcionCard: {
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  descripcionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  descripcionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1e293b",
    marginLeft: 12,
    letterSpacing: 0.3,
  },
  descripcionText: {
    fontSize: 16,
    color: "#475569",
    lineHeight: 24,
    textAlign: "justify",
  },

  // === ESTILOS BÁSICOS (FALLBACK) ===
  basicContainer: {
    flex: 1,
    backgroundColor: "#ffffff",
    padding: 20,
  },
  basicText: {
    fontSize: 16,
    color: "#000000",
    marginBottom: 10,
  },
  basicTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000000",
    marginBottom: 20,
    textAlign: "center",
  },
  basicCard: {
    backgroundColor: "#f5f5f5",
    padding: 15,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#dddddd",
  },

  // === ESTILO PARA EL NOMBRE DEL EVENTO ===
  eventoNombre: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 15,
    textAlign: "center",
  },

  // === ESTILOS PARA LA DESCRIPCIÓN ===
  descripcionLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginTop: 10,
    marginBottom: 8,
  },
  descripcionTexto: {
    fontSize: 16,
    color: "#4b5563",
    lineHeight: 22,
    marginBottom: 15,
    textAlign: "justify",
  },

  // === ESTILOS PARA LA FECHA ===
  fechaLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginTop: 10,
    marginBottom: 8,
  },
  fechaTexto: {
    fontSize: 16,
    color: "#059669",
    fontWeight: "500",
    marginBottom: 15,
  },

  // === ESTILOS PARA LA HORA ===
  horaLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginTop: 10,
    marginBottom: 8,
  },
  horaTexto: {
    fontSize: 16,
    color: "#dc2626",
    fontWeight: "500",
    marginBottom: 15,
  },

  // === ESTILOS PARA EL TIPO ===
  tipoLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#374151",
    marginTop: 10,
    marginBottom: 8,
  },
  tipoTexto: {
    fontSize: 16,
    color: "#7c3aed",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 15,
  },
  botonFixed: {
    position: "absolute",
    bottom: 20,
    right: 20,
    zIndex: 10,
  },
});
