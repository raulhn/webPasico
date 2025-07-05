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

  function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO); // Convierte la fecha ISO a un objeto Date
    const dia = String(fecha.getDate()).padStart(2, "0"); // Obtiene el día (2 dígitos)
    const mes = String(fecha.getMonth() + 1).padStart(2, "0"); // Obtiene el mes (2 dígitos, +1 porque los meses empiezan en 0)
    const anio = fecha.getFullYear(); // Obtiene el año completo
    return `${dia}/${mes}/${anio}`; // Devuelve la fecha en formato dd/mm/yyyy
  }

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
      <View style={styles.card}>
        <View style={styles.logoContainer}>
          <Image source={logo} style={styles.logo} />
        </View>
        <Text style={styles.title}>Carnet de Socio</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Nombre:</Text>
          <Text style={styles.value}>
            {persona.nombre} {persona.primer_apellido}{" "}
            {persona.segundo_apellido}
          </Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Fecha de Alta:</Text>
          <Text style={styles.value}>{formatearFecha(socio.fecha_alta)}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Nº Socio:</Text>
          <Text style={styles.valueNum}>{socio.num_socio}</Text>
        </View>
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Asociación Amigos de la Musica de Torre Pacheco
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#eaf2fb",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: 340,
    height: 210,
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 20,
    shadowColor: "#007CFA",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 7,
    alignItems: "center",
    position: "relative",
  },
  logoContainer: {
    position: "absolute",
    top: 18,
    right: 18,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 4,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  logo: {
    width: 48,
    height: 48,
    resizeMode: "contain",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007CFA",
    marginBottom: 18,
    marginTop: 8,
    alignSelf: "flex-start",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    width: "100%",
    marginBottom: 10,
    gap: 8,
  },
  label: {
    fontSize: 15,
    color: "#007CFA",
    fontWeight: "bold",
    minWidth: 100,
  },
  value: {
    fontSize: 15,
    color: "#222",
    fontWeight: "500",
    flexShrink: 1,
  },
  valueNum: {
    fontSize: 18,
    color: "#007CFA",
    fontWeight: "bold",
    marginLeft: 4,
  },
  footer: {
    bottom: 12,
    left: 0,
    width: "100%",
    alignItems: "center",
    paddingTop: 8,
  },
  footerText: {
    fontSize: 13,
    color: "#888",
    fontStyle: "italic",
    letterSpacing: 1,
    textAlign: "center",
  },
});
