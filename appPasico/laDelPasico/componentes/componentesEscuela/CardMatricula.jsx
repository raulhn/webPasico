import { View, StyleSheet, Text } from "react-native";
export default function CardMatricula({ Matricula }) {
  return (
    <View style={estilos.card}>
      <View style={{ flexDirection: "row" }}>
        <Text style={{ fontWeight: "bold" }}>Nombre:</Text>
        <Text numberOfLines={1} ellipsizeMode="tail">
          {Matricula.nombre} {Matricula.primer_apellido}{" "}
          {Matricula.segundo_apellido}
        </Text>
      </View>
      <View style={{ flexDirection: "row" }}>
        <Text style={{ fontWeight: "bold" }}>Curso:</Text>
        <Text numberOfLines={1} ellipsizeMode="tail">
          {Matricula.curso}
        </Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 10,
  },
});
