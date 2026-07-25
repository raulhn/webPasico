import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router";
import Cabecera from "../../Cabecera/Cabecera";
import {
  Boton,
  DataTable,
  ModalAviso,
  ModalConfirmacion,
  ModalExito,
  Selector,
} from "../../ComponentesUI/ComponentesUI";
import {
  addAlumnoGrupo,
  actualizarHorarioGrupo,
  eliminarAlumnoGrupo,
  obtenerAlumnosAsignatura,
  obtenerGrupos,
} from "../../../services/serviceGrupos";
import { URL_SUBPATH } from "../../../config/Constantes";
import "./Grupos.css";

const DIAS_SEMANA = ["L", "M", "X", "J", "V", "S", "D"];

function nombreCompleto(alumno) {
  return [alumno.nombre, alumno.primer_apellido, alumno.segundo_apellido]
    .filter(Boolean)
    .join(" ");
}

export default function DetalleGrupo() {
  const { nidGrupo } = useParams();
  const navigate = useNavigate();
  const [grupo, setGrupo] = useState(null);
  const [alumnosDisponibles, setAlumnosDisponibles] = useState([]);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState("");
  const [alumnoAEliminar, setAlumnoAEliminar] = useState(null);
  const [confirmarEliminacion, setConfirmarEliminacion] = useState(false);
  const [diasSeleccionados, setDiasSeleccionados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  const cargarGrupo = useCallback(async () => {
    setCargando(true);
    try {
      const respuesta = await obtenerGrupos();
      const grupoEncontrado = respuesta.grupos.find(
        ({ grupo: elementoGrupo }) =>
          String(elementoGrupo.nid_grupo) === String(nidGrupo),
      );

      if (!grupoEncontrado) {
        setError("El grupo no existe o no tienes permiso para consultarlo.");
        setGrupo(null);
        return;
      }

      setGrupo(grupoEncontrado);
      setDiasSeleccionados(
        (grupoEncontrado.grupo.horario || "")
          .split("-")
          .filter((dia) => DIAS_SEMANA.includes(dia)),
      );
      const alumnos = await obtenerAlumnosAsignatura(
        grupoEncontrado.grupo.nid_asignatura,
      );
      setAlumnosDisponibles(alumnos);
    } catch (error) {
      setError(error.message || "No se ha podido cargar el grupo.");
    } finally {
      setCargando(false);
    }
  }, [nidGrupo]);

  useEffect(() => {
    cargarGrupo();
  }, [cargarGrupo]);

  const alumnosGrupo = useMemo(() => grupo?.alumnos ?? [], [grupo]);
  const alumnosQueSePuedenIncluir = useMemo(() => {
    const matriculasIncluidas = new Set(
      alumnosGrupo.map((alumno) => String(alumno.nid_matricula_asignatura)),
    );
    return alumnosDisponibles.filter(
      (alumno) =>
        !matriculasIncluidas.has(String(alumno.nid_matricula_asignatura)),
    );
  }, [alumnosDisponibles, alumnosGrupo]);

  const opcionesAlumnos = [
    { valor: "", etiqueta: "Selecciona un alumno" },
    ...alumnosQueSePuedenIncluir.map((alumno) => ({
      valor: alumno.nid_matricula_asignatura,
      etiqueta: nombreCompleto(alumno),
    })),
  ];

  async function incluirAlumno() {
    if (!alumnoSeleccionado) {
      setError("Selecciona un alumno para incluirlo en el grupo.");
      return;
    }

    try {
      const respuesta = await addAlumnoGrupo(
        grupo.grupo.nid_grupo,
        alumnoSeleccionado,
      );
      if (respuesta.error) {
        throw new Error(
          respuesta.message || "No se ha podido incluir el alumno.",
        );
      }
      setAlumnoSeleccionado("");
      setExito("Alumno incluido en el grupo.");
      cargarGrupo();
    } catch (error) {
      setError(error.message || "No se ha podido incluir el alumno.");
    }
  }

  async function eliminarAlumno() {
    try {
      const respuesta = await eliminarAlumnoGrupo(
        grupo.grupo.nid_grupo,
        alumnoAEliminar,
      );
      if (respuesta.error) {
        throw new Error(
          respuesta.message || "No se ha podido eliminar el alumno.",
        );
      }
      setAlumnoAEliminar(null);
      setConfirmarEliminacion(false);
      await cargarGrupo();
      setExito("Alumno eliminado del grupo.");
    } catch (error) {
      setError(error.message || "No se ha podido eliminar el alumno.");
    }
  }

  function cambiarDiaSeleccionado(dia) {
    setDiasSeleccionados((dias) =>
      dias.includes(dia)
        ? dias.filter((diaActual) => diaActual !== dia)
        : [...dias, dia],
    );
  }

  async function guardarHorario() {
    try {
      const horario = DIAS_SEMANA.filter((dia) =>
        diasSeleccionados.includes(dia),
      ).join("-");
      const respuesta = await actualizarHorarioGrupo(
        grupo.grupo.nid_grupo,
        horario,
      );
      if (respuesta.error) {
        throw new Error(
          respuesta.message || "No se ha podido guardar el horario.",
        );
      }
      setGrupo((grupoActual) => ({
        ...grupoActual,
        grupo: { ...grupoActual.grupo, horario },
      }));
      setExito("Horario guardado.");
    } catch (error) {
      setError(error.message || "No se ha podido guardar el horario.");
    }
  }

  if (cargando) {
    return <p>Cargando grupo...</p>;
  }

  if (!grupo) {
    return (
      <>
        <ModalAviso
          visible={Boolean(error)}
          setVisible={() => {
            setError("");
            navigate(`${URL_SUBPATH}/grupos`);
          }}
          mensaje={error}
          textBoton="Volver a grupos"
          titulo="Grupo no disponible"
        />
      </>
    );
  }

  const filasAlumnos = alumnosGrupo.map((alumno) => [
    alumno.nid_matricula_asignatura,
    nombreCompleto(alumno),
  ]);

  return (
    <div className="grupos-container detalle-grupo-container">
      <Cabecera />
      <h2>{grupo.grupo.nombre}</h2>
      <p>Profesor: {grupo.grupo.profesor}</p>
      <p>Alumnos incluidos: {alumnosGrupo.length}</p>

      <section className="horario-grupo">
        <h3>Horario</h3>
        <div className="dias-semana" role="group" aria-label="Días de clase">
          {DIAS_SEMANA.map((dia) => (
            <label key={dia} className="dia-semana">
              <input
                type="checkbox"
                checked={diasSeleccionados.includes(dia)}
                onChange={() => cambiarDiaSeleccionado(dia)}
              />
              {dia}
            </label>
          ))}
        </div>
        <Boton texto="Guardar horario" onClick={guardarHorario} />
      </section>

      <h3>Incluir alumno</h3>
      <div className="grupo-acciones">
        <Selector
          valor={alumnoSeleccionado}
          setValor={setAlumnoSeleccionado}
          opciones={opcionesAlumnos}
          width="300px"
        />
        <Boton texto="Incluir alumno" onClick={incluirAlumno} />
      </div>

      <h3>Alumnos del grupo</h3>
      <DataTable
        datos={filasAlumnos}
        cabeceras={["Alumno"]}
        accion={setAlumnoAEliminar}
      />
      <div className="grupo-acciones">
        <Boton
          texto="Eliminar alumno seleccionado"
          onClick={() => {
            if (!alumnoAEliminar) {
              setError("Selecciona un alumno del listado para eliminarlo.");
              return;
            }
            setConfirmarEliminacion(true);
          }}
        />
        <Boton
          texto="Volver a grupos"
          onClick={() => navigate(`${URL_SUBPATH}/grupos`)}
        />
      </div>

      <ModalConfirmacion
        visible={confirmarEliminacion}
        setVisible={setConfirmarEliminacion}
        mensaje="¿Quieres eliminar este alumno del grupo?"
        textBoton="Eliminar"
        textBotonCancelar="Cancelar"
        accion={eliminarAlumno}
        accionCancelar={() => setConfirmarEliminacion(false)}
      />
      <ModalAviso
        visible={Boolean(error)}
        setVisible={() => setError("")}
        mensaje={error}
        textBoton="Aceptar"
        titulo="Error"
      />
      <ModalExito
        visible={Boolean(exito)}
        setVisible={() => {
          setExito("");
        }}
        mensaje={exito}
        textBoton="Aceptar"
      />
    </div>
  );
}
