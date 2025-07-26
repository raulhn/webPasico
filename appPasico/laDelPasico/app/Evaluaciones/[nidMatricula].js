import { View, Text, Pressable } from "react-native";
import { useEvaluaciones } from "../../hooks/escuela/useEvaluaciones";
import { useLocalSearchParams } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "../../providers/AuthContext";

export default function Evaluacion() {
  const { nidMatricula } = useLocalSearchParams();
  const { cerrar_sesion } = useContext(AuthContext);

  console.log("NID Matricula:", nidMatricula);
  const { evaluaciones, cargando, error, refrescar, setRefrescar } =
    useEvaluaciones(nidMatricula, cerrar_sesion);

  //console.log("Evaluaciones:", evaluaciones);

  return (
    <View>
      <Text>Evaluación</Text>
    </View>
  );
}
