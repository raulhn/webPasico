import {useState, useEffect} from "react"
import * as serviceMatriculaAsignatura from "../services/ServiceMatriculaAsignatura.js"

export const useAlumnosAsignaturaProfesor = (nidCurso_, nidAsignatura_) => {
    const [alumnos, setAlumnos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [refrescar, setRefrescar] = useState(false);

    const [nidAsignatura, setNidAsignatura] = useState(nidAsignatura_);
    const [nidCurso, setNidCurso] = useState(nidCurso_);

    function lanzarRefresco() {
        setRefrescar(true);
    }

    useEffect(() => {
 
        if(nidAsignatura && nidCurso)      {
        serviceMatriculaAsignatura.obtenerAlumnosAsignaturaProfesor(nidCurso, nidAsignatura)
            .then((data) => {
                setAlumnos(data);
                setCargando(false);
                setRefrescar(false);
            })
            .catch((error) => {
                console.error("Error al obtener los alumnos de la asignatura del profesor:", error);
                setError(error);
                setCargando(false);
                setRefrescar(false);
            });
        }
        else {
            setAlumnos([]);
            setRefrescar(false)
        }
    }, [refrescar, nidCurso, nidAsignatura]);

    return { alumnos, cargando, error, lanzarRefresco, setNidAsignatura, setNidCurso};
}

export const useAlumnosAsignatura = (nidCurso_, nidAsignatura_, activo_) => {
    const [alumnos, setAlumnos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [refrescar, setRefrescar] = useState(false);

    const [nidAsignatura, setNidAsignatura] = useState(nidAsignatura_);
    const [nidCurso, setNidCurso] = useState(nidCurso_);
    const [activo, setActivo] = useState(activo_);

    function lanzarRefresco() {
        setRefrescar(true);
    }

    useEffect(() => {
      
          if(nidAsignatura && nidCurso)      {
        serviceMatriculaAsignatura.obtenerAlumnosAsignatura(nidCurso, nidAsignatura, activo)
            .then((data) => {
                setAlumnos(data);
                setCargando(false);
                setRefrescar(false);
            })
            .catch((error) => {
                console.error("Error al obtener los alumnos de la asignatura:", error);
                setError(error);
                setCargando(false);
                setRefrescar(false);
            });
          }
          else {
            setAlumnos([]);
            setRefrescar(false)
          }
    }, [refrescar, nidCurso, nidAsignatura, activo]);

    return { alumnos, cargando, error, lanzarRefresco, setNidAsignatura, setNidCurso};
}
