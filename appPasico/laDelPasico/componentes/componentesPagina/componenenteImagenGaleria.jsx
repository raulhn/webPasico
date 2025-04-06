import React from "react";
import constantes from "../../constantes.js";
import { StyleSheet, Image, View } from "react-native";

export default function ComponenteImagenGaleria(imagen) {
  const url_imagen = constantes.URL_SERVICIO + "imagen_url/";

  return (
    <View style={styles.imageContainer}>
      <Image
        source={{ uri: url_imagen + imagen.url }}
        style={styles.imagen}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  imagen: {
    width: "100%",
    height: 130,
    shadowRadius: 10,
  },
  imageContainer: {
    width: "100%",
    backgroundColor: "white",
    maxWidth: "100%",
    padding: 5,
    overflow: "hidden",
    borderRadius: 30,
  },
});
