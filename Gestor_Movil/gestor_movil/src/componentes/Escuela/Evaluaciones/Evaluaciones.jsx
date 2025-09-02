import { useCursos } from "../../../hooks/useCursos";
import { useAsignaturasProfesor } from "../../../hooks/useAsignaturas";
import { useTrimestres } from "../../../hooks/useTrimestres";
import { useState } from "react";
import "./Evaluaciones.css";
import { Boton } from "../../ComponentesUI/ComponentesUI";

import { useNavigate } from "react-router";

export default function Evaluaciones() {

  const {cursos} = useCursos();
  const {asignaturas} = useAsignaturasProfesor();
  const {trimestres} = useTrimestres();

  const [nidAsignatura, setNidAsignatura] = useState(null);
  const [nidCurso, setNidCurso] = useState(null);
  const [nidTrimestre, setNidTrimestre] = useState(null);

  const navigate = useNavigate();

  function lanzaEvaluacion()
  {
    console.log(nidCurso, nidAsignatura, nidTrimestre);
    navigate(`/gestion/evaluacion/${nidCurso}/${nidAsignatura}/${nidTrimestre}`);
  }

  return (
    <div className="contenedor">
      <h2>Evaluaciones</h2>

      <select value={nidCurso} onChange={(e) => setNidCurso(e.target.value)}>
        <option value="">Seleccione un curso</option>
        {cursos.map((curso) => (
            <option key={curso.nid_curso} value={curso.nid_curso}>{curso.descripcion}</option>
        ))}
      </select>
      <select value={nidAsignatura} onChange={(e) => setNidAsignatura(e.target.value)}>
        <option value="">Seleccione una asignatura</option>
        {asignaturas.map((asignatura) => (
          <option key={asignatura.nid_asignatura} value={asignatura.nid_asignatura}>{asignatura.descripcion}</option>
        ))}
      </select>
      <select value={nidTrimestre} onChange={(e) => setNidTrimestre(e.target.value)}>
        <option value="">Seleccione un trimestre</option>
        {trimestres.map((trimestre) => (
          <option key={trimestre.nid_trimestre} value={trimestre.nid_trimestre}>{trimestre.descripcion}</option>
        ))}
      </select>

      <Boton onClick={lanzaEvaluacion} texto={"Ver Evaluaciones"}>

      </Boton>
    </div>
  );
}
