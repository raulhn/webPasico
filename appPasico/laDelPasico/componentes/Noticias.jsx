import { FlatList, Pressable } from "react-native";
import React, { useState, useEffect } from "react";
import { CardBlog, AnimatedCardBlog } from "./CardBlog.jsx";
import { View, Text } from "react-native";
import { StyleSheet, ActivityIndicator } from "react-native";

const serviceNoticias = require("../servicios/serviceNoticias.js");

export function Noticias() {
  const [listaNoticias, obtenerNoticias] = useState([]);
  const [cargando, setCargando] = useState(true); // Estado para controlar la carga

  const [presionado, setPresionado] = useState(null);

  useEffect(() => {
    serviceNoticias.obtenerUltimasNoticias().then((v_noticias) => {
      let array_noticias = v_noticias["componente_blog"].slice(0, 6);
      obtenerNoticias(array_noticias);
      setCargando(false); // Finaliza la carga
    });
  }, []);

  if (cargando) {
    // Muestra un indicador de carga mientras se descargan los datos
    return (
      <View style={styles.cargandoContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando noticias...</Text>
      </View>
    );
  }

  return (
    <View style={{ display: "flex" }}>
      <FlatList
        onScrollEndDrag={() => {
          setPresionado(null); // Cambia el estado a no presionado al hacer scroll
        }}
        style={{ flexGrow: 1, backgroundColor: "white" }}
        data={listaNoticias}
        keyExtractor={(noticia) => noticia.nid_imagen}
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
            <AnimatedCardBlog noticia={item}></AnimatedCardBlog>
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
    opacity: 0.8, // Cambia la opacidad al presionar
  },
});
