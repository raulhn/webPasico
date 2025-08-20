import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, FlatList, RefreshControl } from "react-native";
import { useEffect, useState, useContext } from "react";

import CardPartitura from "../../componentes/componentesPartitura/CardPartitura";
import ServiceEventoConcierto from "../../servicios/serviceEventoConcierto";
import { ActivityIndicator, Modal } from "react-native";
import { AuthContext } from "../../providers/AuthContext";
import Constantes from "../../config/constantes";

import FormularioNotificacion from "../../componentes/notificaciones/FormularioNotificacion";
import {
  BotonFixed,
  ModalAviso,
  ModalConfirmacion,
} from "../../componentes/componentesUI/ComponentesUI";
import SelectorPartituras from "../../componentes/componentesPartitura/SelectorPartituras";
import { useRol } from "../../hooks/useRol";
import FormularioEvento from "../../componentes/componentesBanda/FormularioEvento";
import { useRouter } from "expo-router";

export default function EventoConcierto() {
  const router = useRouter();
  const { esRol } = useRol();
  const [evento, setEvento] = useState(null);
  const [partituras, setPartituras] = useState([]);
  const [cargando, setCargando] = useState(true);

  const { nidEvento } = useLocalSearchParams();

  const { cerrarSesion } = useContext(AuthContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalAvisoVisible, setModalAvisoVisible] = useState(false);
  const [modalAvisoEliminarVisible, setModalAvisoEliminarVisible] =
    useState(false);
  const [modalErrorVisible, setModalErrorVisible] = useState(false);
  const [tiposEvento, setTiposEvento] = useState([]);
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState(false);

  const [modalVisibleSelector, setModalVisibleSelector] = useState(false);

  const [modalEdicionVisible, setModalEdicionVisible] = useState(false);

  const [refrescar, setRefrescar] = useState(false);
  const [nidPartituraSeleccionada, setNidPartituraSeleccionada] =
    useState(null);

  const refrescarModal = () => {
    setModalAvisoVisible(false);
  };

  const arrayColores = [
    "#FF5733",
    "#33FF57",
    "#8A2BE2",
    "#FF4500",
    "#1E90FF",
    "#FFD700",
  ];

  function registrarPartituraEvento(nidPartitura) {
    try {
      ServiceEventoConcierto.registrarPartituraEvento(
        nidPartitura,
        nidEvento,
        cerrarSesion
      ).then((response) => {
        if (response.error) {
          setMensaje(response.mensaje);
          setModalErrorVisible(true);
        } else {
          setModalVisible(false);
          setRefrescar(true);
        }
      });
    } catch (error) {
      console.log("Error al registrar la partitura en el evento:", error);
      setMensaje("Error al registrar la partitura en el evento");
      setModalErrorVisible(true);
    }
  }

  function eliminarPartituraEvento(nidPartitura) {
    ServiceEventoConcierto.eliminarPartituraEvento(
      nidPartitura,
      nidEvento,
      cerrarSesion
    )
      .then((response) => {
        if (response.error) {
          setNidPartituraSeleccionada(null);
          return;
        } else {
          setNidPartituraSeleccionada(null);
          setRefrescar(true);
        }
      })
      .catch((error) => {
        setNidPartituraSeleccionada(null);
      });
  }

  const cancelarPartituraEvento = () => {
    setModalAvisoVisible(false);
    setNidPartituraSeleccionada(null);
  };

  useEffect(() => {
    ServiceEventoConcierto.obtenerEventoConcierto(nidEvento, cerrarSesion)
      .then((eventoData) => {
        console.log("EventoConcierto -> Evento obtenido:", eventoData);
        setEvento(eventoData.evento_concierto);
        setTiposEvento(eventoData.tipos_evento);
        setPartituras(eventoData.partituras);
        setCargando(false);
        setRefrescar(false);
      })
      .catch((error) => {
        setCargando(false);
        setRefrescar(false);
        setError(true);
      });
  }, [nidEvento, refrescar]);

  if (cargando) {
    return <ActivityIndicator />;
  }

  const edicion = {
    colorBoton: "red",
    icono: "close",
    size: 30,
    accion: (nidPartitura) => {
      setNidPartituraSeleccionada(nidPartitura);
      setModalAvisoVisible(true);
    },
  };

  const rol_director = esRol(["DIRECTOR", "ADMINISTRADOR"]);

  let formattedDate;
  if (evento && evento.fecha_evento) {
    const fechaFormateada = new Date(evento.fecha_evento);
    formattedDate = fechaFormateada.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  function botonNuevo() {
    let rol_director = esRol(["DIRECTOR", "ADMINISTRADOR"]);
    if (!rol_director) {
      return null; // No mostrar el botón si no es director o administrador
    }
    return (
      <View style={estilos.botonFix}>
        <BotonFixed
          onPress={() => {
            setModalVisible(true);
          }}
        />
      </View>
    );
  }

  /**
   * Si el usuario es director o administrador, se muestra el botón de notificación
   * @returns ç
   */
  function botonNotificar() {
    let rol_director = esRol(["DIRECTOR", "ADMINISTRADOR"]);
    if (!rol_director) {
      return null; // No mostrar el botón si no es director o administrador
    }
    return (
      <View style={estilos.botonFixLeft}>
        <BotonFixed
          onPress={() => {
            setModalVisibleSelector(true);
          }}
          icon="notifications"
          color={Constantes.COLOR_AZUL}
        />
      </View>
    );
  }

  /**
   * Se incluyee las bandas asociadas al evento
   * @returns
   */
  function incluirTipos() {
    if (!tiposEvento) {
      return null;
    }

    let muestraTipos = [];
    for (let i = 0; i < tiposEvento.length; i++) {
      let color =
        arrayColores[tiposEvento[i].nid_tipo_musico % arrayColores.length];

      muestraTipos.push(
        <View style={{ flexDirection: "row" }} key={i}>
          <Text style={{ fontWeight: "bold", color: color }}>
            {tiposEvento[i].descripcion}{" "}
          </Text>
        </View>
      );
    }
    return muestraTipos;
  }

  /**
   * En caso de que el usuario sea director o administrador, se muestra el botón de edición
   * @returns
   */
  function botonEdicion() {
    let rol_director = esRol(["DIRECTOR", "ADMINISTRADOR"]);
    if (!rol_director) {
      return null; // No mostrar el botón si no es director o administrador
    }
    return (
      <View style={estilos.botonFixTop}>
        <BotonFixed
          onPress={() => {
            setModalEdicionVisible(true);
          }}
          icon="mode-edit"
          color={Constantes.COLOR_AZUL}
          size={30}
        />
        <BotonFixed
          onPress={() => {
            setModalAvisoEliminarVisible(true);
          }}
          icon="close"
          colorBoton={Constantes.COLOR_ROJO}
          size={30}
        />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error al cargar el evento</Text>
        <BotonFixed
          onPress={() => {
            setCargando(true);
            setRefrescar(true);
            setError(false);
          }}
          icon="refresh"
          color={Constantes.COLOR_AZUL}
        />
      </View>
    );
  }

  async function eliminarEventoConcierto(nidEvento) {
    try {
      await ServiceEventoConcierto.eliminarEventoConcierto(
        nidEvento,
        cerrarSesion
      );
      console.log("Evento eliminado correctamente");
      setModalAvisoEliminarVisible(false);
      router.replace("/(tabs)/(banda)/eventos");
    } catch (error) {
      console.error("Error al eliminar el evento:", error);
    }
  }

  return (
    <>
      <View style={estilos.container}>
        <View style={estilos.infoEvento}>
          {botonEdicion()}
          <Text style={estilos.tituloEvento}>
            {evento ? evento.nombre : "Cargando..."}
          </Text>
          <Text numberOfLines={2}>{evento.descripcion}</Text>
          <View
            style={[
              { flexDirection: "row" },
              evento.vestimenta ? {} : { display: "none" },
            ]}
          >
            <Text style={estilos.label}>Vestimenta:</Text>
            <Text style={estilos.valor}> {evento.vestimenta}</Text>
          </View>
          <View
            style={[
              { flexDirection: "row" },
              evento.lugar ? {} : { display: "none" },
            ]}
          >
            <Text style={estilos.label}>Lugar:</Text>
            <Text style={estilos.valor}> {evento.lugar}</Text>
          </View>
          <View style={{ flexDirection: "row", gap: 5 }}>{incluirTipos()}</View>
          <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
            <Text
              style={{
                color: Constantes.COLOR_AZUL,
                fontWeight: "bold",
              }}
            >
              Fecha:
            </Text>
            <Text> {formattedDate}</Text>
          </View>
        </View>

        <View style={estilos.contenedorPartituras}>
          <Text style={estilos.legend}>Partituras del Evento</Text>
        </View>
        <FlatList
          refreshControl={
            <RefreshControl
              refreshing={refrescar}
              onRefresh={() => {
                setRefrescar(true);
              }}
            />
          }
          data={partituras}
          style={{ width: "100%", flexGrow: 1 }}
          keyExtractor={(item) => item.nid_partitura.toString()}
          contentContainerStyle={{}}
          renderItem={({ item }) => (
            <View style={{ alignItems: "center" }}>
              <CardPartitura
                partitura={item}
                edicion={edicion}
                onPress={() => {}}
                rolEdicion={rol_director}
              />
            </View>
          )}
        />
        {botonNuevo()}
        {botonNotificar()}

        <Modal
          animationType="slide"
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(false);
          }}
        >
          <View
            style={{
              paddingTop: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text
              style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}
            >
              Selecciona una Partitura
            </Text>
          </View>
          <SelectorPartituras callback={registrarPartituraEvento} />
        </Modal>

        <ModalConfirmacion
          visible={modalAvisoEliminarVisible}
          setVisible={() => setModalAvisoEliminarVisible(false)}
          textBoton={"Aceptar"}
          textBotonCancelar={"Cancelar"}
          mensaje="¿Estás seguro de que quieres eliminar el evento"
          accion={() => {
            eliminarEventoConcierto(evento.nid_evento_concierto);
          }}
          accionCancelar={() => {
            setModalAvisoEliminarVisible(false);
          }}
        />

        <Modal
          animationType="slide"
          visible={modalEdicionVisible}
          onRequestClose={() => {
            setModalEdicionVisible(false);
          }}
        >
          <View
            style={{
              paddingTop: 10,
              justifyContent: "center",
              alignItems: "center",
            }}
          ></View>
          <FormularioEvento
            cancelar={() => setModalEdicionVisible(false)}
            nidEvento={nidEvento}
            callback={() => {
              setModalEdicionVisible(false);
              setRefrescar(!refrescar);
            }}
          />
        </Modal>

        <ModalConfirmacion
          visible={modalAvisoVisible}
          setVisible={refrescarModal}
          textBoton={"Aceptar"}
          textBotonCancelar={"Cancelar"}
          mensaje="¿Estás seguro de que quieres eliminar esta partitura del evento?"
          accion={() => {
            eliminarPartituraEvento(nidPartituraSeleccionada);
          }}
          accionCancelar={cancelarPartituraEvento}
        />

        <ModalAviso
          visible={modalErrorVisible}
          setVisible={() => {
            setModalErrorVisible(false);
          }}
          mensaje={mensaje}
          textBoton={"Aceptar"}
        />

        <Modal
          animationType="slide"
          visible={modalVisibleSelector}
          onRequestClose={() => {
            setModalVisibleSelector(false);
          }}
        >
          <FormularioNotificacion
            cancelar={() => {
              setModalVisibleSelector(false);
            }}
            callback={() => {
              setModalVisibleSelector(false);
            }}
            valorMensaje={evento.descripcion}
            valorTitulo={evento.nombre}
            tipo={Constantes.BANDA}
            data={{
              pathname: "/eventoConcierto/[nidEvento]",
              params: { nidEvento: nidEvento },
            }}
          />
        </Modal>
      </View>
    </>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    gap: 20,
    backgroundColor: "#fff",
    alignItems: "center",
    height: "100%",
  },
  infoEvento: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    marginBottom: 10,
    shadowColor: "#000",
    borderColor: "#ccc",
    borderWidth: 1,
    position: "relative",
  },
  tituloEvento: {
    fontSize: 20,
    fontWeight: "bold",
    color: Constantes.COLOR_AZUL,
    marginBottom: 8,
  },
  label: {
    fontWeight: "bold",
    color: "#333",
  },
  valor: {
    color: "#444",
  },
  legend: {
    fontSize: 18,
    color: "#666",
    marginTop: 4,
    marginBottom: 5,
  },
  contenedorPartituras: {
    width: "100%",
    backgroundColor: "white",
    borderRadius: 12,

    borderColor: "#ccc",

    alignItems: "center",
  },
  botonFix: {
    position: "absolute",
    bottom: 30,
    right: 20,
  },
  botonFixTop: {
    position: "absolute",
    top: 20,
    right: 20,
    zIndex: 1,
    flexDirection: "row",
    gap: 10,
  },
  botonFixLeft: {
    position: "absolute",
    bottom: 30,
    left: 20,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
});
