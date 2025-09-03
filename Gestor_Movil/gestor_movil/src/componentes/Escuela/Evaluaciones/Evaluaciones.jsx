import { useCursos } from "../../../hooks/useCursos";
import { useAsignaturasProfesor } from "../../../hooks/useAsignaturas";
import { useTrimestres } from "../../../hooks/useTrimestres";
import { useState } from "react";
import "./Evaluaciones.css";
import { Boton, Selector } from "../../ComponentesUI/ComponentesUI";

import { useNavigate } from "react-router";
import Cabecera from "../../Cabecera/Cabecera";

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
    navigate(`/gestion/evaluacion/${nidCurso}/${nidAsignatura}/${nidTrimestre}`);
  }

  return (
    <>
      <Cabecera />
      <div className="contenedor" style={{ paddingTop: "60px" }}>
        <h2>Evaluaciones</h2>

      <label>Curso</label>
      <Selector valor={nidCurso} setValor={setNidCurso} width="200px"
                opciones={cursos.map(curso => ({ valor: curso.nid_curso, etiqueta: curso.descripcion }))} />
      <label>Asignatura</label>
      <Selector valor={nidAsignatura} setValor={setNidAsignatura} width="200px"
                opciones={asignaturas.map(asignatura => ({ valor: asignatura.nid_asignatura, etiqueta: asignatura.descripcion }))} />
      <label>Trimestre</label>
      <Selector valor={nidTrimestre} setValor={setNidTrimestre} width="200px"
                opciones={trimestres.map(trimestre => ({ valor: trimestre.nid_trimestre, etiqueta: trimestre.descripcion }))} />

      <Boton onClick={lanzaEvaluacion} texto={"Ver Evaluaciones"} />

    </div>
    </>
  );
}
