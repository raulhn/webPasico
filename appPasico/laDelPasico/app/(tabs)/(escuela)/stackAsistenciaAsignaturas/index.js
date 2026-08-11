import { useAsistencias } from "../../../../hooks/escuela/useAsistencias";
import { useAsignaturas } from "../../../../hooks/escuela/useAsignaturas";
import { useCursos } from "../../../../hooks/escuela/useCursos";

import { useState, useContext } from "react";
import { View } from "react-native";
import { AuthContext } from "../../../../providers/AuthContext";
import { EntradaGroupRadioButton } from "../../../../componentes/componentesUI/ComponentesUI";

export default function AsistenciaAsignaturas() {
  const [nidAsignatura, setNidAsignatura] = useState(1);
  const [nidCurso, setNidCurso] = useState(1);

  const { cerrarSesion } = useContext(AuthContext);

  const { asistencias, refrescarAsistencias, cargando, error } = useAsistencias(
    nidAsignatura, // nid_asignatura
    nidCurso, // nid_curso
    cerrarSesion // función para cerrar sesión
  );

  const { cursos, cargando: cargandoCursos } = useCursos(cerrarSesion);
  const { asignaturas, cargando: cargandoAsignaturas } =
    useAsignaturas(cerrarSesion);

  const opcionesAsignaturas = asignaturas.map((asignatura) => ({
    etiqueta: asignatura.nombre,
    valor: asignatura.nid_asignatura,
  }));

  const opcionesCursos = cursos.map((curso) => ({
    etiqueta: curso.nombre,
    valor: curso.nid_curso,
  }));

  return (
    <>
      <View>
        {asignaturas.length > 0 && cursos.length > 0 && (
          <>
            <EntradaGroupRadioButton
              titulo="Curso"
              opciones={opcionesCursos}
              valorSeleccionado={nidCurso}
              onValorSeleccionado={setNidCurso}
            />
            <EntradaGroupRadioButton
              titulo="Asignatura"
              opciones={opcionesAsignaturas}
              valorSeleccionado={nidAsignatura}
              onValorSeleccionado={setNidAsignatura}
            />
          </>
        )}
      </View>
    </>
  );
}
