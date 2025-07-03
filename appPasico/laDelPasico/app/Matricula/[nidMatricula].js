import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useMatriculasAsignaturaPersona } from "../../hooks/personas/useMatriculasAsignaturaPersona.js"; // Asegúrate de que la ruta sea correcta
import { AuthContext } from "../../providers/AuthContext";
import { useContext } from "react";

export default function Matricula() {
  const { nidMatricula } = useLocalSearchParams();
  const { cerrar_sesion } = useContext(AuthContext);
  const {
    matriculasAsignatura,
    cargando,
    refrescarMatriculas,
    error,
    refrescar,
  } = useMatriculasAsignaturaPersona(nidMatricula, cerrar_sesion);

  console.log("Matricula cargada con nidMatricula:", matriculasAsignatura);

  if (cargando) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={estilos.container}>
      <FlatList
        data={matriculasAsignatura}
        keyExtractor={(item) => item.nid_matricula.toString()}
        style={{ width: "100%", flex: 1 }}
        renderItem={({ item }) => (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginVertical: 10,
            }}
          >
            <Text style={estilos.title}>{item.asignatura}</Text>
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={cargando}
            onRefresh={refrescarMatriculas}
          />
        }
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    flex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
});
