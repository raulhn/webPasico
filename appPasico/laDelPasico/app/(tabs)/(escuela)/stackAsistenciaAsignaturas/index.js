import { useAsistencias } from "../../../../hooks/escuela/useAsistencias";
import {
  useAsignaturas,
  useAsignaturasProfesor,
} from "../../../../hooks/escuela/useAsignaturas";
import { useCursos } from "../../../../hooks/escuela/useCurso";
import { useRol } from "../../../../hooks/useRol";
import {
  obtenerFechaFormateada,
  obtenerFechaFormateadaSoloFecha,
} from "../../../../comun/fechas";

import { useState, useContext } from "react";
import { View, FlatList, Text, StyleSheet, RefreshControl } from "react-native";
import { AuthContext } from "../../../../providers/AuthContext";
import {
  EntradaGroupRadioButton,
  DropDown,
} from "../../../../componentes/componentesUI/ComponentesUI";

import Constantes from "../../../../config/constantes";

export default function AsistenciaAsignaturas() {
  const [nidAsignatura, setNidAsignatura] = useState(1);
  const [nidCurso, setNidCurso] = useState(1);

  const { cerrarSesion } = useContext(AuthContext);

  const { esRol } = useRol(cerrarSesion);

  const { asistencias, refrescarAsistencias, cargando, error } = useAsistencias(
    nidAsignatura.valor, // nid_asignatura
    nidCurso.valor, // nid_curso
    cerrarSesion // función para cerrar sesión
  );

  const { cursos, cargando: cargandoCursos } = useCursos(cerrarSesion);
  const { asignaturas, cargando: cargandoAsignaturas } =
    useAsignaturas(cerrarSesion);
  const { asignaturasProfesor, cargando: cargandoAsignaturasProfesor } =
    useAsignaturasProfesor(cerrarSesion);

  let opcionesAsignaturas = [];

  if (esRol([Constantes.ROL_ADMINISTRADOR, Constantes.ROL_DIRECTIVO])) {
    opcionesAsignaturas = asignaturas.map((asignatura) => ({
      etiqueta: asignatura.descripcion,
      valor: asignatura.nid_asignatura,
    }));
  } else if (esRol([Constantes.ROL_PROFESOR])) {
    opcionesAsignaturas = asignaturasProfesor.map((asignatura) => ({
      etiqueta: asignatura.descripcion,
      valor: asignatura.nid_asignatura,
    }));
  }

  const opcionesCursos = cursos.map((curso) => ({
    etiqueta: curso.descripcion,
    valor: curso.nid_curso,
  }));

  const lista_nid_persona = asistencias.map(
    (asistencia) => asistencia.nid_persona
  );

  const conjunto_personas = new Set(lista_nid_persona);

  const array_personas = conjunto_personas ? Array.from(conjunto_personas) : [];

  function AsistenciaPersona({ nid_persona }) {
    const asistencias_persona = asistencias.filter(
      (asistencia) =>
        asistencia.nid_persona === nid_persona && asistencia.falta === "S"
    );

    const persona = asistencias.find((p) => p.nid_persona === nid_persona);

    return (
      <DropDown
        cabecera={({ colorTexto }) => {
          return (
            <View>
              <Text style={{ color: colorTexto }}>
                {persona.nombre} {persona.primer_apellido}
                {persona.segundo_apellido}
              </Text>
              <Text style={{ color: colorTexto }}>
                {asistencias_persona.length} Faltas
              </Text>
            </View>
          );
        }}
        cuerpo={() => {
          return asistencias_persona.map((item) => (
            <View key={item.nid_asistencia_grupo}>
              <Text>
                <Text style={{ fontWeight: "bold" }}>
                  {obtenerFechaFormateadaSoloFecha(item.fecha)}
                </Text>
                {" - "}
                {item.justificada === "S" ? "Justificada - " : "No Justificada"}
                {item.causa}
                {}
              </Text>
            </View>
          ));
        }}
      />
    );
  }

  return (
    <FlatList
      style={estilos.contenedor}
      contentContainerStyle={estilos.contenidoLista}
      data={array_personas}
      refreshControl={
        <RefreshControl
          refreshing={cargando}
          onRefresh={() => {
            refrescarAsistencias();
          }}
        />
      }
      ListHeaderComponent={
        <>
          <View style={estilos.filtros}>
            {asignaturas.length > 0 && cursos.length > 0 && (
              <>
                <View style={estilos.filtroCampo}>
                  <Text>Curso</Text>
                  <EntradaGroupRadioButton
                    titulo="Curso"
                    opciones={opcionesCursos}
                    valorSeleccionado={nidCurso}
                    setValorSeleccionado={setNidCurso}
                  />
                </View>
                <View style={estilos.filtroCampo}>
                  <Text>Asignatura</Text>
                  <EntradaGroupRadioButton
                    titulo="Asignatura"
                    opciones={opcionesAsignaturas}
                    valorSeleccionado={nidAsignatura}
                    setValorSeleccionado={setNidAsignatura}
                  />
                </View>
              </>
            )}
          </View>
          {array_personas.length === 0 && (
            <View style={estilos.mensajeVacio}>
              <Text>
                No hay faltas registradas para esta asignatura y curso.
              </Text>
            </View>
          )}
        </>
      }
      renderItem={({ item }) => <AsistenciaPersona nid_persona={item} />}
      keyExtractor={(item) => item.toString()}
      ItemSeparatorComponent={() => <View style={estilos.separador} />}
      showsVerticalScrollIndicator={false}
    />
  );
}

const estilos = StyleSheet.create({
  filtros: {
    justifyContent: "space-around",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingBottom: 10,
  },
  filtroCampo: {
    justifyContent: "space-between",
    flexDirection: "vertical",
    alignItems: "center",
    gap: 10,
  },
  contenedor: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  contenidoLista: {
    flexGrow: 1,
    padding: 10,
    paddingBottom: 24,
  },
  cabecera: {
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  cuerpo: {
    padding: 10,
    backgroundColor: "#ffffff",
  },
  mensajeVacio: {
    paddingVertical: 10,
  },
  separador: {
    height: 10,
  },
});
