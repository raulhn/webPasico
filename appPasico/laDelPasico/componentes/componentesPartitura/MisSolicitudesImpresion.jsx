/* eslint-disable no-unused-vars */
import { useContext, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

import Constantes from "../../config/constantes";
import { AuthContext } from "../../providers/AuthContext";
import ServiceSolicitudesImpresion from "../../servicios/serviceSolicitudesImpresion";
import {
  Boton,
  ModalAviso,
  ModalConfirmacion,
} from "../componentesUI/ComponentesUI";
import {
  esEstadoSolicitudCancelable,
  formatearFechaSolicitud,
  normalizarListadoSolicitudesImpresion,
  normalizarSolicitudImpresion,
  obtenerColorEstadoSolicitud,
  resumirArchivosSolicitud,
} from "./solicitudesImpresionUtils";

export default function MisSolicitudesImpresion({
  nidPartitura,
  visible = true,
  refresco = 0,
  onActualizada,
  titulo = "Mis solicitudes recientes",
  mensajeVacio = "Aún no has enviado solicitudes para esta partitura.",
  limite = 5,
  permitirCancelacion = true,
  mostrarPartitura = false,
}) {
  const { cerrarSesion } = useContext(AuthContext);
  const [cargando, setCargando] = useState(false);
  const [solicitudes, setSolicitudes] = useState([]);
  const [detalles, setDetalles] = useState({});
  const [abiertas, setAbiertas] = useState({});
  const [detalleCargandoId, setDetalleCargandoId] = useState(null);
  const [cancelandoId, setCancelandoId] = useState(null);
  const [solicitudCancelar, setSolicitudCancelar] = useState(null);
  const [mensajeAviso, setMensajeAviso] = useState("");
  const [errorCarga, setErrorCarga] = useState("");

  useEffect(() => {
    if (visible) {
      cargarSolicitudes();
    }
  }, [nidPartitura, refresco, visible]);

  async function cargarSolicitudes() {
    setCargando(true);
    setErrorCarga("");

    try {
      const respuesta = await ServiceSolicitudesImpresion.obtenerSolicitudesImpresion(
        nidPartitura ? { nid_partitura: nidPartitura } : {},
        cerrarSesion
      );

      if (respuesta?.error) {
        throw new Error(
          respuesta?.mensaje || "No se pudieron cargar las solicitudes"
        );
      }

      const solicitudesNormalizadas = normalizarListadoSolicitudesImpresion(respuesta);
      setSolicitudes(
        Number.isInteger(limite)
          ? solicitudesNormalizadas.slice(0, limite)
          : solicitudesNormalizadas
      );
    } catch (error) {
      setErrorCarga("No se pudieron cargar tus solicitudes recientes.");
    } finally {
      setCargando(false);
    }
  }

  async function alternarDetalle(solicitud) {
    const estaAbierta = Boolean(abiertas[solicitud.id]);
    if (estaAbierta) {
      setAbiertas((previo) => ({
        ...previo,
        [solicitud.id]: false,
      }));
      return;
    }

    setAbiertas((previo) => ({
      ...previo,
      [solicitud.id]: true,
    }));

    if (detalles[solicitud.id]) {
      return;
    }

    setDetalleCargandoId(solicitud.id);

    try {
      const respuesta = await ServiceSolicitudesImpresion.obtenerSolicitudImpresion(
        solicitud.id,
        cerrarSesion
      );

      if (respuesta?.error) {
        throw new Error(respuesta?.mensaje || "No se pudo obtener el detalle");
      }

      setDetalles((previo) => ({
        ...previo,
        [solicitud.id]: normalizarSolicitudImpresion(
          respuesta?.solicitud || respuesta,
          0
        ),
      }));
    } catch (error) {
      setMensajeAviso("No se pudo obtener el detalle de la solicitud.");
    } finally {
      setDetalleCargandoId(null);
    }
  }

  async function cancelarSolicitud() {
    if (!solicitudCancelar) {
      return;
    }

    setCancelandoId(solicitudCancelar.id);

    try {
      const respuesta =
        await ServiceSolicitudesImpresion.cancelarSolicitudImpresion(
          solicitudCancelar.id,
          cerrarSesion
        );

      if (respuesta?.error) {
        throw new Error(respuesta?.mensaje || "No se pudo cancelar la solicitud");
      }

      setSolicitudCancelar(null);
      await cargarSolicitudes();
      if (onActualizada) {
        onActualizada();
      }
    } catch (error) {
      setMensajeAviso("No se pudo cancelar la solicitud seleccionada.");
    } finally {
      setCancelandoId(null);
    }
  }

  if (!visible) {
    return null;
  }

  return (
    <View style={styles.contenedor}>
      <View style={styles.cabecera}>
        <Text style={styles.titulo}>{titulo}</Text>
        <Boton nombre="Refrescar" onPress={cargarSolicitudes} />
      </View>

      {cargando ? (
        <View style={styles.centrado}>
          <ActivityIndicator size="small" color={Constantes.COLOR_AZUL} />
          <Text style={styles.textoSecundario}>Cargando solicitudes...</Text>
        </View>
      ) : null}

      {!cargando && errorCarga ? (
        <Text style={styles.error}>{errorCarga}</Text>
      ) : null}

      {!cargando && !errorCarga && solicitudes.length === 0 ? (
        <Text style={styles.textoSecundario}>{mensajeVacio}</Text>
      ) : null}

      {!cargando &&
        !errorCarga &&
        solicitudes.map((solicitud) => {
          const detalle = detalles[solicitud.id] || solicitud;
          const colorEstado = obtenerColorEstadoSolicitud(solicitud.estado);
          const estaAbierta = Boolean(abiertas[solicitud.id]);
          const cargandoDetalle = detalleCargandoId === solicitud.id;
          const cancelando = cancelandoId === solicitud.id;

          return (
            <View key={solicitud.id} style={styles.cardSolicitud}>
              <View style={styles.filaCabeceraSolicitud}>
                <View
                  style={[
                    styles.estado,
                    {
                      backgroundColor: colorEstado,
                    },
                  ]}
                >
                  <Text style={styles.textoEstado}>
                    {solicitud.estadoEtiqueta}
                  </Text>
                </View>
                <Text style={styles.fecha}>
                  {formatearFechaSolicitud(solicitud.fechaSolicitud)}
                </Text>
              </View>

              <View style={styles.filaInfo}>
                <MaterialIcons name="description" size={18} color="#555" />
                <Text style={styles.textoInfo}>
                  {resumirArchivosSolicitud(detalle)}
                </Text>
              </View>

              {mostrarPartitura && detalle.partitura?.titulo ? (
                <View style={styles.filaInfo}>
                  <MaterialIcons name="music-note" size={18} color="#555" />
                  <Text style={styles.textoInfo}>
                    Partitura: {detalle.partitura.titulo}
                  </Text>
                </View>
              ) : null}

              {detalle.rangoPaginas ? (
                <View style={styles.filaInfo}>
                  <MaterialIcons name="filter-1" size={18} color="#555" />
                  <Text style={styles.textoInfo}>
                    Páginas: {detalle.rangoPaginas}
                  </Text>
                </View>
              ) : null}

              {detalle.escalaPorcentaje ? (
                <View style={styles.filaInfo}>
                  <MaterialIcons name="zoom-out-map" size={18} color="#555" />
                  <Text style={styles.textoInfo}>
                    Escala: {detalle.escalaPorcentaje}%
                  </Text>
                </View>
              ) : null}

              <View style={styles.filaBotones}>
                <Boton
                  nombre={
                    cargandoDetalle
                      ? "Cargando..."
                      : estaAbierta
                        ? "Ocultar detalle"
                        : "Ver detalle"
                  }
                  onPress={() => alternarDetalle(solicitud)}
                />
                {permitirCancelacion &&
                esEstadoSolicitudCancelable(solicitud.estado) ? (
                  <Boton
                    nombre={cancelando ? "Cancelando..." : "Cancelar"}
                    color={Constantes.COLOR_ROJO}
                    onPress={() => setSolicitudCancelar(solicitud)}
                  />
                ) : null}
              </View>

              {estaAbierta ? (
                <View style={styles.detalle}>
                  {detalle.trabajoCups ? (
                    <Text style={styles.textoDetalle}>
                      Trabajo CUPS: {detalle.trabajoCups}
                    </Text>
                  ) : null}
                  {detalle.mensaje ? (
                    <Text style={styles.textoDetalle}>{detalle.mensaje}</Text>
                  ) : null}
                  {detalle.mensajeError ? (
                    <Text style={[styles.textoDetalle, styles.error]}>
                      {detalle.mensajeError}
                    </Text>
                  ) : null}
                  {detalle.ejecuciones?.length > 0 ? (
                    <Text style={styles.textoDetalle}>
                      Historial: {detalle.ejecuciones.length} ejecución(es)
                    </Text>
                  ) : null}
                </View>
              ) : null}
            </View>
          );
        })}

      <ModalAviso
        visible={Boolean(mensajeAviso)}
        setVisible={() => setMensajeAviso("")}
        mensaje={mensajeAviso}
        textBoton="Aceptar"
      />

      <ModalConfirmacion
        visible={Boolean(solicitudCancelar)}
        setVisible={() => setSolicitudCancelar(null)}
        mensaje="¿Quieres cancelar esta solicitud de impresión?"
        textBoton="Cancelar solicitud"
        textBotonCancelar="Cerrar"
        accion={cancelarSolicitud}
        accionCancelar={() => setSolicitudCancelar(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    marginTop: 20,
    gap: 12,
  },
  cabecera: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  titulo: {
    color: Constantes.COLOR_AZUL,
    fontSize: 18,
    fontWeight: "bold",
    flex: 1,
  },
  centrado: {
    alignItems: "center",
    gap: 8,
    paddingVertical: 10,
  },
  textoSecundario: {
    color: "#555",
  },
  error: {
    color: Constantes.COLOR_ROJO,
  },
  cardSolicitud: {
    backgroundColor: Constantes.COLOR_GRIS,
    borderRadius: 12,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: "#d8e7ff",
  },
  filaCabeceraSolicitud: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    alignItems: "center",
    flexWrap: "wrap",
  },
  estado: {
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  textoEstado: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  fecha: {
    color: "#555",
    fontSize: 12,
  },
  filaInfo: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  textoInfo: {
    color: "#222",
    flex: 1,
  },
  filaBotones: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  detalle: {
    borderTopWidth: 1,
    borderTopColor: "#d8e7ff",
    paddingTop: 10,
    gap: 6,
  },
  textoDetalle: {
    color: "#333",
  },
});
