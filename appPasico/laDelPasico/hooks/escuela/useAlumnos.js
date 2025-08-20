import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../../providers/AuthContext.js";
import serviceMatriculaAsignatura from "../../servicios/serviceMatriculaAsignatura.js";

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

export const useAlumnosAsignaturaProfesor = (nid_curso_, nid_asignatura_, cerrarSesion) => {
    const [alumnos, setAlumnos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [refrescar, setRefrescar] = useState(false);

    const [nidAsignatura, setNidAsignatura] = useState(nid_asignatura_);
    const [nidCurso, setNidCurso] = useState(nid_curso_);

    function lanzarRefresco(nid_curso, nid_asignatura) {
        setNidCurso(nid_curso);
        setNidAsignatura(nid_asignatura);
        setRefrescar(true);
        
    }

    useEffect(() => {
        console.log("NID Curso:", nidCurso);
        console.log("NID Asignatura:", nidAsignatura);
        if(nidAsignatura && nidCurso)      {
            console.log("Obteniendo alumnos de la asignatura del profesor:", nidAsignatura, nidCurso);
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

    return { alumnos, cargando, error, lanzarRefresco };
}