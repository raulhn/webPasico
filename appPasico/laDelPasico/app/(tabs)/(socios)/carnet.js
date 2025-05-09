import { ActivityIndicator, Text } from "react-native";
import serviceSocios from "../../../servicios/serviceSocios";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../../providers/AuthContext.js";
import { View, StyleSheet, Image } from "react-native";

export default function Carnet() {
  const [socio, setSocio] = useState(null);
  const [persona, setPersona] = useState(null);

  const { cerrarSesion } = useContext(AuthContext);

  const logo = require("../../../assets/logo asociacion.jpg");

  useEffect(() => {
    serviceSocios
      .obtenerSocio()
      .then((response) => {
        setSocio(response.socio);
        setPersona(response.persona);
      })
      .catch((error) => {
        console.error("Error fetching socio data:", error);
      });
  }, []);

  if (!socio || !persona) {
    return <ActivityIndicator />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.cardBackground}>
        <Image source={logo} imageStyle={styles.logoBackground}></Image>
      </View>
      <View style={[styles.card]}>
        <Text style={styles.title}>Carnet de Socio</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Nombre:</Text>
          <Text style={styles.value}>{persona.nombre}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Primer Apellido:</Text>
          <Text style={styles.value}>{persona.primer_apellido}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Segundo Apellido:</Text>
          <Text style={styles.value}>{persona.segundo_apellido}</Text>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Número de Socio:</Text>
          <Text style={styles.value}>{socio.num_socio}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    position: "relative",
    alignItems: "center",
    backgroundColor: "#f0f0f0", // Fondo gris claro para simular un entorno limpio
  },
  cardBackground: {
    position: "absolute",
    width: 360,
    height: 220,
    zIndex: 1,
    padding: 20,
    margin: 20,
    opacity: 0.1, // Opacidad para el fondo
    borderRadius: 10, // Bordes redondeados
    backgroundColor: "#fff", // Fondo blanco para la tarjeta
    shadowColor: "#000", // Sombra para dar efecto de elevación
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Sombra en Android
    alignItems: "center",
    overflow: "hidden", // Asegura que el logo no se salga de los bordes redondeados
  },
  card: {
    width: 360,
    height: 220,
    zIndex: 2,
    padding: 20,
    borderRadius: 10, // Bordes redondeados
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    shadowColor: "#000", // Sombra para dar efecto de elevación
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Sombra en Android
    alignItems: "center",
    overflow: "hidden", // Asegura que el logo no se salga de los bordes redondeados
  },
  logoBackground: {
    resizeMode: "contain", // Ajusta la imagen para cubrir todo el fondo
    position: "absolute",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333", // Color oscuro para el título
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555", // Color gris oscuro para las etiquetas
  },
  value: {
    fontSize: 16,
    color: "#000", // Color negro para los valores
  },
});
