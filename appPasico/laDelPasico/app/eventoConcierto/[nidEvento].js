import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { useEffect, useState, useContext } from "react";

import CardPartitura from "../../componentes/componentesPartitura/CardPartitura";
import ServiceEventoConcierto from "../../servicios/serviceEventoConcierto";
import { ActivityIndicator, Modal } from "react-native";
import { AuthContext } from "../../providers/AuthContext";
import SelectorPersona from "../../componentes/persona/SelectorPersona";
import FormularioNotificacion from "../../componentes/notificaciones/FormularioNotificacion";
import {
  BotonFixed,
  ModalAviso,
  ModalConfirmacion,
} from "../../componentes/componentesUI/ComponentesUI";
import SelectorPartituras from "../../componentes/componentesPartitura/SelectorPartituras";
import { useRol } from "../../hooks/useRol";
import FormularioEvento from "../../componentes/componentesBanda/FormularioEvento";

export default function EventoConcierto() {
  const { esRol } = useRol();
  const [evento, setEvento] = useState(null);
  const [partituras, setPartituras] = useState([]);
  const [cargando, setCargando] = useState(true);

  const { nidEvento } = useLocalSearchParams();

  const { cerrarSesion } = useContext(AuthContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalAvisoVisible, setModalAvisoVisible] = useState(false);
  const [modalErrorVisible, setModalErrorVisible] = useState(false);
  const [mensaje, setMensaje] = useState("");

  const [modalVisibleSelector, setModalVisibleSelector] = useState(false);

  const [modalEdicionVisible, setModalEdicionVisible] = useState(false);

  const [refrescar, setRefrescar] = useState(false);
  const [nidPartituraSeleccionada, setNidPartituraSeleccionada] =
    useState(null);

  const refrescarModal = () => {
    setModalAvisoVisible(false);
  };

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
          setRefrescar(!refrescar);
        }
      });
    } catch (error) {
      console.error("Error al registrar la partitura en el evento:", error);
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
          setRefrescar(!refrescar);
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
        setEvento(eventoData.evento_concierto);

        setPartituras(eventoData.partituras);
        setCargando(false);
      })
      .catch((error) => {
        console.error("Error al obtener el evento:", error);
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
  if (evento.fecha_evento) {
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
          color="#007CFA"
        />
      </View>
    );
  }

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
          color="#007CFA"
          size={30}
        />
      </View>
    );
  }

  return (
    <>
      <View style={estilos.container}>
        <View style={estilos.infoEvento}>
          {botonEdicion()}
          <Text style={estilos.tituloEvento}>
            {evento ? evento.nombre : "Cargando..."}
          </Text>
          <Text> {evento.descripcion}</Text>
          <Text> {formattedDate}</Text>
        </View>
        <View style={estilos.contenedorPartituras}>
          <Text style={estilos.legend}>Partituras del Evento</Text>
        </View>
        <FlatList
          data={partituras}
          style={{ width: "100%", flexGrow: 1 }}
          keyExtractor={(item) => item.nid_partitura.toString()}
          contentContainerStyle={{}}
          renderItem={({ item }) => (
            <View style={{ alignItems: "center" }}>
              <CardPartitura
                partitura={item}
                edicion={edicion}
                onPress={() => {
                  console.log("Partitura seleccionada:", item);
                }}
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
          >
            <Text
              style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}
            >
              Selecciona una Partitura
            </Text>
          </View>
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
              console.log("Notificación enviada");
            }}
            valorMensaje={evento.descripcion}
            valorTitulo={evento.nombre}
            tipo="MUSICOS"
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
    color: "#007CFA",
    marginBottom: 8,
  },
  label: {
    fontWeight: "bold",
    color: "#333",
    marginTop: 6,
  },
  valor: {
    color: "#444",
    marginBottom: 4,
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
