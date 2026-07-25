import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import Cabecera from "../../Cabecera/Cabecera";
import {
  Boton,
  ModalAviso,
  ModalExito,
  Selector,
} from "../../ComponentesUI/ComponentesUI";
import {
  guardarAsistenciaGrupo,
  obtenerAsistenciaGrupo,
  obtenerGrupos,
} from "../../../services/serviceGrupos";
import { URL_SUBPATH } from "../../../config/Constantes";
import "./Asistencias.css";

const DIAS_SEMANA = ["D", "L", "M", "X", "J", "V", "S"];

function fechaActual() {
  const ahora = new Date();
  const mes = String(ahora.getMonth() + 1).padStart(2, "0");
  const dia = String(ahora.getDate()).padStart(2, "0");
  return `${ahora.getFullYear()}-${mes}-${dia}`;
}

function nombreCompleto(alumno) {
  return [alumno.nombre, alumno.primer_apellido, alumno.segundo_apellido]
    .filter(Boolean)
    .join(" ");
}

function esDiaDeClase(horario, fecha) {
  const fechaSeleccionada = new Date(`${fecha}T00:00:00`);
  return (horario || "")
    .split("-")
    .includes(DIAS_SEMANA[fechaSeleccionada.getDay()]);
}

export default function Asistencias() {
  const navigate = useNavigate();
  const [fecha, setFecha] = useState(fechaActual);
  const [grupos, setGrupos] = useState([]);
  const [nidGrupo, setNidGrupo] = useState("");
  const [alumnos, setAlumnos] = useState([]);
  const [cargandoGrupos, setCargandoGrupos] = useState(true);
  const [cargandoAsistencia, setCargandoAsistencia] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  useEffect(() => {
    async function cargarGrupos() {
      try {
        const respuesta = await obtenerGrupos();
        if (respuesta.error) {
          throw new Error(
            respuesta.message || "No se han podido obtener los grupos.",
          );
        }
        setGrupos(respuesta.grupos.map(({ grupo }) => grupo));
      } catch (error) {
        setError(error.message || "No se han podido obtener los grupos.");
      } finally {
        setCargandoGrupos(false);
      }
    }

    cargarGrupos();
  }, []);

  const gruposDelDia = useMemo(
    () => grupos.filter((grupo) => esDiaDeClase(grupo.horario, fecha)),
    [fecha, grupos],
  );

  useEffect(() => {
    if (
      !gruposDelDia.some(
        (grupo) => String(grupo.nid_grupo) === String(nidGrupo),
      )
    ) {
      setNidGrupo("");
      setAlumnos([]);
    }
  }, [gruposDelDia, nidGrupo]);

  useEffect(() => {
    if (!nidGrupo) {
      return;
    }

    async function cargarAsistencia() {
      setCargandoAsistencia(true);
      try {
        const respuesta = await obtenerAsistenciaGrupo(nidGrupo, fecha);
        if (respuesta.error) {
          throw new Error(
            respuesta.message || "No se ha podido obtener la asistencia.",
          );
        }
        setAlumnos(
          respuesta.alumnos.map((alumno) => ({
            ...alumno,
            falta: alumno.falta === "S",
            justificada: alumno.justificada === "S",
          })),
        );
      } catch (error) {
        setError(error.message || "No se ha podido obtener la asistencia.");
        setAlumnos([]);
      } finally {
        setCargandoAsistencia(false);
      }
    }

    cargarAsistencia();
  }, [fecha, nidGrupo]);

  function actualizarAlumno(nidMatriculaAsignatura, cambios) {
    setAlumnos((alumnosActuales) =>
      alumnosActuales.map((alumno) =>
        String(alumno.nid_matricula_asignatura) ===
        String(nidMatriculaAsignatura)
          ? { ...alumno, ...cambios }
          : alumno,
      ),
    );
  }

  async function guardarAsistencia() {
    setGuardando(true);
    try {
      const respuesta = await guardarAsistenciaGrupo(
        nidGrupo,
        fecha,
        alumnos.map((alumno) => ({
          nid_matricula_asignatura: alumno.nid_matricula_asignatura,
          falta: alumno.falta,
          justificada: alumno.falta && alumno.justificada,
          causa: alumno.falta && alumno.justificada ? alumno.causa.trim() : "",
        })),
      );
      if (respuesta.error) {
        throw new Error(
          respuesta.message || "No se ha podido guardar la asistencia.",
        );
      }
      setExito("Asistencia guardada correctamente.");
    } catch (error) {
      setError(error.message || "No se ha podido guardar la asistencia.");
    } finally {
      setGuardando(false);
    }
  }

  const opcionesGrupos = [
    { valor: "", etiqueta: "Selecciona un grupo" },
    ...gruposDelDia.map((grupo) => ({
      valor: grupo.nid_grupo,
      etiqueta: grupo.nombre,
    })),
  ];

  return (
    <>
      {" "}
      <Cabecera />
      <div className="contenedor" style={{ paddingTop: "60px" }}>
        <main className="asistencias-container">
          <h2>Registro de asistencias</h2>
          <div className="asistencias-filtros">
            <label>
              Fecha
              <input
                type="date"
                value={fecha}
                onChange={(event) => setFecha(event.target.value)}
              />
            </label>
            <Selector
              valor={nidGrupo}
              setValor={setNidGrupo}
              opciones={opcionesGrupos}
              width="280px"
            />
          </div>

          {cargandoGrupos && <p>Cargando grupos...</p>}
          {!cargandoGrupos && gruposDelDia.length === 0 && (
            <p>No tienes grupos programados para la fecha seleccionada.</p>
          )}
          {cargandoAsistencia && <p>Cargando asistencia...</p>}
          {!cargandoAsistencia && nidGrupo && alumnos.length === 0 && (
            <p>Este grupo no tiene alumnos.</p>
          )}
          {!cargandoAsistencia && alumnos.length > 0 && (
            <>
              <p className="asistencias-ayuda">
                Por defecto todos los alumnos están presentes. Marca solo las
                faltas.
              </p>
              <div className="asistencias-listado">
                {alumnos.map((alumno) => (
                  <article
                    className="asistencia-alumno"
                    key={alumno.nid_matricula_asignatura}
                  >
                    <strong>{nombreCompleto(alumno)}</strong>
                    <label>
                      <input
                        type="checkbox"
                        checked={alumno.falta}
                        onChange={(event) =>
                          actualizarAlumno(alumno.nid_matricula_asignatura, {
                            falta: event.target.checked,
                            justificada: event.target.checked
                              ? alumno.justificada
                              : false,
                            causa: event.target.checked ? alumno.causa : "",
                          })
                        }
                      />
                      Ha faltado
                    </label>
                    <label>
                      <input
                        type="checkbox"
                        disabled={!alumno.falta}
                        checked={alumno.falta && alumno.justificada}
                        onChange={(event) =>
                          actualizarAlumno(alumno.nid_matricula_asignatura, {
                            justificada: event.target.checked,
                            causa: event.target.checked ? alumno.causa : "",
                          })
                        }
                      />
                      Falta justificada
                    </label>
                    <label className="asistencia-causa">
                      Causa
                      <input
                        type="text"
                        maxLength="500"
                        disabled={!alumno.falta || !alumno.justificada}
                        value={
                          alumno.falta && alumno.justificada ? alumno.causa : ""
                        }
                        onChange={(event) =>
                          actualizarAlumno(alumno.nid_matricula_asignatura, {
                            causa: event.target.value,
                          })
                        }
                      />
                    </label>
                  </article>
                ))}
              </div>
              <div className="asistencias-acciones">
                <Boton
                  texto={guardando ? "Guardando..." : "Guardar asistencia"}
                  onClick={guardarAsistencia}
                />
                <Boton
                  texto="Volver"
                  onClick={() => navigate(`${URL_SUBPATH}/`)}
                />
              </div>
            </>
          )}

          <ModalAviso
            visible={Boolean(error)}
            setVisible={() => setError("")}
            mensaje={error}
            textBoton="Aceptar"
            titulo="Error"
          />
          <ModalExito
            visible={Boolean(exito)}
            setVisible={() => setExito("")}
            mensaje={exito}
            textBoton="Aceptar"
          />
        </main>
      </div>
    </>
  );
}
