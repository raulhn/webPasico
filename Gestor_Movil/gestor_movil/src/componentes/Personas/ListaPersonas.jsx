
import { useAlumnosAsignatura} from "../../hooks/useAlumnosAsignatura";
import { DataTable, Selector } from "../ComponentesUI/ComponentesUI";
import { useCursos } from "../../hooks/useCursos";
import { useAsignaturas } from "../../hooks/useAsignaturas";


export default function ListaPersonas()
{
  const [curso, setCurso] = useState(null);
  const [asignatura, setAsignatura] = useState(null);
  const [activo, setActivo] = useState(0);

  const {cursos} = useCursos();
  const {asignaturas} = useAsignaturas();

  const opcionesAsignatura = 
    asignaturas.map(asignatura => ({ valor: asignatura.nid_asignatura, etiqueta: asignatura.descripcion }));
  opcionesAsignatura.push({valor: "", etiqueta: "Seleccione asignatura"});

  const opcionesCurso = 
    cursos.map(curso => ({ valor: curso.nid_curso, etiqueta: curso.descripcion }));
  opcionesCurso.push({valor: "", etiqueta: "Seleccione curso"});

  const activos = [
    { nid: 0, nombre: "Todos" },
    { nid: 1, nombre: "Activos" },
    { nid: 2, nombre: "Inactivos" },
  ];

  const opcionesActivos = 
    activos.map(activo => ({ valor: activo.nid, etiqueta: activo.nombre }));

  const { alumnos, cargando, error, lanzarRefresco, setNidAsignatura, setNidCurso } = useAlumnosAsignatura(curso, asignatura, activo);

  return (
    <Selector opciones={opcionesCurso} valor={curso} setValor={(valor) => { setCurso(valor); setNidCurso(valor); lanzarRefresco(); }} width="250px"/>
    <Selector opciones={opcionesAsignatura} valor={asignatura} setValor={(valor) => { setAsignatura(valor); setNidAsignatura(valor); lanzarRefresco(); }} width="250px"/>
    <Selector opciones={opcionesActivos} valor={activo} setValor={(valor) => { setActivo(valor); lanzarRefresco(); }} width="150px"/>
    <DataTable cabeceras={["NID", "Nombre", "Apellidos", "Email"]} datos={alumnos} />

  ) 
}
