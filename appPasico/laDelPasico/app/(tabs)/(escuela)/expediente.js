import { View, Text } from "react-native";
import CardMatricula from "../../../componentes/componentesEscuela/CardMatricula";

export default function Expediente() {
  const matricula = {
    nombre: "Juan",
    primer_apellido: "Pérez",
    segundo_apellido: "Gómez",
    curso: "2025",
  };

  return (
    <View style={estilos.container}>
      <Text style={{ fontWeight: "bold" }}>Expediente</Text>
      <Text>Esta es la sección del expediente.</Text>
      <CardMatricula Matricula={matricula} />
    </View>
  );
}

const estilos = {
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
};
