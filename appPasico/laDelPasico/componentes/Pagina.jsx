import React, { useEffect, useState } from "react";
import serviceComponentes from "../servicios/serviceComponentes.js";
import Componente from "./componentesPagina/componente.jsx";
import { FlatList } from "react-native";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
} from "react-native";

const { width, height } = Dimensions.get("window");

export default function Pagina({ nidPagina, excepcionComponentes = [] }) {
  const [componentes, setComponentes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    serviceComponentes
      .recuperarComponentes(nidPagina)
      .then((data) => {
        setComponentes(data.data);

        setCargando(false); // Finaliza la carga
      })
      .catch((error) => {});
  }, [nidPagina]);

  if (cargando) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#667eea" />
        <Text style={styles.loadingText}>Cargando contenido...</Text>
      </View>
    );
  }

  function existeExcepcion(nid_componente) {
    for (let i = 0; i < excepcionComponentes.length; i++) {
      console.log(
        "componente en excepciones:",
        excepcionComponentes[i],
        "comparado con:",
        nid_componente
      );
      if (excepcionComponentes[i] == nid_componente) {
        return true;
      }
    }
    return false;
  }

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.flatList}
        data={componentes}
        keyExtractor={(item) => item.nid_Componente.toString()}
        renderItem={({ item }) => (
          <>
            {item.nTipo === 1 && !existeExcepcion(item.nid_Componente) && (
              <View style={styles.componentWrapper}>
                <Componente componente={item} />
              </View>
            )}
            {item.nTipo !== 1 && !existeExcepcion(item.nid_Componente) && (
              <Componente componente={item} />
            )}
          </>
        )}
        contentContainerStyle={styles.flatListContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // Contenedor principal
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },

  // Loading styles
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
    paddingHorizontal: 20,
  },

  loadingText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "500",
    color: "#64748b",
    textAlign: "center",
  },

  // FlatList styles
  flatList: {
    flex: 1,
    backgroundColor: "transparent",
  },

  flatListContent: {
    flexGrow: 1,
    paddingVertical: 16,
    paddingHorizontal: 16,
  },

  // Component wrapper
  componentWrapper: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    marginVertical: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3, // Para Android
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },

  // Separator between components
  separator: {
    height: 8,
  },

  // Imagen styles (mejorados)
  imagen: {
    width: "100%",
    height: 240,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },

  imageContainer: {
    width: "100%",
    backgroundColor: "#ffffff",
    borderRadius: 12,
    overflow: "hidden",
  },

  // Contenedor de scroll (mejorado)
  scrollContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#f8fafc",
  },

  // Contenedor de texto (mejorado)
  textoContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
});
