import {
  useAsignaturasProfesor,
  useAsignaturas,
} from "../../../../hooks/escuela/useAsignaturas";
import { useContext, useState } from "react";
import { AuthContext } from "../../../../providers/AuthContext";
import { useAlumnosAsignaturaProfesor } from "../../../../hooks/escuela/useAlumnos";
import ListaAlumnos from "../../../../componentes/componentesEscuela/ListaAlumnos";

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
