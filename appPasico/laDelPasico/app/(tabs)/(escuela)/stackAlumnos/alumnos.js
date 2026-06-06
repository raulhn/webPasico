import {
  useAsignaturasProfesor,
  useAsignaturas,
} from "../../../../hooks/escuela/useAsignaturas";
import { useContext, useState } from "react";
import { AuthContext } from "../../../../providers/AuthContext";
import { useAlumnosAsignaturaProfesor } from "../../../../hooks/escuela/useAlumnos";
import { usePersonas } from "../../../../hooks/personas/usePersonas";
import ListaAlumnos from "../../../../componentes/componentesEscuela/ListaAlumnos";
import {
  ROL_ADMINISTRADOR,
  ROL_DIRECTIVO,
  ESCUELA,
} from "../../../../config/constantes";

import { useRol } from "../../../../hooks/useRol";

export default function Alumnos() {
  const [nidCurso, setNidCurso] = useState(null);
  const [nidAsignatura, setNidAsignatura] = useState(null);
  const { cerrarSesion } = useContext(AuthContext);
  const {
    asignaturas: asignaturasProfesor,
    cargando,
    error,
    lanzarRefresco,
  } = useAsignaturasProfesor(cerrarSesion);

  const {
    setNidAsignatura: setNidAsignaturaProfesor,
    setNidCurso: setNidCursoProfesor,
    alumnos: alumnosProfesor,
    cargando: cargandoAlumnos,
    error: errorAlumnos,
    lanzarRefresco: lanzarRefrescoAlumnos,
  } = useAlumnosAsignaturaProfesor(null, null, cerrarSesion);

  const {
    asignaturas,
    cargando: cargandoAsignaturas,
    error: errorAsignaturas,
    lanzarRefresco: lanzarRefrescoAsignaturas,
  } = useAsignaturas(cerrarSesion);

  const {
    personas: alumnos,
    cargando: cargandoAlumnosAdmin,
    error: errorAlumnosAdmin,
    lanzarRefresco: lanzarRefrescoAlumnosAdmin,
  } = usePersonas(ESCUELA, nidCurso, cerrarSesion);

  const { esRol } = useRol();

  const rolAdministrador = esRol([ROL_ADMINISTRADOR, ROL_DIRECTIVO]);

  const alumnosAdministrador = alumnos?.filter(
    (alumno) => alumno.nid_asignatura === nidAsignatura
  );

  const alumnosAdministradorUnicos = [
    ...new Map(
      alumnosAdministrador?.map((alumno) => [alumno.nid_persona, alumno])
    ).values(),
  ];

  if (!rolAdministrador) {
    return (
      <ListaAlumnos
        alumnos={alumnosProfesor}
        cargandoAlumnos={cargandoAlumnos}
        lanzarRefrescoAsignaturas={lanzarRefresco}
        lanzarRefrescoAlumnos={lanzarRefrescoAlumnos}
        cargando={cargando}
        error={error}
        asignaturas={asignaturasProfesor}
        setNidAsignatura={setNidAsignaturaProfesor}
        setNidCurso={setNidCursoProfesor}
        cerrarSesion={cerrarSesion}
      />
    );
  } else {
    return (
      <ListaAlumnos
        alumnos={alumnosAdministradorUnicos}
        cargandoAlumnos={cargandoAlumnosAdmin}
        lanzarRefrescoAsignaturas={lanzarRefresco}
        lanzarRefrescoAlumnos={lanzarRefrescoAlumnosAdmin}
        cargando={cargando}
        error={error}
        asignaturas={asignaturas}
        setNidAsignatura={setNidAsignatura}
        setNidCurso={setNidCurso}
        cerrarSesion={cerrarSesion}
      />
    );
  }
}
