import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useMatriculasAsignaturaPersona } from "../../hooks/personas/useMatriculasAsignaturaPersona.js";
import { AuthContext } from "../../providers/AuthContext";
import { useContext } from "react";
import CardAsignatura from "../../componentes/componentesEscuela/CardAsignatura.jsx";
import {
  Boton,
  MenuDesplegable,
} from "../../componentes/componentesUI/ComponentesUI.jsx";
import Constantes from "../../config/constantes.js";

export default function Matricula() {
  const { nidMatricula } = useLocalSearchParams();
  const { cerrarSesion } = useContext(AuthContext);
  const {
    matriculasAsignatura,
    cargando,
    refrescarMatriculas,
    matricula,
    error,
    refrescar,
  } = useMatriculasAsignaturaPersona(nidMatricula, cerrarSesion);

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
    //  {
    //    etiqueta: "Expediente",
    //    icono: "folder",
    //    ruta: "/Expediente/" + nidMatricula,
    //    parametros: { nidMatricula: nidMatricula },
    //  },
  ];

  return (
    <View style={estilos.container}>
      <View style={{ position: "absolute", top: 10, right: 15, zIndex: 1 }}>
        <MenuDesplegable opciones={opcionesDesplegable} />
      </View>

      <Text style={estilos.title}>{matricula.curso}</Text>

      <FlatList
        data={matriculasAsignatura}
        keyExtractor={(item) => item.nid_matricula_asignatura.toString()}
        style={{ width: "100%", flex: 1 }}
        renderItem={({ item }) => (
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
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
    paddingTop: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    margin: 8,
    color: Constantes.COLOR_AZUL,
  },
});
