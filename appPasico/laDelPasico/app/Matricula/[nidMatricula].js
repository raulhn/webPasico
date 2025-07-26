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
import CardAsignatura from "../../componentes/componentesEscuela/CardAsignatura.jsx"; // Asegúrate de que la ruta sea correcta
import {
  Boton,
  MenuDesplegable,
} from "../../componentes/componentesUI/ComponentesUI.jsx"; // Asegúrate de que la ruta sea correcta

export default function Matricula() {
  const { nidMatricula } = useLocalSearchParams();
  const { cerrar_sesion } = useContext(AuthContext);
  const {
    matriculasAsignatura,
    cargando,
    refrescarMatriculas,
    matricula,
    error,
    refrescar,
  } = useMatriculasAsignaturaPersona(nidMatricula, cerrar_sesion);

  if (cargando) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View style={estilos.container}>
        <Text style={estilos.title}>Error al cargar las asignaturas</Text>
        <Boton onPress={refrescarMatriculas} nombre={"Refrescar"} />
      </View>
    );
  }

  const opcionesDesplegable = [
    {
      etiqueta: "Evaluaciones",
      icono: "menu-book",
      ruta: "/Evaluaciones/" + nidMatricula,
      parametros: { nidMatricula: nidMatricula },
    },
    {
      etiqueta: "Expediente",
      icono: "folder",
      ruta: "/Expediente/" + nidMatricula,
      parametros: { nidMatricula: nidMatricula },
    },
  ];

  return (
    <View style={estilos.container}>
      <View style={{ position: "absolute", top: 15, right: 15, zIndex: 1 }}>
        <MenuDesplegable opciones={opcionesDesplegable} />
      </View>
      <Text style={estilos.title}>Matricula</Text>
      <Text>{matricula.curso}</Text>

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
            <CardAsignatura matriculaAsignatura={item} />
          </View>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refrescar}
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
    backgroundColor: "#fff",
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 8,
    color: "#007CFA",
  },
});
