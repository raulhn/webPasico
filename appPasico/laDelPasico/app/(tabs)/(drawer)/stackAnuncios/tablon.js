import { View, Text, Modal, FlatList, ActivityIndicator } from "react-native";

import { useTipoTablon } from "../../../../hooks/useTipoTablon";
import { useContext, useState } from "react";
import { AuthContext } from "../../../../providers/AuthContext";
import { useRol } from "../../../../hooks/useRol";
import { useTablonAnuncios } from "../../../../hooks/useTablonAnuncios";
import FormularioTablon from "../../../../componentes/componentesTablon/formularioTablon.jsx";
import {
  BotonFixed,
  Boton,
} from "../../../../componentes/componentesUI/ComponentesUI";
import { StyleSheet, RefreshControl, Pressable } from "react-native";

import CardAnuncio from "../../../../componentes/componentesTablon/cardAnuncio.jsx";

import { Link } from "expo-router";

export default function Tablon() {
  const { cerrarSesion, usuario } = useContext(AuthContext);
  const { tiposTablon, cargando, error, lanzarRefresco } =
    useTipoTablon(cerrarSesion);

  const [modalVisible, setModalVisible] = useState(false);
  const [presionado, setPresionado] = useState(null);

  const { esRol } = useRol();
  const {
    anuncios: tablonAnuncios,
    lanzarRefresco: lanzarRefrescoAnuncios,
    refrescar: refrescarAnuncios,
    error: errorAnuncios,
  } = useTablonAnuncios(cerrarSesion, usuario);

  if (cargando) {
    return (
      <View style={styles.cargandoContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando anuncios...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Error al cargar los tipos de tablón</Text>
        <Boton nombre="Reintentar" onPress={lanzarRefresco}></Boton>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={{ flex: 1 }}
        data={tablonAnuncios}
        keyExtractor={(item) => item.nid_tablon_anuncio.toString()}
        renderItem={({ item }) => (
          <Link
            href={{
              pathname: "/stackAnuncios/[nidAnuncio]",
              params: { nidAnuncio: item.nid_tablon_anuncio },
            }}
            key={item.nid_tablon_anuncio}
            asChild
          >
            <Pressable
              onTouchStart={() => {
                setPresionado(item.nid_tablon_anuncio); // Cambia el estado a presionado
              }}
              onTouchEnd={() => {
                setPresionado(null); // Cambia el estado a no presionado
              }}
              style={
                presionado === item.nid_tablon_anuncio
                  ? styles.tarjetaPresionada
                  : null
              }
            >
              <CardAnuncio anuncio={item} />
            </Pressable>
          </Link>
        )}
        ListEmptyComponent={
          <View style={styles.cargandoContainer}>
            <Text>No hay anuncios disponibles</Text>
          </View>
        }
        refreshControl={
          <RefreshControl
            refreshing={refrescarAnuncios}
            onRefresh={() => {
              setPresionado(null);
              lanzarRefrescoAnuncios();
            }}
          />
        }
        onScrollEndDrag={() => {
          setPresionado(null); // Cambia el estado a no presionado al hacer scroll
        }}
      />
      <View
        style={[
          esRol(["ADMINISTRADOR", "PROFESOR"])
            ? { display: "flex" }
            : { display: "none" },
          styles.botonAdd,
        ]}
      >
        <BotonFixed
          onPress={() => {
            setModalVisible(true);
          }}
        />
      </View>

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
            lanzarRefrescoAnuncios();
          }}
          nidTipoTablon={null}
        />
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    justifyContent: "center",
    flex: 1,
  },
  cargandoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },

  tarjetaPresionada: {
    transform: [{ scale: 1.05 }],
  },
  botonAdd: { position: "absolute", bottom: 30, right: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  tarjetaPresionada: {
    transform: [{ scale: 1.05 }],
  },
  cargandoContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
