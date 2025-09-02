import { useParams } from "react-router";
import { useEvaluacionesAsignatura } from "../../../hooks/useEvaluaciones";
import { useAlumnosAsignaturaProfesor } from "../../../hooks/useAlumnos";
import CardEvaluacion from "../CardEvaluacion/CardEvaluacion";
import { useState, useEffect } from "react";
import { EntradaTexto, EntradaTextoArea, Boton } from "../../ComponentesUI/ComponentesUI";

import "./Evaluacion.css"

export default function Evaluacion()
{
    const {nidCurso, nidAsignatura,nidTrimestre} = useParams();

    console.log(nidCurso, nidAsignatura,nidTrimestre);

    const {evaluaciones: evaluacionesRecuperadas, registrarEvaluaciones} =  useEvaluacionesAsignatura(nidCurso, nidAsignatura, nidTrimestre);
    const {alumnos} = useAlumnosAsignaturaProfesor(nidCurso, nidAsignatura);


    console.log("Evaluaciones recuperadas", evaluacionesRecuperadas)


    async function lanzaRegistroEvaluaciones(evaluaciones_, nidCurso_, nidAsignatura_, nidTrimestre_)
    {
        try
        {
          console.log("Lanza registro")
          await registrarEvaluaciones(evaluaciones_, nidCurso_, nidAsignatura_, nidTrimestre_);
          console.log("Evaluaciones registradas con éxito");
        }
        catch(error)
        {
          console.error("Error al registrar evaluaciones:", error);
        }
    }

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

  let evaluacionesEdicion = [...evaluaciones];

  useEffect(() => {
    const evaluacionesProcesadas = alumnos.map(alumno => (recuperarEvaluacion(alumno)));
    
   setEvaluaciones(evaluacionesProcesadas);
  }, [alumnos, evaluacionesRecuperadas]);

  console.log("Evaluaciones procesadas", evaluaciones);

    return ( <div>
        {evaluaciones.map((evaluacion, idx) => (
   <div className="card-edicion-evaluacion">
  <div className="campo-evaluacion">
    <label htmlFor={`nota-${idx}`}>Nota</label>
    <EntradaTexto
      id={`nota-${idx}`}
      valorDefecto={evaluacionesEdicion[idx].nota}
      setTexto={texto => {
        evaluacionesEdicion[idx].nota = texto;
        setEvaluaciones([...evaluacionesEdicion]);
      }}
    />
  </div>
  <div className="campo-evaluacion">
    <label htmlFor={`comentario-${idx}`}>Comentario</label>
    <EntradaTextoArea
      id={`comentario-${idx}`}
      valorDefecto={evaluacionesEdicion[idx].comentario}
      setTexto={texto => {
        evaluacionesEdicion[idx].comentario = texto;
        setEvaluaciones([...evaluacionesEdicion]);
      }}
      width="600px"
    />
  </div>
  <div className="campo-evaluacion">
    <label htmlFor={`progreso-${idx}`}>Progreso</label>
    <select
      id={`progreso-${idx}`}
      value={evaluacionesEdicion[idx].progreso.valor}
      onChange={e => {
        evaluacionesEdicion[idx].progreso.valor = e.target.value;
        evaluacionesEdicion[idx].progreso.etiqueta = e.target.options[e.target.selectedIndex].text;
        setEvaluaciones([...evaluacionesEdicion]);
      }}
    >
      <option value="0">Sin evaluar</option>
      <option value="1">Necesita Mejorar</option>
      <option value="2">Progresa Adecuadamente</option>
    </select>
  </div>
</div>
        ))}

        <Boton texto="Guardar Evaluaciones" onClick={() => {
          console.log("Evaluaciones guardadas:", evaluaciones);
          lanzaRegistroEvaluaciones(evaluaciones, nidCurso, nidAsignatura, nidTrimestre);
        }} />
    </div>
    
    );
}