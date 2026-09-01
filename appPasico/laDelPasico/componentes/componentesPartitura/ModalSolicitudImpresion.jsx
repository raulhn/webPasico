/* eslint-disable no-unused-vars */
import { MaterialIcons } from "@expo/vector-icons";
import { useContext, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import Constantes from "../../config/constantes";
import { AuthContext } from "../../providers/AuthContext";
import ServiceSolicitudesImpresion from "../../servicios/serviceSolicitudesImpresion";
import {
  Boton,
  CheckBox,
  EntradaTexto,
  ModalAviso,
  ModalExito,
} from "../componentesUI/ComponentesUI";
import MisSolicitudesImpresion from "./MisSolicitudesImpresion";
import {
  formatearFechaSolicitud,
  generarIdempotencyKeyImpresion,
  normalizarInspeccionImpresion,
  normalizarSolicitudImpresion,
  obtenerColorEstadoSolicitud,
  validarRangoPaginasImpresion,
} from "./solicitudesImpresionUtils";

const MAX_PAGINAS_POR_ARCHIVO = 6;

function construirSeleccionInicial(archivos) {
  return archivos.reduce((resultado, archivo) => {
    resultado[archivo.id] = Boolean(archivo.seleccionadoPorDefecto);
    return resultado;
  }, {});
}

function serializarArchivosSeleccionados(archivos) {
  return archivos.map((archivo) => ({
    id: archivo.id,
    nombre: archivo.etiqueta,
    descripcion: archivo.descripcion,
    referencia: archivo.referenciaServidor || archivo.id,
    ruta_relativa: archivo.rutaRelativa || undefined,
    paginas: archivo.paginas,
    drive_file_id: archivo.original.drive_file_id,
    web_view_link: archivo.original.web_view_link,
    nombre_archivo: archivo.original.nombre_archivo,
    mime_type: archivo.original.mime_type,
    drive_parent_id: archivo.original.drive_parent_id,
  }));
}

export default function ModalSolicitudImpresion({
  visible,
  setVisible,
  partitura,
}) {
  const { cerrarSesion } = useContext(AuthContext);
  const [cargando, setCargando] = useState(false);
  const [enviando, setEnviando] = useState(false);
  const [inspeccion, setInspeccion] = useState(
    normalizarInspeccionImpresion({}, partitura)
  );
  const [archivosSeleccionados, setArchivosSeleccionados] = useState({});
  const [rangoPaginas, setRangoPaginas] = useState("");
  const [escalaPorcentaje, setEscalaPorcentaje] = useState("100");
  const [errorCarga, setErrorCarga] = useState("");
  const [mensajeAviso, setMensajeAviso] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");
  const [resultadoSolicitud, setResultadoSolicitud] = useState(null);
  const [versionSolicitudes, setVersionSolicitudes] = useState(0);

  const archivosActivos = useMemo(
    () =>
      inspeccion.archivos.filter(
        (archivo) => archivosSeleccionados[archivo.id]
      ),
    [archivosSeleccionados, inspeccion.archivos]
  );

  useEffect(() => {
    if (visible && partitura?.nid_partitura) {
      cargarInspeccion();
    }
  }, [visible, partitura?.nid_partitura]);

  async function cargarInspeccion() {
    setCargando(true);
    setErrorCarga("");
    setResultadoSolicitud(null);

    try {
      const [respuestaInspeccion, respuestaCuotas] = await Promise.allSettled([
        ServiceSolicitudesImpresion.explorarPartituraImpresion(
          partitura.nid_partitura,
          cerrarSesion
        ),
        ServiceSolicitudesImpresion.obtenerCuotasImpresion(cerrarSesion),
      ]);

      const datosInspeccion =
        respuestaInspeccion.status === "fulfilled"
          ? respuestaInspeccion.value
          : {};
      const datosCuotas =
        respuestaCuotas.status === "fulfilled" ? respuestaCuotas.value : {};

      if (respuestaInspeccion.status !== "fulfilled") {
        throw (
          respuestaInspeccion.reason ||
          new Error("No se pudo inspeccionar la partitura")
        );
      }

      if (datosInspeccion?.error) {
        throw new Error(
          datosInspeccion?.mensaje || "No se pudo inspeccionar la partitura"
        );
      }

      const inspeccionNormalizada = normalizarInspeccionImpresion(
        {
          ...datosInspeccion,
          cuota: datosInspeccion?.cuota || datosCuotas?.cuota,
          cuotas: datosInspeccion?.cuotas || datosCuotas?.cuotas,
        },
        partitura
      );

      setInspeccion(inspeccionNormalizada);
      setArchivosSeleccionados(
        construirSeleccionInicial(inspeccionNormalizada.archivos)
      );
      setRangoPaginas(inspeccionNormalizada.rangoPaginas || "1-6");
      setEscalaPorcentaje(
        String(inspeccionNormalizada.escalaPorcentaje || 100)
      );
    } catch (error) {
      setInspeccion(normalizarInspeccionImpresion({}, partitura));
      setArchivosSeleccionados({});
      setErrorCarga(
        error?.message || "No se pudo preparar la solicitud de impresión."
      );
    } finally {
      setCargando(false);
    }
  }

  function actualizarArchivoSeleccionado(archivo, seleccionado) {
    setArchivosSeleccionados((previo) => ({
      ...previo,
      [archivo.id]: seleccionado,
    }));
  }

  function cerrarModal() {
    if (!enviando) {
      setVisible(false);
    }
  }

  async function solicitarImpresion() {
    console.log("Solicitu de impresión");
    if (archivosActivos.length === 0) {
      setMensajeAviso("Selecciona al menos un archivo para imprimir.");
      return;
    }

    const hayPdfSeleccionado = archivosActivos.some(
      (archivo) => archivo.original?.mime_type === "application/pdf"
    );
    if (
      !validarRangoPaginasImpresion(
        rangoPaginas,
        hayPdfSeleccionado ? MAX_PAGINAS_POR_ARCHIVO : null
      )
    ) {
      setMensajeAviso(
        "Indica un rango válido de un máximo de 6 páginas por archivo. Ejemplos: 1-3, 5 o 1-2,4."
      );
      return;
    }

    if (hayPdfSeleccionado && !rangoPaginas.trim()) {
      setMensajeAviso("Indica las páginas a imprimir (máximo 6 por archivo).");
      return;
    }

    const escala = Number.parseInt(escalaPorcentaje, 10);
    if (!Number.isFinite(escala) || escala < 25 || escala > 200) {
      setMensajeAviso("La escala debe estar entre 25 y 200.");
      return;
    }

    setEnviando(true);

    try {
      console.log(
        "Archivos activos:",
        serializarArchivosSeleccionados(archivosActivos)
      );

      console.log("Archivos activos sin serializar:", archivosActivos);

      const payload = {
        nid_partitura: partitura.nid_partitura,
        archivos: serializarArchivosSeleccionados(archivosActivos),
        rango_paginas: rangoPaginas.trim() || null,
        escala_porcentaje: escala,
        idempotency_key: generarIdempotencyKeyImpresion(
          partitura.nid_partitura
        ),
      };

      const respuesta =
        await ServiceSolicitudesImpresion.registrarSolicitudImpresion(
          payload,
          cerrarSesion
        );

      if (respuesta?.error) {
        throw new Error(
          respuesta?.mensaje || "No se pudo registrar la solicitud"
        );
      }

      const solicitudNormalizada = normalizarSolicitudImpresion(
        respuesta?.solicitud || {
          ...respuesta,
          rango_paginas: payload.rango_paginas,
          escala_porcentaje: payload.escala_porcentaje,
          archivos: payload.archivos,
        }
      );

      setResultadoSolicitud(solicitudNormalizada);
      setMensajeExito("Solicitud enviada correctamente.");
      setVersionSolicitudes((valor) => valor + 1);
    } catch (error) {
      setMensajeAviso(
        error?.message || "Se produjo un error al solicitar la impresión."
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <Modal animationType="slide" visible={visible} onRequestClose={cerrarModal}>
      <View style={styles.container}>
        <View style={styles.cabecera}>
          <View style={{ flex: 1 }}>
            <Text style={styles.titulo}>Solicitud de impresión</Text>
            <Text style={styles.subtitulo}>{partitura?.titulo}</Text>
          </View>
          <Pressable onPress={cerrarModal} style={styles.botonCerrar}>
            <MaterialIcons name="close" size={24} color="#fff" />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.cardResumen}>
            <Text style={styles.labelResumen}>Partitura</Text>
            <Text style={styles.valorResumen}>{partitura?.titulo}</Text>
            {partitura?.autor ? (
              <>
                <Text style={styles.labelResumen}>Autor</Text>
                <Text style={styles.textoSecundario}>{partitura.autor}</Text>
              </>
            ) : null}
            {inspeccion.carpeta ? (
              <>
                <Text style={styles.labelResumen}>Carpeta detectada</Text>
                <Text style={styles.textoSecundario}>{inspeccion.carpeta}</Text>
              </>
            ) : null}
          </View>

          {cargando ? (
            <View style={styles.cardCargando}>
              <ActivityIndicator size="large" color={Constantes.COLOR_AZUL} />
              <Text style={styles.textoSecundario}>
                Inspeccionando archivos imprimibles...
              </Text>
            </View>
          ) : null}

          {!cargando && errorCarga ? (
            <View style={styles.cardError}>
              <MaterialIcons name="warning-amber" size={36} color="#f87c00" />
              <Text style={styles.errorTexto}>{errorCarga}</Text>
              <View style={styles.filaBotones}>
                <Boton nombre="Reintentar" onPress={cargarInspeccion} />
                <Boton
                  nombre="Cerrar"
                  color={Constantes.COLOR_ROJO}
                  onPress={cerrarModal}
                />
              </View>
            </View>
          ) : null}

          {!cargando && !errorCarga ? (
            <>
              {inspeccion.mensaje ? (
                <View style={styles.cardInfo}>
                  <MaterialIcons
                    name="info-outline"
                    size={22}
                    color={Constantes.COLOR_AZUL}
                  />
                  <Text style={styles.textoSecundario}>
                    {inspeccion.mensaje}
                  </Text>
                </View>
              ) : null}

              {inspeccion.cuota ? (
                <View style={styles.cardCuota}>
                  <Text style={styles.tituloSeccion}>
                    {inspeccion.cuota.titulo}
                  </Text>
                  {inspeccion.cuota.periodo ? (
                    <Text style={styles.textoSecundario}>
                      Periodo: {inspeccion.cuota.periodo}
                    </Text>
                  ) : null}
                  <View style={styles.filaResumen}>
                    {inspeccion.cuota.limite !== null ? (
                      <View style={styles.itemResumen}>
                        <Text style={styles.numeroResumen}>
                          {inspeccion.cuota.limite}
                        </Text>
                        <Text style={styles.textoResumen}>Límite</Text>
                      </View>
                    ) : null}
                    {inspeccion.cuota.usadas !== null ? (
                      <View style={styles.itemResumen}>
                        <Text style={styles.numeroResumen}>
                          {inspeccion.cuota.usadas}
                        </Text>
                        <Text style={styles.textoResumen}>Usadas</Text>
                      </View>
                    ) : null}
                    {inspeccion.cuota.disponibles !== null ? (
                      <View style={styles.itemResumen}>
                        <Text style={styles.numeroResumen}>
                          {inspeccion.cuota.disponibles}
                        </Text>
                        <Text style={styles.textoResumen}>Disponibles</Text>
                      </View>
                    ) : null}
                  </View>
                </View>
              ) : null}

              <View style={styles.seccion}>
                <Text style={styles.tituloSeccion}>
                  Archivos seleccionables
                </Text>
                {inspeccion.archivos.length === 0 ? (
                  <Text style={styles.textoSecundario}>
                    El servidor no devolvió archivos imprimibles para esta
                    partitura.
                  </Text>
                ) : (
                  inspeccion.archivos.map((archivo) => (
                    <View key={archivo.id} style={styles.cardArchivo}>
                      <CheckBox
                        item={{
                          etiqueta:
                            archivo.original?.nombre_archivo ||
                            archivo.etiqueta,
                          id: archivo.id,
                        }}
                        valorSeleccionado={Boolean(
                          archivosSeleccionados[archivo.id]
                        )}
                        setValorSeleccionado={(item, seleccionado) =>
                          actualizarArchivoSeleccionado(item, seleccionado)
                        }
                      />
                    </View>
                  ))
                )}
              </View>

              <View style={styles.seccion}>
                <Text style={styles.tituloSeccion}>Rango de páginas</Text>
                <EntradaTexto
                  placeholder="Máximo 6 páginas. Ejemplo: 1-2,4"
                  valor={rangoPaginas}
                  setValor={setRangoPaginas}
                  ancho="100%"
                />
                <Text style={styles.tituloSeccion}>Escala (%)</Text>
                <EntradaTexto
                  placeholder="100"
                  valor={escalaPorcentaje}
                  setValor={setEscalaPorcentaje}
                  ancho="100%"
                />
                <Text style={styles.ayuda}>
                  En cada PDF se pueden imprimir hasta 6 páginas. Puedes
                  ajustar el porcentaje entre 25 y 200 para adaptar la impresión.
                </Text>
              </View>

              <View style={styles.filaBotones}>
                <Boton
                  nombre={enviando ? "Enviando..." : "Solicitar impresión"}
                  onPress={solicitarImpresion}
                />
                <Boton
                  nombre="Cerrar"
                  color={Constantes.COLOR_ROJO}
                  onPress={cerrarModal}
                />
              </View>

              {resultadoSolicitud ? (
                <View style={styles.cardResultado}>
                  <View
                    style={[
                      styles.estadoResultado,
                      {
                        backgroundColor: obtenerColorEstadoSolicitud(
                          resultadoSolicitud.estado
                        ),
                      },
                    ]}
                  >
                    <Text style={styles.estadoResultadoTexto}>
                      {resultadoSolicitud.estadoEtiqueta}
                    </Text>
                  </View>
                  <Text style={styles.resultadoTexto}>
                    Solicitud {resultadoSolicitud.id}
                  </Text>
                  <Text style={styles.textoSecundario}>
                    Fecha:{" "}
                    {formatearFechaSolicitud(resultadoSolicitud.fechaSolicitud)}
                  </Text>
                  {resultadoSolicitud.trabajoCups ? (
                    <Text style={styles.textoSecundario}>
                      Trabajo CUPS: {resultadoSolicitud.trabajoCups}
                    </Text>
                  ) : null}
                  {resultadoSolicitud.mensaje ? (
                    <Text style={styles.textoSecundario}>
                      {resultadoSolicitud.mensaje}
                    </Text>
                  ) : null}
                </View>
              ) : null}

              <MisSolicitudesImpresion
                nidPartitura={partitura?.nid_partitura}
                visible={visible}
                refresco={versionSolicitudes}
                onActualizada={() =>
                  setVersionSolicitudes((valor) => valor + 1)
                }
              />
            </>
          ) : null}
        </ScrollView>

        <ModalAviso
          visible={Boolean(mensajeAviso)}
          setVisible={() => setMensajeAviso("")}
          mensaje={mensajeAviso}
          textBoton="Aceptar"
        />
        <ModalExito
          visible={Boolean(mensajeExito)}
          setVisible={() => setMensajeExito("")}
          mensaje={mensajeExito}
          textBoton="Aceptar"
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  cabecera: {
    backgroundColor: Constantes.COLOR_AZUL,
    paddingHorizontal: 20,
    paddingTop: 55,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  titulo: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
  },
  subtitulo: {
    color: "#e6f1ff",
    fontSize: 15,
    marginTop: 4,
  },
  botonCerrar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignItems: "center",
    justifyContent: "center",
  },
  scroll: {
    padding: 20,
    gap: 18,
  },
  cardResumen: {
    backgroundColor: Constantes.COLOR_GRIS,
    borderRadius: 12,
    padding: 16,
    gap: 6,
  },
  labelResumen: {
    color: Constantes.COLOR_AZUL,
    fontWeight: "bold",
  },
  valorResumen: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  textoSecundario: {
    color: "#4b4b4b",
  },
  cardCargando: {
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    paddingVertical: 30,
  },
  cardError: {
    alignItems: "center",
    gap: 12,
    backgroundColor: "#fff8f0",
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: "#ffd8a8",
  },
  errorTexto: {
    color: "#8a3d00",
    textAlign: "center",
  },
  cardInfo: {
    flexDirection: "row",
    gap: 10,
    padding: 14,
    backgroundColor: "#edf5ff",
    borderRadius: 12,
    alignItems: "center",
  },
  cardCuota: {
    backgroundColor: "#f4f9ff",
    borderRadius: 12,
    padding: 16,
    gap: 10,
    borderWidth: 1,
    borderColor: "#d6e8ff",
  },
  filaResumen: {
    flexDirection: "row",
    gap: 12,
    flexWrap: "wrap",
  },
  itemResumen: {
    minWidth: 90,
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  numeroResumen: {
    fontSize: 20,
    fontWeight: "bold",
    color: Constantes.COLOR_AZUL,
  },
  textoResumen: {
    color: "#555",
  },
  seccion: {
    gap: 10,
  },
  tituloSeccion: {
    color: Constantes.COLOR_AZUL,
    fontSize: 18,
    fontWeight: "bold",
  },
  cardArchivo: {
    backgroundColor: Constantes.COLOR_GRIS,
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 4,
  },
  descripcionArchivo: {
    color: "#555",
    paddingHorizontal: 14,
    paddingBottom: 10,
  },
  ayuda: {
    color: "#555",
    fontSize: 12,
  },
  filaBotones: {
    flexDirection: "row",
    gap: 10,
    flexWrap: "wrap",
    justifyContent: "center",
  },
  cardResultado: {
    backgroundColor: "#f7fbff",
    borderRadius: 12,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: "#d6e8ff",
  },
  estadoResultado: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  estadoResultadoTexto: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  resultadoTexto: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
});
