import { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Animated,
  Pressable,
} from "react-native";
import { Link } from "expo-router";

const constantes = require("../constantes.js");
const url_imagen = constantes.URL_SERVICIO + "imagen_url/";

export function CardBlog({ noticia }) {
  const [imageHeight, setImageHeight] = useState(200); // Altura inicial predeterminada

  const handleImageLoad = (event) => {
    const { width, height } = event.nativeEvent.source;
    const containerWidth = 350; // Ancho máximo del contenedor (puedes ajustarlo según tu diseño)
    const calculatedHeight = (height / width) * containerWidth; // Calcula la altura proporcional
    setImageHeight(calculatedHeight); // Actualiza la altura del contenedor
  };

  return (
    <View key={noticia.nid_imagen} style={styles.container}>
      <Text key={noticia.nid_imagen} style={styles.titulo}>
        {noticia.titulo}
      </Text>
      <View style={[styles.imageContainer, { height: imageHeight }]}>
        <Image
          source={{ uri: url_imagen + noticia.nid_imagen }}
          style={styles.imagen}
          resizeMode="contain"
          onLoad={handleImageLoad}
        />
      </View>
      <Text style={styles.textoDescripcion}>{noticia.descripcion}</Text>
    </View>
  );
}

export function AnimatedCardBlog({ noticia, index }) {
  const opacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(opacity, {
      toValue: 1,
      duration: 500,
      delay: index * 250,
      useNativeDriver: true,
    }).start();
  }, [opacity, index]);

  return (
    <Link
      href={{
        pathname: "/pagina/[nidPagina]",
        params: { nidPagina: noticia.nid_menu, titulo: noticia.titulo },
      }}
      key={noticia.nid_menu}
      asChild
    >
      <Pressable>
        <Animated.View
          style={{
            opacity,
            transform: [
              {
                translateY: opacity.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0],
                }),
              },
            ],
          }}
        >
          <CardBlog noticia={noticia} />
        </Animated.View>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 5,
    margin: 20,
    paddingBottom: 10,
    backgroundColor: "#f0f0f0",
    shadowColor: "black",
  },
  titulo: {
    fontWeight: "bold",
    fontSize: 30,
    padding: 3,
  },
  imagen: {
    width: "100%",
    height: "100%",
    shadowRadius: 10,
    resizeMode: "contain",
  },
  imageContainer: {
    width: "100%",
    maxWidth: 500,
    overflow: "hidden",
    padding: 10,
  },
  textoDescripcion: {
    padding: 10,
  },
});
