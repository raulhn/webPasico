import { useCursos } from "../../../hooks/useCursos";
import { useAsignaturas } from "../../../hooks/useAsignaturas";
import { useTrimestres } from "../../../hooks/useTrimestres";
import { useProfesoresAsignatura } from "../../../hooks/useProfesoresAsignatura";

import { useState } from "react";
import "./SelectorEvaluacionesProfesor.css";
import { Boton, ModalAviso, Selector } from "../../ComponentesUI/ComponentesUI";

import { useNavigate } from "react-router";
import Cabecera from "../../Cabecera/Cabecera";

export default function SelectorEvaluacionesProfesor() {
  const { cursos } = useCursos();
  const { asignaturas } = useAsignaturas();
  const { trimestres } = useTrimestres();

  const [nidAsignatura, setNidAsignatura] = useState(null);
  const [nidCurso, setNidCurso] = useState(null);
  const [nidTrimestre, setNidTrimestre] = useState(null);
  const [visibleError, setVisibleError] = useState(false);
  const [nidProfesor, setNidProfesor] = useState(null);

  const { profesores } = useProfesoresAsignatura(nidAsignatura);

  const navigate = useNavigate();

  function lanzaEvaluacion() {
    if (nidCurso && nidAsignatura && nidTrimestre) {
      navigate(
        `/gestion/evaluacion/${nidCurso}/${nidAsignatura}/${nidTrimestre}`,
      );
    } else {
      setVisibleError(true);
    }
  }

  // Cursos //
  let opcionesCursos = cursos.map((curso) => ({
    valor: curso.nid_curso,
    etiqueta: curso.descripcion,
  }));
  opcionesCursos.push({ valor: "", etiqueta: "Seleccione curso" });

  // Asignaturas //
  let opcionesAsignaturas = asignaturas.map((asignatura) => ({
    valor: asignatura.nid_asignatura,
    etiqueta: asignatura.descripcion,
  }));
  opcionesAsignaturas.push({ valor: "", etiqueta: "Seleccione asignatura" });

  // Trimestre //
  let opcionesTrimestres = trimestres.map((trimestre) => ({
    valor: trimestre.nid_trimestre,
    etiqueta: trimestre.descripcion,
  }));
  opcionesTrimestres.push({ valor: "", etiqueta: "Seleccione trimestre" });

  // Profesores //
  let opcionesProfesores = profesores.map((profesor) => ({
    valor: profesor.nid_persona,
    etiqueta:
      profesor.nombre + profesor.primer_apellido + profesor.segundo_apellido,
  }));
  opcionesProfesores.push({ valor: "", etiqueta: "Seleccione profesor" });

  return (
    <>
      <Cabecera />
      <div className="contenedor" style={{ paddingTop: "60px" }}>
        <h2>Evaluaciones</h2>

        <label>Curso</label>
        <Selector
          valor={nidCurso}
          setValor={setNidCurso}
          width="200px"
          opciones={opcionesCursos}
        />
        <label>Asignatura</label>
        <Selector
          valor={nidAsignatura}
          setValor={setNidAsignatura}
          width="200px"
          opciones={opcionesAsignaturas}
        />
        <label>Profesores</label>
        <Selector
          valor={nidProfesor}
          setValor={setNidProfesor}
          width="200px"
          opciones={opcionesProfesores}
        />
        <label>Trimestre</label>
        <Selector
          valor={nidTrimestre}
          setValor={setNidTrimestre}
          width="200px"
          opciones={opcionesTrimestres}
        />

        <Boton onClick={lanzaEvaluacion} texto={"Ver Evaluaciones"} />

        <ModalAviso
          visible={visibleError}
          setVisible={setVisibleError}
          mensaje={"Debe seleccionar curso, asignatura y trimestre"}
          textBoton={"Aceptar"}
          titulo={"Error"}
        />
      </div>
    </>
  );
}
