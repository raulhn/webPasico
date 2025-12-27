import "./ListaPersonas.css";
import { Boton, DataTable, Selector } from "../../ComponentesUI/ComponentesUI";
import { useCursos } from "../../../hooks/useCursos";
import { useAsignaturas } from "../../../hooks/useAsignaturas";
import { useAlumnosAsignatura } from "../../../hooks/useAlumnos";
import { useState } from "react";
import Cabecera from "../../Cabecera/Cabecera";
import { useNavigate } from "react-router";

export default function ListaPersonas() {
  const { cursos } = useCursos();
  const { asignaturas } = useAsignaturas();

  const [curso, setCurso] = useState(null);
  const [asignatura, setAsignatura] = useState(null);
  const [activo, setActivo] = useState(0);
  const [seleccionado, setSeleccionado] = useState(null);

  const navigate = useNavigate();
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

  const activos = [
    { nid: 0, nombre: "Todos" },
    { nid: 1, nombre: "Activos" },
    { nid: 2, nombre: "Inactivos" },
  ];

  const opcionesActivos = activos.map((activo) => ({
    valor: activo.nid,
    etiqueta: activo.nombre,
  }));

  const {
    alumnos,
    lanzarRefresco,
    setNidAsignatura,
    setNidCurso,
    setActivo: setActivoHook,
  } = useAlumnosAsignatura(curso, asignatura, activo);

  const bidimensional = alumnos.map((persona) => [
    persona.nid_persona,
    persona.nombre,
    persona.primer_apellido,
    persona.segundo_apellido,
  ]);

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
            opciones={opcionesCurso}
            valor={curso}
            setValor={(valor) => {
              setCurso(valor);
              setNidCurso(valor);
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
          <Selector
            opciones={opcionesActivos}
            valor={activo}
            setValor={(valor) => {
              setActivo(valor);
              setActivoHook(valor);
              lanzarRefresco();
            }}
            width="150px"
          />
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
              navigate(`/gestion/ficha_persona/` + seleccionado);
            }}
          />
        </div>
      </div>
    </>
  );
}
