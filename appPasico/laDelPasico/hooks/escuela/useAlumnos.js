import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../providers/AuthContext.js";
import serviceMatriculaAsignatura from "../../servicios/serviceMatriculaAsignatura.js";
import servicePersonas from "../../servicios/servicePersonas.js";

export const useAlumnos = () =>
{
    const { alumnos } = useContext(AuthContext);

    const esAlumno = (alumnosPermitidos) => {
        if (!alumnos || alumnos.length === 0) {
            return false; // Si no hay alumnos, no se muestra la opción
        }

        for (let a = 0; a < alumnos.length; a++) {
            for (let i = 0; i < alumnosPermitidos.length; i++) {
                if (alumnos[a].id === alumnosPermitidos[i]) {
                    return true;
                }
            }
        }
        return false;
    };

    return { esAlumno };
}

export const useAlumnosAsignaturaProfesor = (nidCurso_, nidAsignatura_, cerrarSesion) => {
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
        serviceMatriculaAsignatura.obtenerAlumnosAsignaturaProfesor(nidCurso, nidAsignatura, cerrarSesion)
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
            servicePersonas.obtenerAlumnoProfesor(nidAlumno, nidCurso, cerrarSesion)
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

    return { alumno, cargando, error, refrescar, lanzarRefresco};
}
