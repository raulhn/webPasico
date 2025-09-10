import {
  View,
  Text,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  StyleSheet,
  Modal,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useTablonAnuncio } from "../../../../hooks/useTablonAnuncios";
import Constantes from "../../../../config/constantes.js";
import {
  BotonFixed,
  ModalConfirmacion,
} from "../../../../componentes/componentesUI/ComponentesUI.jsx";
import { useRol } from "../../../../hooks/useRol.js";
import FormularioTablon from "../../../../componentes/componentesTablon/formularioTablon.jsx";
import { useState } from "react";
import FormularioNotificacion from "../../../../componentes/notificaciones/FormularioNotificacion.jsx";
import { useContext } from "react";
import { AuthContext } from "../../../../providers/AuthContext.js";
import ServiceTablon from "../../../../servicios/serviceTablon.js";
import { useRouter } from "expo-router";
import { useAsignaturasProfesor } from "../../../../hooks/escuela/useAsignaturas.js";

export default function Anuncio() {
  const [modalAvisoVisible, setModalAvisoVisible] = useState(false);
  const { cerrarSesion, usuario } = useContext(AuthContext);
  const [modalVisibleSelector, setModalVisibleSelector] = useState(false);
  const { nidAnuncio } = useLocalSearchParams();
  const { esRol } = useRol();
  const { anuncio, cargando, error, refrescar, lanzarRefresco } =
    useTablonAnuncio(nidAnuncio, cerrarSesion, usuario);
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();

  const {asignaturas: asignaturasProfesor} = useAsignaturasProfesor();

  function formatearFecha(fechaISO) {
    if (!fechaISO) return "";
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  if (cargando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Constantes.COLOR_AZUL} />
      </View>
    );
  }

  async function refrescarModal() {
    try {
      setModalAvisoVisible(false);
      lanzarRefresco();
    } catch (error) {}
  }

  async function eliminarTablonAnuncio(nidAnuncio) {
    try {
      await ServiceTablon.eliminarTablonAnuncio(nidAnuncio, cerrarSesion);
      console.log("Anuncio eliminado correctamente");
      setModalAvisoVisible(false);
      router.replace("/(tabs)/(drawer)/tablon");
    } catch (error) {
      console.error("Error al eliminar el anuncio:", error);
    }
  }

  function botonNotificar() {
    let rol_director = esRol(["ADMINISTRADOR"]);

    if (!rol_director) {
      return null; // No mostrar el botón si no es director o administrador
    }
    return (
      <View style={styles.botonFixLeft}>
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

  function permisoEdicion()
  {
    if (esRol(["PROFESOR"]))
    {
      if(anuncio.nid_asignatura)
      {
        for(let asignaturaProfesor of asignaturasProfesor)
        {3
          if(asignaturaProfesor.nid_asignatura === anuncio.nid_asignatura)
          {
            return true;
          }
        }
      }
      else{return false}
    }
    return esRol(["ADMINISTRADOR"]);
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refrescar} onRefresh={lanzarRefresco} />
      }
    >
      <Text style={styles.titulo}>{anuncio.titulo}</Text>
     
      <Text style={styles.tipo}>{anuncio.tipo_tablon}</Text>
      <View style={styles.descripcionBox}>
        <Text style={styles.descripcion}>{anuncio.descripcion}</Text>
        <Text style={styles.fecha}>{formatearFecha(anuncio.fecha_creacion)}</Text>
      </View>

      <View
        style={[
          permisoEdicion() ? { display: "flex" } : { display: "none" },
          styles.botonEditar,
        ]}
      >
        <View style={{ gap: 10 }}>
          <BotonFixed
            onPress={() => {
              setModalAvisoVisible(true);
            }}
            icon="close"
            colorBoton={Constantes.COLOR_ROJO}
          />
          <BotonFixed
            onPress={() => {
              setModalVisible(true);
            }}
            icon="mode-edit"
          />
        </View>
      </View>
      {botonNotificar()}

      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <FormularioTablon
          accionCancelar={() => setModalVisible(false)}
          callback={() => {
            setModalVisible(false);
            lanzarRefresco();
          }}
          nidTablonAnuncionDefecto={anuncio.nid_tablon_anuncio}
        />
      </Modal>

      <ModalConfirmacion
        visible={modalAvisoVisible}
        setVisible={refrescarModal}
        textBoton={"Aceptar"}
        textBotonCancelar={"Cancelar"}
        mensaje="¿Estás seguro de que quieres eliminar el anuncio"
        accion={() => {
          eliminarTablonAnuncio(anuncio.nid_tablon_anuncio);
        }}
        accionCancelar={() => {
          setModalAvisoVisible(false);
        }}
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
          valorMensaje={anuncio.descripcion}
          valorTitulo={anuncio.titulo}
          nid_asignatura={anuncio.nid_asignatura}
          tipo={
            anuncio.nid_tipo_tablon == Constantes.GENERAL
              ? ""
              : anuncio.nid_tipo_tablon
          }
          data={{
            pathname: "/Anuncio/[nidAnuncio]",
            params: { nidAnuncio: anuncio.nid_tablon_anuncio },
          }}
        />
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f6f8fa",
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f6f8fa",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    color: Constantes.COLOR_AZUL,
    marginBottom: 8,
  },
  fecha: {
    fontSize: 14,
    color: "#888",
    marginBottom: 4,
    alignSelf: "flex-end",
  },
  tipo: {
    fontSize: 15,
    color: "#0077b6",
    fontWeight: "600",
    marginBottom: 12,
  },
  descripcionBox: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  descripcion: {
    fontSize: 16,
    color: "#333",
    lineHeight: 22,
  },
  botonEditar: { position: "absolute", bottom: 30, right: 20 },
  botonFixLeft: {
    position: "absolute",
    bottom: 30,
    left: 20,
    zIndex: 1,
  },
});
