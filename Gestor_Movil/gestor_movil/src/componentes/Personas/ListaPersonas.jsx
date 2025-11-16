import { DataTable, Selector } from "../ComponentesUI/ComponentesUI";
import { useCursos } from "../../hooks/useCursos";
import { useAsignaturas } from "../../hooks/useAsignaturas";
import { useAlumnosAsignatura } from "../../hooks/useAlumnos";
import { useState } from "react";
import Cabecera from "../Cabecera/Cabecera";

export default function ListaPersonas() {
  const { cursos } = useCursos();
  const { asignaturas } = useAsignaturas();

  const [curso, setCurso] = useState(null);
  const [asignatura, setAsignatura] = useState(null);
  const [activo, setActivo] = useState(0);

  console.log("Cursos:", cursos);
  console.log("Asignaturas:", asignaturas);

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
    cargando,
    error,
    lanzarRefresco,
    setNidAsignatura,
    setNidCurso,
  } = useAlumnosAsignatura(curso, asignatura, activo);

  const bidimensional = alumnos.map((persona) => [
    persona.nombre,
    persona.primer_apellido,
    persona.segundo_apellido,
  ]);

  console.log("Alumnos recuperados", bidimensional);
  return (
    <>
      <Cabecera />
      <div className="contenedor" style={{ paddingTop: "60px" }}>
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
            lanzarRefresco();
          }}
          width="150px"
        />
        <DataTable
          datos={bidimensional}
          cargando={cargando}
          error={error}
          cabeceras={["Nombre", "Primer Apellido", "Segundo Apellido"]}
        />
      </div>
    </>
  );
}
