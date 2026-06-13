import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../providers/AuthContext.js";
import serviceMatriculaAsignatura from "../../servicios/serviceMatriculaAsignatura.js";
import servicePersonas from "../../servicios/servicePersonas.js";
import { esRol } from "../useRol.js";
import { ROL_ADMINISTRADOR, ROL_DIRECTIVO } from "../../config/constantes.js";

export const useAlumnosAsignaturaProfesor = (
  nidCurso_,
  nidAsignatura_,
  cerrarSesion
) => {
  const [alumnos, setAlumnos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [refrescar, setRefrescar] = useState(false);

  function lanzarRefresco() {
    setRefrescar(true);
  }

  useEffect(() => {
    if (nidAsignatura_ && nidCurso_) {
      console.log(
        `Obteniendo alumnos para curso ${nidCurso_} y asignatura ${nidAsignatura_}`
      );
      serviceMatriculaAsignatura
        .obtenerAlumnosAsignaturaProfesor(
          nidCurso_,
          nidAsignatura_,
          cerrarSesion
        )
        .then((data) => {
          setAlumnos(data);
          setCargando(false);
          setRefrescar(false);
        })
        .catch((error) => {
          console.error(
            "Error al obtener los alumnos de la asignatura del profesor:",
            error
          );
          setError(error);
          setCargando(false);
          setRefrescar(false);
        });
    } else {
      setAlumnos([]);
      setRefrescar(false);
    }
  }, [refrescar, nidCurso_, nidAsignatura_]);

  return {
    alumnos,
    cargando,
    error,
    lanzarRefresco,
  };
};

export const useAlumnoProfesor = (nidAlumno, nidCurso, cerrarSesion) => {
  const [alumno, setAlumno] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [refrescar, setRefrescar] = useState(false);

  function lanzarRefresco() {
    setRefrescar(true);
  }

  useEffect(() => {
    if (nidAlumno) {
      servicePersonas
        .obtenerAlumnoProfesor(nidAlumno, nidCurso, cerrarSesion)
        .then((data) => {
          setAlumno(data);
          setCargando(false);
          setRefrescar(false);
        })
        .catch((error) => {
          console.error("Error al obtener el alumno del profesor:", error);
          setError(error);
          setCargando(false);
          setRefrescar(false);
        });
    }
  }, [nidAlumno, nidCurso, refrescar]);

  return { alumno, cargando, error, refrescar, lanzarRefresco };
};

export const useAlumnos = (nidCurso, cerrarSesion) => {
  const [alumnos, setAlumnos] = useState([]);
  const [alumnosFiltrados, setAlumnosFiltrados] = useState([]);
  const [nidAsignatura, setNidAsignatura] = useState(null);

  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [refrescar, setRefrescar] = useState(false);

  function lanzarRefresco() {
    setRefrescar(true);
  }

  useEffect(() => {
    let rolPermitido = esRol([ROL_ADMINISTRADOR, ROL_DIRECTIVO]);

    if (rolPermitido && nidCurso) {
      servicePersonas
        .obtenerPersonasAlumnos(nidCurso, cerrarSesion)
        .then((personas) => {
          setAlumnos(personas);

          setRefrescar(false);
          setCargando(false);
        })
        .catch((error) => {
          console.log("Error al obtener los alumnos:", error);
          setError("Error al recuperar los alumnos");
          setRefrescar(false);
          setCargando(false);
        });
    }
  }, [refrescar, nidCurso]);

  useEffect(() => {
    if (nidAsignatura) {
      const alumnosAsignatura = alumnos.filter(
        (alumno) => alumno.nid_asignatura === nidAsignatura
      );
      setAlumnosFiltrados(alumnosAsignatura);
    } else {
      setAlumnosFiltrados(alumnos);
    }
  }, [alumnos, nidAsignatura]);

  return {
    alumnos: alumnosFiltrados,
    setNidAsignatura,
    cargando,
    error,
    lanzarRefresco,
  };
};
