import "./ListaPersonas.css";
import { Boton, DataTable, Selector } from "../../ComponentesUI/ComponentesUI";
import { useCursos } from "../../../hooks/useCursos";
import { useAsignaturas } from "../../../hooks/useAsignaturas";
import { useAlumnosAsignatura } from "../../../hooks/useAlumnos";
import { usePersonas } from "../../../hooks/usePersonas";
import { useState } from "react";
import Cabecera from "../../Cabecera/Cabecera";

export default function ListaPersonas() {
  const { cursos } = useCursos();
  const { asignaturas } = useAsignaturas();

  const [curso, setCurso] = useState("");
  const [asignatura, setAsignatura] = useState("");
  const [activo, setActivo] = useState(1);
  const [seleccionado, setSeleccionado] = useState(null);
  const [tipo, setTipo] = useState(1);

  let opcionesAsignatura = asignaturas.map((asignatura) => ({
    valor: asignatura.nid_asignatura,
    etiqueta: asignatura.descripcion,
  }));
  opcionesAsignatura.push({ valor: "", etiqueta: "Seleccione asignatura" });

  let opcionesCurso = cursos.map((curso) => ({
    valor: curso.nid_curso,
    etiqueta: curso.descripcion,
  }));

  opcionesCurso.push({ valor: "", etiqueta: "Seleccione curso" });

  const tipoPersonas = [
    { nid: 1, nombre: "Personas" },
    { nid: 2, nombre: "Socios" },
    { nid: 3, nombre: "Alumnos" },
  ];

  const activos = [
    { nid: 0, nombre: "Todos" },
    { nid: 1, nombre: "Activos" },
    { nid: 2, nombre: "Inactivos" },
  ];

  const opcionesActivos = activos.map((activo) => ({
    valor: activo.nid,
    etiqueta: activo.nombre,
  }));

  const opcionesTipoPersonas = tipoPersonas.map((tipo) => ({
    valor: tipo.nid,
    etiqueta: tipo.nombre,
  }));

  const {
    alumnos,
    lanzarRefresco,
    setNidAsignatura,
    setNidCurso,
    setActivo: setActivoHook,
  } = useAlumnosAsignatura(curso, asignatura, activo);

  const {
    personas,
    setTipoPersona,
    refresh,
    setActivoPersona,
    setNidCursoPersona,
  } = usePersonas(tipo, activo, curso);

  let bidimensional = [];

  if (tipo != 3 && asignatura == "") {
    bidimensional = personas.map((persona) => [
      persona.nid_persona,
      persona.nombre,
      persona.primer_apellido,
      persona.segundo_apellido,
    ]);
  } else {
    bidimensional = alumnos.map((persona) => [
      persona.nid_persona,
      persona.nombre,
      persona.primer_apellido,
      persona.segundo_apellido,
    ]);
  }

  function accionSeleccion(filaSeleccionada) {
    setSeleccionado(filaSeleccionada);
  }

  console.log("Alumnos recuperados", bidimensional);
  return (
    <>
      <Cabecera />
      <div className="lista-personas-container">
        <div className="filtros-container">
          <Selector
            opciones={opcionesTipoPersonas}
            valor={tipo}
            setValor={(valor) => {
              setTipo(valor);
              setTipoPersona(valor);
              lanzarRefresco();
              refresh();
            }}
            width="150px"
          />
          {tipo == 3 && (
            <>
              <Selector
                opciones={opcionesCurso}
                valor={curso}
                setValor={(valor) => {
                  setCurso(valor);
                  setNidCurso(valor);
                  setNidCursoPersona(valor);
                  lanzarRefresco();
                }}
                width="250px"
              />
              <Selector
                opciones={opcionesAsignatura}
                valor={asignatura}
                setValor={(valor) => {
                  setAsignatura(valor);
                  setNidAsignatura(valor);
                  lanzarRefresco();
                }}
                width="250px"
              />
            </>
          )}

          {(tipo == 3 || tipo == 2) && (
            <Selector
              opciones={opcionesActivos}
              valor={activo}
              setValor={(valor) => {
                setActivo(valor);
                setActivoHook(valor);
                lanzarRefresco();
                setActivoPersona(valor);
              }}
              width="150px"
            />
          )}
        </div>
        <div className="tabla-container">
          <DataTable
            datos={bidimensional}
            cabeceras={["Nombre", "Primer Apellido", "Segundo Apellido"]}
            accion={accionSeleccion}
          />
        </div>
        <div
          style={seleccionado ? { display: "block" } : { display: "none" }}
          className="ficha-button-container"
        >
          <Boton
            texto={"Ver Ficha"}
            onClick={() => {
              window.open(`/gestion/ficha_persona/` + seleccionado, "_blank");
            }}
          />
        </div>
      </div>
    </>
  );
}
