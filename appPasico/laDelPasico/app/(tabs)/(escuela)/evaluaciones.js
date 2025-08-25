import EvaluacionesAlumnosForm from "../../../componentes/componentesEscuela/EvaluacionesAlumnosForm";
import { useAlumnosAsignaturaProfesor } from "../../../hooks/escuela/useAlumnos";
import { useContext, useState} from "react";
import { AuthContext } from "../../../providers/AuthContext";
import { useAsignaturasProfesor } from "../../../hooks/escuela/useAsignaturas";
import { useCursos } from "../../../hooks/escuela/useCurso";
import { View, Text } from "react-native";
import { EntradaGroupRadioButton, Boton } from "../../../componentes/componentesUI/ComponentesUI";
import { useTrimestre } from "../../../hooks/useTrimestre";
import { useRouter } from "expo-router";

export default function Evaluaciones() {

  const {cerrarSesion} = useContext(AuthContext);
  const { asignaturas, cargando, error, lanzarRefresco } = useAsignaturasProfesor(cerrarSesion);
  const { cursos, cargando: cargandoCursos, error: errorCursos } = useCursos(cerrarSesion);
  const { trimestres, cargando: cargandoTrimestres, error: errorTrimestres } = useTrimestre(cerrarSesion);

  const [cursoSeleccionado, setCursoSeleccionado] = useState({etiqueta: "", valor: null});
  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState({etiqueta: "", valor: null});
  const [trimestreSeleccionado, setTrimestreSeleccionado] = useState({etiqueta: "", valor: null});

  const router = useRouter();

  const opcionesAsignaturas = asignaturas.map(asignatura => ({
        etiqueta: asignatura.descripcion,
        valor: asignatura.nid_asignatura
    }));

  const opcionesCursos = cursos.map(curso => ({
        etiqueta: curso.descripcion,
        valor: curso.nid_curso
    }));

  const opcionesTrimestres = trimestres.map(trimestre => ({
        etiqueta: trimestre.descripcion,
        valor: trimestre.nid_trimestre
  }));


  return (
    <>
                <View style={{ justifyContent: "center", flex:1, padding: 10, backgroundColor: "#ffffff"}}>
                    <View style={{justifyContent: "center", alignItems: "center"}}>
                <Text>Curso</Text>
                <EntradaGroupRadioButton
                    opciones={opcionesCursos}
                    titulo = {"Cursos"}
                    valor = {cursoSeleccionado}
                    setValorSeleccionado={(valor) => {setCursoSeleccionado(valor);  lanzarRefresco();
                     }}
                />
                </View>
                <View style={(cursoSeleccionado.valor) ? {justifyContent:"center", alignItems:"center"} : {display: "none"}}>
                <Text>Asignatura</Text>
                <EntradaGroupRadioButton
                    valor = {asignaturaSeleccionada}
                    opciones={opcionesAsignaturas}
                    titulo = {"Asignaturas"}
                    setValorSeleccionado={(valor) => {setAsignaturaSeleccionada(valor); 
                     }}
                />
              </View>
               <View style={(cursoSeleccionado.valor && asignaturaSeleccionada.valor) ? {justifyContent:"center", alignItems:"center"} : {display: "none"}}>
                <Text>Trimestre</Text>
                <EntradaGroupRadioButton
                    valor = {trimestreSeleccionado}
                    opciones={opcionesTrimestres}
                    titulo = {"Trimestres"}
                    setValorSeleccionado={(valor) => {setTrimestreSeleccionado(valor); ;
                     }}
                />
              </View>

              <View style={cursoSeleccionado.valor && asignaturaSeleccionada.valor && trimestreSeleccionado.valor ? { justifyContent: "center", alignItems: "center" } : { display: "none" }}>

                  <Boton nombre="Evaluar" onPress={() => 
                  {router.push({ pathname: '/CrearEvaluaciones/' + cursoSeleccionado.valor, 
                    params: {  nidAsignatura: asignaturaSeleccionada.valor, nidTrimestre: trimestreSeleccionado.valor }})} }/>

              </View>
              </View>

    </>
  );
}