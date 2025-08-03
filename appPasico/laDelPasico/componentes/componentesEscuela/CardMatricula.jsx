import { View, StyleSheet, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Constantes from "../../config/constantes.js";
export default function CardMatricula({ Matricula }) {
  return (
    <View style={[estilos.card, { flex: 1 }]}>
      <View style={estilos.row}>
        <MaterialIcons
          name="person"
          size={22}
          color={Constantes.COLOR_AZUL}
          style={{ marginRight: 8 }}
        />

        <Text style={estilos.label}>Alumno: </Text>
        <Text style={estilos.value} numberOfLines={1} ellipsizeMode="tail">
          {Matricula.nombre} {Matricula.primer_apellido}{" "}
          {Matricula.segundo_apellido}
        </Text>
      </View>
      <View style={estilos.row}>
        <MaterialIcons
          name="school"
          size={22}
          color={Constantes.COLOR_AZUL}
          style={{ marginRight: 8 }}
        />

        <Text style={estilos.label}>Curso: </Text>
        <Text style={estilos.value} numberOfLines={1} ellipsizeMode="tail">
          {Matricula.curso}
        </Text>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  card: {
    backgroundColor: "#f8faff",
    padding: 16,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e3eaf2",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    color: Constantes.COLOR_AZUL,
    fontWeight: "bold",
    marginBottom: 2,
  },
  value: {
    fontSize: 16,
    color: "#222",
    fontWeight: "500",
    maxWidth: 220,
  },
});
