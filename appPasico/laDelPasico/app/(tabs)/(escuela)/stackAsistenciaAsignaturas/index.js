import { useAsistencias } from "../../../../hooks/escuela/useAsistencias";
import { useAsignaturas } from "../../../../hooks/escuela/useAsignaturas";
import { useCursos } from "../../../../hooks/escuela/useCurso";
import {
  obtenerFechaFormateada,
  obtenerFechaFormateadaSoloFecha,
} from "../../../../comun/fechas";

import { useState, useContext } from "react";
import { View, FlatList, Text, StyleSheet } from "react-native";
import { AuthContext } from "../../../../providers/AuthContext";
import {
  EntradaGroupRadioButton,
  DropDown,
} from "../../../../componentes/componentesUI/ComponentesUI";

export default function AsistenciaAsignaturas() {
  const [nidAsignatura, setNidAsignatura] = useState(1);
  const [nidCurso, setNidCurso] = useState(1);

  const { cerrarSesion } = useContext(AuthContext);

  const { asistencias, refrescarAsistencias, cargando, error } = useAsistencias(
    nidAsignatura.valor, // nid_asignatura
    nidCurso.valor, // nid_curso
    cerrarSesion // función para cerrar sesión
  );

  const { cursos, cargando: cargandoCursos } = useCursos(cerrarSesion);
  const { asignaturas, cargando: cargandoAsignaturas } =
    useAsignaturas(cerrarSesion);

  const opcionesAsignaturas = asignaturas.map((asignatura) => ({
    etiqueta: asignatura.descripcion,
    valor: asignatura.nid_asignatura,
  }));

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
        cabecera={() => {
          return (
            <View style={{ padding: 10, backgroundColor: "#f0f0f0" }}>
              <Text>
                {persona.nombre} {persona.primer_apellido}
                {persona.segundo_apellido}
              </Text>
              <Text>{asistencias_persona.length} Faltas</Text>
            </View>
          );
        }}
        cuerpo={() => {
          return asistencias_persona.map((item) => (
            <View key={item.nid_asistencia_grupo}>
              <Text>{obtenerFechaFormateadaSoloFecha(item.fecha)}</Text>
            </View>
          ));
        }}
      />
    );
  }

  return (
    <View style={estilos.contenedor}>
      <View style={estilos.filtros}>
        {asignaturas.length > 0 && cursos.length > 0 && (
          <>
            <Text>Curso</Text>
            <EntradaGroupRadioButton
              titulo="Curso"
              opciones={opcionesCursos}
              valorSeleccionado={nidCurso}
              setValorSeleccionado={setNidCurso}
            />
            <Text>Asignatura</Text>
            <EntradaGroupRadioButton
              titulo="Asignatura"
              opciones={opcionesAsignaturas}
              valorSeleccionado={nidAsignatura}
              setValorSeleccionado={setNidAsignatura}
            />
          </>
        )}
      </View>
      {array_personas.length === 0 && (
        <View style={{ padding: 10 }}>
          <Text>No hay faltas registradas para esta asignatura y curso.</Text>
        </View>
      )}
      <FlatList
        data={array_personas}
        renderItem={({ item }) => (
          <>
            <AsistenciaPersona nid_persona={item} />
          </>
        )}
        keyExtractor={(item) => item}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          flexDirection: "column",
          gap: 10,
        }}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  filtros: {
    justifyContent: "space-between",
    flexDirection: "vertical",
    alignItems: "center",
    gap: 10,
  },
  contenedor: {
    flex: 1,
    padding: 10,
    backgroundColor: "#ffffff",
  },
  cabecera: {
    padding: 10,
    backgroundColor: "#f0f0f0",
  },
  cuerpo: {
    padding: 10,
    backgroundColor: "#ffffff",
  },
});
