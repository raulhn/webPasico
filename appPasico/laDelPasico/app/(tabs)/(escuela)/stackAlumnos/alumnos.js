import {
  useAsignaturasProfesor,
  useAsignaturas,
} from "../../../../hooks/escuela/useAsignaturas";
import { useContext, useState } from "react";
import { AuthContext } from "../../../../providers/AuthContext";
import { useAlumnosAsignaturaProfesor } from "../../../../hooks/escuela/useAlumnos";
import {
  usePersonas,
  useListadoPersonas,
} from "../../../../hooks/personas/usePersonas";
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
    alumnos: alumnosProfesor,
    cargando: cargandoAlumnos,
    error: errorAlumnos,
    lanzarRefresco: lanzarRefrescoAlumnos,
  } = useAlumnosAsignaturaProfesor(nidCurso, nidAsignatura, cerrarSesion);

  console.log("Renderizando ListaAlumnos para profesor", alumnosProfesor);
  return (
    <ListaAlumnos
      alumnos={alumnosProfesor}
      cargandoAlumnos={cargandoAlumnos}
      lanzarRefrescoAsignaturas={lanzarRefresco}
      lanzarRefrescoAlumnos={lanzarRefrescoAlumnos}
      cargando={cargando}
      error={error}
      asignaturas={asignaturasProfesor}
      setNidAsignatura={(valor) => {
        setNidAsignatura(valor);
      }}
      setNidCurso={(valor) => {
        setNidCurso(valor);
      }}
      cerrarSesion={cerrarSesion}
    />
  );
}
