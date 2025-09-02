import { useParams } from "react-router";
import { useEvaluacionesAsignatura } from "../../../hooks/useEvaluaciones";
import { useAlumnosAsignaturaProfesor } from "../../../hooks/useAlumnos";
import CardEvaluacion from "../CardEvaluacion/CardEvaluacion";
import { useState, useEffect } from "react";

export default function Evaluacion()
{
    const {nidCurso, nidAsignatura,nidTrimestre} = useParams();

    console.log(nidCurso, nidAsignatura,nidTrimestre);

    const {evaluaciones: evaluacionesRecuperadas} =  useEvaluacionesAsignatura(nidCurso, nidAsignatura, nidTrimestre);
    const {alumnos} = useAlumnosAsignaturaProfesor(nidCurso, nidAsignatura);


    console.log("Evaluaciones recuperadas", evaluacionesRecuperadas)

      function recuperarEvaluacion(alumno)
{
  const progresos = ["Sin evaluar", "Necesita Mejorar", "Progresa Adecuadamente"]
  let evaluacionRecuperada = null;
  for (const evaluacionActual of evaluacionesRecuperadas) {
    
    if (evaluacionActual.nid_alumno === alumno.nid_persona) {
      evaluacionRecuperada = evaluacionActual;

      const evaluacionProcesada = {
      id: evaluacionRecuperada.nid_alumno,
      nid_evaluacion: evaluacionRecuperada.nid_evaluacion,
      nid_matricula_asignatura: evaluacionRecuperada.nid_matricula_asignatura,
      nota: evaluacionRecuperada.nota ? evaluacionRecuperada.nota.toString() : '',
      progreso: { valor: evaluacionRecuperada.nid_tipo_progreso, etiqueta: progresos[evaluacionRecuperada.nid_tipo_progreso] },
      comentario: evaluacionRecuperada.comentario,
      nombre: evaluacionRecuperada.alumno,
      nid_matricula: alumno.nid_matricula
      };
  
      return evaluacionProcesada
    }
  }

  return { id: alumno.nid_persona,
           nid_evaluacion: null,
           nid_matricula_asignatura: alumno.nid_matricula_asignatura,
           nota: '',
           progreso: { valor: "0", etiqueta: progresos[0] },
           comentario: '',
           nombre: alumno.nombre + " " + alumno.primer_apellido + " " + alumno.segundo_apellido,
          nid_matricula: alumno.nid_matricula
      };
}

  const [evaluaciones, setEvaluaciones] = useState(
    alumnos.map(alumno => (recuperarEvaluacion(alumno)))
  );

  useEffect(() => {
    const evaluacionesProcesadas = alumnos.map(alumno => (recuperarEvaluacion(alumno)));
    
   setEvaluaciones(evaluacionesProcesadas);
  }, [alumnos, evaluacionesRecuperadas]);

  console.log("Evaluaciones procesadas", evaluaciones);

    return ( <div>
        {evaluaciones.map((evaluacion) => (
            <CardEvaluacion key={evaluacion.nid_matricula_asignatura} evaluacion={evaluacion} />
        ))}
    </div>
    
    );
}