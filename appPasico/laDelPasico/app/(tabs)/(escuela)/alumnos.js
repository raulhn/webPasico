import {View, Text, ActivityIndicator, StyleSheet} from 'react-native';
import { useAsignaturasProfesor } from '../../../hooks/escuela/useAsignaturas';
import { EntradaGroupRadioButton } from '../../../componentes/componentesUI/ComponentesUI';
import { useCursos } from '../../../hooks/escuela/useCurso'; 
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../../providers/AuthContext';
import { useAlumnosAsignaturaProfesor } from '../../../hooks/escuela/useAlumnos';
import CardAlumno from '../../../componentes/componentesEscuela/CardAlumno';
import { FlatList } from 'react-native-gesture-handler';


export default function Alumnos()
{
    const {cerrarSesion} = useContext(AuthContext);
    const { asignaturas, cargando, error, lanzarRefresco } = useAsignaturasProfesor(cerrarSesion);
    const { cursos, cargando: cargandoCursos, error: errorCursos } = useCursos(cerrarSesion);
    const { alumnos, cargando: cargandoAlumnos, error: errorAlumnos, lanzarRefresco: lanzarRefrescoAlumnos } = 
    useAlumnosAsignaturaProfesor(valorCursoSeleccionado, valorAsignaturaSeleccionada, cerrarSesion);

    console.log("Cursos:", cursos);
    console.log("Alumnos:", alumnos);



    const [ asignaturaSeleccionada, setAsignaturaSeleccionada ] = useState(null);
    const [ cursoSeleccionado, setCursoSeleccionado ] = useState(null);

    const [ valorAsignaturaSeleccionada, setValorAsignaturaSeleccionada ] = useState(null);
    const [ valorCursoSeleccionado, setValorCursoSeleccionado ] = useState(null);

    if (cargando || cargandoCursos) {
        return (
            <View>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        )
    }

    if (error) {
        return <Text>Error: {error.message}</Text>;
    }

    const opcionesAsignaturas = asignaturas.map(asignatura => ({
        etiqueta: asignatura.descripcion,
        valor: asignatura.nid_asignatura
    }));

    const opcionesCursos = cursos.map(curso => ({
        etiqueta: curso.descripcion,
        valor: curso.nid_curso
    }));

    return (
        <>
            <View style={{flexDirection: "row", justifyContent: "space-around", padding: 10, backgroundColor: "#ffffff"}}>
                <View style={{justifyContent: "center", alignItems: "center"}}>
            <Text>Curso</Text>
            <EntradaGroupRadioButton
                opciones={opcionesCursos}
                titulo = {"Cursos"}
                valor = {cursoSeleccionado}
                setValorSeleccionado={(valor) => {setCursoSeleccionado(valor); setValorCursoSeleccionado(valor.valor);
                 }}
            />
            </View>
            <View style={(cursoSeleccionado && cursoSeleccionado.valor) ? {justifyContent:"center", alignItems:"center"} : {display: "none"}}>
            <Text>Asignatura</Text>
            <EntradaGroupRadioButton
                valor = {asignaturaSeleccionada}
                opciones={opcionesAsignaturas}
                titulo = {"Asignaturas"}
                setValorSeleccionado={(valor) => {setAsignaturaSeleccionada(valor); setValorAsignaturaSeleccionada(valor.valor); 
                 }}
            />
          </View>
          </View>
        <View style={estilos.contenedor}>
          <FlatList
            data={alumnos}
            renderItem={({ item }) => <CardAlumno alumno={item} />}
            keyExtractor={item => item.nid_persona}
          />
        </View>
        </>
    );
}

const estilos = StyleSheet.create({
    contenedor: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#ffffff"
    }
});