import { useCursos } from "../../hooks/escuela/useCurso";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  FlatList,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
} from "react-native";
import { EntradaGroupRadioButton } from "../../componentes/componentesUI/ComponentesUI";

export default function ListaAlumnos({
  alumnos,
  cargandoAlumnos,
  lanzarRefresco,
  cargando,
  error,
  asignaturas,
  setNidAsignatura,
  setNidCurso,
  cerrarSesion,
}) {
  const [presionado, setPresionado] = useState(null);
  const {
    cursos,
    cargando: cargandoCursos,
    error: errorCursos,
  } = useCursos(cerrarSesion);
  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState(null);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);

  const router = useRouter();

  if (cargando || cargandoCursos) {
    return (
      <View>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return <Text>Error: {error.message}</Text>;
  }

  const opcionesAsignaturas = asignaturas.map((asignatura) => ({
    etiqueta: asignatura.descripcion,
    valor: asignatura.nid_asignatura,
  }));

  const opcionesCursos = cursos.map((curso) => ({
    etiqueta: curso.descripcion,
    valor: curso.nid_curso,
  }));

  return (
    <>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          padding: 10,
          backgroundColor: "#ffffff",
        }}
      >
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text>Curso</Text>
          <EntradaGroupRadioButton
            opciones={opcionesCursos}
            titulo={"Cursos"}
            valor={cursoSeleccionado}
            setValorSeleccionado={(valor) => {
              setCursoSeleccionado(valor);
              setNidCurso(valor.valor);
              lanzarRefresco();
            }}
          />
        </View>
        <View
          style={
            cursoSeleccionado && cursoSeleccionado.valor
              ? { justifyContent: "center", alignItems: "center" }
              : { display: "none" }
          }
        >
          <Text>Asignatura</Text>
          <EntradaGroupRadioButton
            valor={asignaturaSeleccionada}
            opciones={opcionesAsignaturas}
            titulo={"Asignaturas"}
            setValorSeleccionado={(valor) => {
              setAsignaturaSeleccionada(valor);
              setNidAsignatura(valor.valor);
            }}
          />
        </View>
      </View>
      <View style={estilos.contenedor}>
        <View>
          <FlatList
            data={alumnos}
            onScrollEndDrag={() => {
              setPresionado(null); // Cambia el estado a no presionado al hacer scroll
            }}
            refreshControl={
              <RefreshControl
                refreshing={cargandoAlumnos}
                onRefresh={() => {
                  lanzarRefrescoAlumnos();
                  setPresionado(null);
                }}
              />
            }
            renderItem={({ item }) => {
              return (
                <View key={item.nid_persona}>
                  <Pressable
                    onPress={() => {
                      router.push({
                        pathname: "stackAlumnos/" + item.nid_persona,
                        params: {
                          nidAlumno: item.nid_persona,
                          nidCurso: cursoSeleccionado.valor,
                        },
                      });
                    }}
                    onTouchStart={() => {
                      setPresionado(item.nid_persona); // Cambia el estado a presionado
                    }}
                    onTouchEnd={() => {
                      setPresionado(null); // Cambia el estado a no presionado
                    }}
                    style={[{ width: "100%", alignItems: "center" }]}
                  >
                    <View
                      style={[
                        presionado === item.nid_persona
                          ? estilos.tarjetaPresionada
                          : null,
                      ]}
                    >
                      <CardAlumno alumno={item} />
                    </View>
                  </Pressable>
                </View>
              );
            }}
            keyExtractor={(item) => item.nid_persona}
            contentContainerStyle={{ gap: 10, flexGrow: 1 }}
          />
        </View>
      </View>
    </>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    backgroundColor: "#ffffff",
    flex: 1,
    width: "100%",
  },
  tarjetaPresionada: {
    transform: [{ scale: 1.05 }],
  },
});
