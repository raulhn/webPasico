import { FlatList, RefreshControl } from "react-native";
import React, { useState, useEffect } from "react";
import { CardBlog, AnimatedCardBlog } from "./CardBlog.jsx";
import { View, Text } from "react-native";
import { StyleSheet, ActivityIndicator } from "react-native";
import { Pressable } from "react-native";
import { Boton } from "./componentesUI/ComponentesUI.jsx";

const serviceNoticias = require("../servicios/serviceNoticias.js");

export default function ComponenteGalerias() {
  const [listaGalerias, obtenerGalerias] = useState([]);
  const [cargando, setCargando] = useState(true); // Estado para controlar la carga
  const [presionado, setPresionado] = useState(null);
  const [refrescar, setRefresco] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    serviceNoticias
      .obtenerGalerias()
      .then((v_galerias) => {
        let arrayGaleria = v_galerias["componente_blog"].slice(0, 6);
        obtenerGalerias(arrayGaleria);
        setRefresco(false);
        setCargando(false);
      })
      .catch((error) => {
        console.log("Error al obtener galerias:", error);
        setError(true); // Asegúrate de finalizar la carga incluso si hay un error
        setCargando(false);
      });
  }, [refrescar]);

  if (cargando) {
    // Muestra un indicador de carga mientras se descargan los datos
    return (
      <View style={styles.cargandoContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando galerias...</Text>
      </View>
    );
  }

  if (error) {
    // Muestra un mensaje de error si no se pueden cargar las galerías
    return (
      <View style={styles.cargandoContainer}>
        <Text>Error al cargar las galerías</Text>
        <Boton
          nombre={"Reintentar"}
          onPress={() => {
            setCargando(true);
            setRefresco(true);
            setError(false);
          }}
        />
      </View>
    );
  }

  return (
    <View style={{ display: "flex" }}>
      <FlatList
        onScrollEndDrag={() => {
          setPresionado(null); // Cambia el estado a no presionado al hacer scroll
        }}
        refreshControl={
          <RefreshControl
            refreshing={refrescar}
            onRefresh={() => setRefresco(true)}
          />
        }
        style={{ flexGrow: 1, backgroundColor: "white" }}
        data={listaGalerias}
        keyExtractor={(galeria) => galeria.nid_imagen}
        renderItem={({ item }) => (
          <Pressable
            onTouchStart={() => {
              setPresionado(item.nid_imagen); // Cambia el estado a presionado
            }}
            onTouchEnd={() => {
              setPresionado(null); // Cambia el estado a no presionado
            }}
            style={
              presionado === item.nid_imagen ? styles.tarjetaPresionada : null
            }
          >
            <AnimatedCardBlog ruta={"/stackGaleria/paginaGaleria/[nidPaginaGaleria]"} noticia={item}></AnimatedCardBlog>
          </Pressable>
        )}
        contentContainerStyle={styles.flatListContent} // Estilo para el contenedor de la lista
      ></FlatList>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Asegura que el contenedor ocupe todo el espacio disponible
    backgroundColor: "white",
  },
  cargandoContainer: {
    flex: 1, // Centra el indicador de carga en la pantalla
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: 10,
  },
  flatListContent: {
    flexGrow: 1, // Permite que la lista crezca dinámicamente
  },
  tarjetaPresionada: {
    transform: [{ scale: 1.05 }],
  },
});
