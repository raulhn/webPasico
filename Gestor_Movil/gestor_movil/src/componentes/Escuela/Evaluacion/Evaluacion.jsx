import { useParams } from "react-router";
import { useEvaluacionesAsignatura } from "../../../hooks/useEvaluaciones";
import { useAlumnosAsignaturaProfesor } from "../../../hooks/useAlumnos";
import { useState, useEffect } from "react";
import {
  EntradaTexto,
  EntradaTextoArea,
  Boton,
  Selector,
  ModalExito,
  ModalAviso,
} from "../../ComponentesUI/ComponentesUI";
import { useNavigate } from "react-router";

import "./Evaluacion.css";
import Cabecera from "../../Cabecera/Cabecera";

export default function Evaluacion() {
  const { nidCurso, nidAsignatura, nidTrimestre } = useParams();

  const navigate = useNavigate();

  console.log(nidCurso, nidAsignatura, nidTrimestre);

  const { evaluaciones: evaluacionesRecuperadas, registrarEvaluaciones } =
    useEvaluacionesAsignatura(nidCurso, nidAsignatura, nidTrimestre);
  const { alumnos } = useAlumnosAsignaturaProfesor(nidCurso, nidAsignatura);

  const [visibleExito, setVisibleExito] = useState(false);
  const [visibleAviso, setVisibleAviso] = useState(false);

  async function lanzaRegistroEvaluaciones(
    evaluaciones_,
    nidCurso_,
    nidAsignatura_,
    nidTrimestre_,
  ) {
    try {
      console.log("Lanza registro");
      let resultado = await registrarEvaluaciones(
        evaluaciones_,
        nidCurso_,
        nidAsignatura_,
        nidTrimestre_,
      );
      if (!resultado) {
        setVisibleAviso(true);
        return;
      }
      if (resultado.error) {
        setVisibleAviso(true);
        return;
      } else {
        setVisibleExito(true);
        return;
      }
    } catch (error) {
      console.error("Error al registrar evaluaciones:", error);
      setVisibleAviso(true);
    }
  }

  function recuperarEvaluacion(alumno) {
    const progresos = [
      "Sin evaluar",
      "Necesita Mejorar",
      "Progresa Adecuadamente",
    ];
    let evaluacionRecuperada = null;
    for (const evaluacionActual of evaluacionesRecuperadas) {
      if (evaluacionActual.nid_alumno === alumno.nid_persona) {
        evaluacionRecuperada = evaluacionActual;

        const evaluacionProcesada = {
          id: evaluacionRecuperada.nid_alumno,
          nid_evaluacion: evaluacionRecuperada.nid_evaluacion,
          nid_matricula_asignatura:
            evaluacionRecuperada.nid_matricula_asignatura,
          nota: evaluacionRecuperada.nota
            ? evaluacionRecuperada.nota.toString()
            : "",
          progreso: {
            valor: evaluacionRecuperada.nid_tipo_progreso,
            etiqueta: progresos[evaluacionRecuperada.nid_tipo_progreso],
          },
          comentario: evaluacionRecuperada.comentario,
          nombre: evaluacionRecuperada.alumno,
          nid_matricula: alumno.nid_matricula,
        };

        return evaluacionProcesada;
      }
    }

    return {
      id: alumno.nid_persona,
      nid_evaluacion: null,
      nid_matricula_asignatura: alumno.nid_matricula_asignatura,
      nota: "",
      progreso: { valor: "0", etiqueta: progresos[0] },
      comentario: "",
      nombre:
        alumno.nombre +
        " " +
        alumno.primer_apellido +
        " " +
        alumno.segundo_apellido,
      nid_matricula: alumno.nid_matricula,
    };
  }

  const [evaluaciones, setEvaluaciones] = useState(
    alumnos.map((alumno) => recuperarEvaluacion(alumno)),
  );

  let evaluacionesEdicion = [...evaluaciones];

  useEffect(() => {
    const evaluacionesProcesadas = alumnos.map((alumno) =>
      recuperarEvaluacion(alumno),
    );

    setEvaluaciones(evaluacionesProcesadas);
  }, [alumnos, evaluacionesRecuperadas]);

  function mostrarEvaluaciones(nidMatricula) {
    navigate(
      `/gestion/visualizar_evaluaciones/${nidMatricula}/${nidTrimestre}`,
    );
  }
  console.log("Evaluaciones procesadas", evaluaciones);

  return (
    <>
      <Cabecera />
      <div className="contenedor-evaluacion" style={{ paddingTop: "60px" }}>
        {evaluaciones.map((evaluacion, idx) => (
          <div className="card-edicion-evaluacion">
            <div className="campo-evaluacion">
              <label>Nombre</label>
              <strong className="nombre-evaluacion">{evaluacion.nombre}</strong>
            </div>
            <div style={{ display: "flex", flexDirection: "row", gap: "20px" }}>
              <div className="campo-evaluacion">
                <label htmlFor={`nota-${idx}`}>Nota</label>
                <EntradaTexto
                  id={`nota-${idx}`}
                  valorDefecto={evaluacionesEdicion[idx].nota}
                  width="50px"
                  setTexto={(texto) => {
                    evaluacionesEdicion[idx].nota = texto;
                    setEvaluaciones([...evaluacionesEdicion]);
                  }}
                />
              </div>
              <div className="campo-evaluacion">
                <label htmlFor={`progreso-${idx}`}>Progreso</label>
                <Selector
                  valor={evaluacionesEdicion[idx].progreso.valor}
                  width="250px"
                  opciones={[
                    { valor: "0", etiqueta: "Sin evaluar" },
                    { valor: "1", etiqueta: "Necesita Mejorar" },
                    { valor: "2", etiqueta: "Progresa Adecuadamente" },
                  ]}
                  setValor={(valor) => {
                    const opcionesProgreso = [
                      { valor: "0", etiqueta: "Sin evaluar" },
                      { valor: "1", etiqueta: "Necesita Mejorar" },
                      { valor: "2", etiqueta: "Progresa Adecuadamente" },
                    ];
                    evaluacionesEdicion[idx].progreso.valor = valor;
                    evaluacionesEdicion[idx].progreso.etiqueta =
                      opcionesProgreso.find(
                        (opcion) => opcion.valor === valor,
                      ).etiqueta;
                    setEvaluaciones([...evaluacionesEdicion]);
                  }}
                />
              </div>
            </div>
            <div className="campo-evaluacion">
              <label htmlFor={`comentario-${idx}`}>Comentario</label>
              <EntradaTextoArea
                id={`comentario-${idx}`}
                valorDefecto={evaluacionesEdicion[idx].comentario}
                setTexto={(texto) => {
                  evaluacionesEdicion[idx].comentario = texto;
                  setEvaluaciones([...evaluacionesEdicion]);
                }}
                width="90%"
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "8px",
              }}
            >
              <Boton
                texto="Ver Evaluaciones"
                onClick={() => mostrarEvaluaciones(evaluacion.nid_matricula)}
              />
            </div>
          </div>
        ))}

        <div style={{ justifyContent: "center", display: "flex" }}>
          <Boton
            texto="Guardar Evaluaciones"
            onClick={() => {
              lanzaRegistroEvaluaciones(
                evaluaciones,
                nidCurso,
                nidAsignatura,
                nidTrimestre,
              );
            }}
          />
        </div>
      </div>

      <ModalExito
        visible={visibleExito}
        setVisible={setVisibleExito}
        mensaje={"Evaluaciones guardadas con éxito."}
        textBoton={"Aceptar"}
      />

      <ModalAviso
        visible={visibleAviso}
        setVisible={setVisibleAviso}
        mensaje={"Se ha producido un error"}
        textBoton={"Aceptar"}
      />
    </>
  );
}
