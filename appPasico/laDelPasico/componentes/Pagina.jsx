import React, { useEffect, useState } from "react";
import serviceComponentes from "../servicios/serviceComponentes.js";
import Componente from "./componentesPagina/componente.jsx";
import { FlatList } from "react-native";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import constantes from "../constantes.js";

export default function Pagina(pagina) {
  const [componentes, setComponentes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    serviceComponentes
      .recuperarComponentes(pagina.nidPagina)
      .then((data) => {
        setComponentes(data.data);

        setCargando(false); // Finaliza la carga
      })
      .catch((error) => {});
  }, [pagina.nidPagina]);

  if (cargando) {
    return (
      <View>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando noticias...</Text>
      </View>
    );
  }

  console.log(componentes);
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        style={{ flexGrow: 1, backgroundColor: "white" }}
        data={componentes}
        keyExtractor={(item) => item.nid_Componente.toString()}
        renderItem={({ item }) => <Componente componente={item} />}
        contentContainerStyle={styles.flatListContent}
      ></FlatList>
    </View>
  );
}

const styles = StyleSheet.create({
  imagen: {
    width: "100%",
    height: 400,
    shadowRadius: 10,
  },
  imageContainer: {
    width: "100%",
    height: "auto",
    backgroundColor: "white",
  },
  scrollContainer: {
    padding: 10,
    backgroundColor: "#f9f9f9",
  },
  textoContainer: {
    backgroundColor: "white",
    borderRadius: 5,
  },
  flatListContent: {
    flexGrow: 1,
  },
});
