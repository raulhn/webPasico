import { useEffect, useRef } from 'react';
import { View, Text, Image, StyleSheet, Animated } from 'react-native';

const constantes = require('../constantes.js');
const url_imagen = constantes.URL_SERVICIO + 'imagen_url/';

export function CardBlog({ noticia }) {
  return (
    <View key={noticia.nid_imagen} style={styles.container}>
      <Text key={noticia.nid_imagen} style={styles.titulo}>
        {noticia.titulo}
      </Text>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: url_imagen + noticia.nid_imagen }}
          style={styles.imagen}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.textoDescripcion}>{noticia.descripcion}</Text>
    </View>
  );
}

export function AnimatedGameCard({ noticia, index }) {
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
      }}>
      <CardBlog noticia={noticia} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 5,
    margin: 20,
    paddingBottom: 10,
    backgroundColor: '#f0f0f0',
    shadowColor: 'black',
  },
  titulo: {
    fontWeight: 'bold',
    fontSize: 30,
  },
  imagen: {
    width: '100%', // Asegúrate de que la imagen ocupe todo el ancho del contenedor
    height: '100%', // Asegúrate de que la imagen ocupe toda la altura del contenedor
    shadowRadius: 10,
  },
  imageContainer: {
    width: 380,
    height: 400,
    overflow: 'hidden',
    padding: 20,
  },
  textoDescripcion: {
    marginTop: 10,
  },
});
