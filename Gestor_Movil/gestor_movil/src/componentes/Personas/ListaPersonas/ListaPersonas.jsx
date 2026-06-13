import "./ListaPersonas.css";
import { Boton, DataTable, Selector } from "../../ComponentesUI/ComponentesUI";
import { useCursos } from "../../../hooks/useCursos";
import { useAsignaturas } from "../../../hooks/useAsignaturas";
import { usePersonas } from "../../../hooks/usePersonas";
import { useState } from "react";
import Cabecera from "../../Cabecera/Cabecera";
import { URL_SUBPATH } from "../../../config/Constantes";

export default function ListaPersonas() {
  const { cursos } = useCursos();
  const { asignaturas } = useAsignaturas();

  const [curso, setCurso] = useState(0);
  const [asignatura, setAsignatura] = useState(0);
  const [activo, setActivo] = useState(1);
  const [seleccionado, setSeleccionado] = useState(null);
  const [tipo, setTipo] = useState(1);

  let opcionesAsignatura = asignaturas.map((asignatura) => ({
    valor: asignatura.nid_asignatura,
    etiqueta: asignatura.descripcion,
  }));
  opcionesAsignatura.push({ valor: 0, etiqueta: "Seleccione asignatura" });

  let opcionesCurso = cursos.map((curso) => ({
    valor: curso.nid_curso,
    etiqueta: curso.descripcion,
  }));

  opcionesCurso.push({ valor: 0, etiqueta: "Seleccione curso" });

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
  const { personas, refresh } = usePersonas(tipo, activo, curso, asignatura);

  let bidimensional = [];

  bidimensional = personas.map((personaObjeto) => [
    personaObjeto.persona.nid_persona,
    personaObjeto.persona.nombre,
    personaObjeto.persona.primer_apellido,
    personaObjeto.persona.segundo_apellido,
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
            opciones={opcionesTipoPersonas}
            valor={tipo}
            setValor={(valor) => {
              setTipo(valor);
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
                  refresh();
                }}
                width="250px"
              />
              <Selector
                opciones={opcionesAsignatura}
                valor={asignatura}
                setValor={(valor) => {
                  setAsignatura(valor);
                  refresh();
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
                refresh();
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
              window.open(
                URL_SUBPATH + `/ficha_persona/` + seleccionado,
                "_blank",
              );
            }}
          />
        </div>
      </div>
    </>
  );
}
