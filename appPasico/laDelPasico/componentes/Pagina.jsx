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
import Constantes from "../config/constantes.js";

const { width, height } = Dimensions.get("window");

export default function Pagina({
  nidPagina,
  excepcionComponentes = [],
  incluirTitulo = false,
}) {
  const [componentes, setComponentes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [titulo, setTitulo] = useState("");

  useEffect(() => {
    serviceComponentes
      .recuperarComponentes(nidPagina)
      .then((data) => {
        setComponentes(data.data);
        setCargando(false); // Finaliza la carga
        if (data.data.length > 0) {
          setTitulo(data.data[0].titulo);
        }
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
      if (excepcionComponentes[i] == nid_componente) {
        return true;
      }
    }
    return false;
  }
  return (
    <View style={styles.container}>
      {incluirTitulo && (
        <View style={styles.containerTitulo}>
          <Text style={styles.titulo}>{titulo}</Text>
        </View>
      )}
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
    justifyContent: "center",
    alignItems: "center",
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
  titulo: {
    fontSize: 22,
    fontWeight: "700",
    color: "#ffffff",
    textAlign: "center",
    letterSpacing: 0.5,
    lineHeight: 28,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  containerTitulo: {
    width: "92%",
    backgroundColor: Constantes.COLOR_AZUL,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: "auto",
    marginTop: 8,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    borderWidth: 0,
    // Gradiente simulado con overlay
    position: "relative",
    overflow: "hidden",
  },
});
