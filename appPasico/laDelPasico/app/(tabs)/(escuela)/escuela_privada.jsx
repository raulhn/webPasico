import { View, Text, StyleSheet } from "react-native";

export default function BandaPrivada() {
  return (
    <>
      <View style={estilos.principal}>
        <Text style={estilos.titulo}>Zona Privada de la Escuela</Text>

        <Text style={estilos.texto}>
          Para acceder a contenido exclusivo de la banda tienes que estar
          logueado y estar dado de alta como alumno de nuestra escuela
        </Text>

        <Text style={estilos.texto}>
          Para la resolución de cualquier duda o problema comuniquese con
          nosotros en nuestra sede
        </Text>
      </View>
    </>
  );
}

const estilos = StyleSheet.create({
  principal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  titulo: {
    fontSize: 30,
    fontWeight: "bold",
    marginVertical: 10,
    alignContent: "center",
    textAlign: "center",
  },
  texto: {
    fontSize: 20,
    marginVertical: 10,
    alignContent: "center",
    textAlign: "center",
  },
});
