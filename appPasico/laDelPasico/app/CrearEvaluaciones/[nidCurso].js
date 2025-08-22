import {ActivityIndicator, ScrollView, Text, RefreshControl} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useAlumnosAsignaturaProfesor } from '../../hooks/escuela/useAlumnos';
import { useContext } from 'react';
import { AuthContext } from '../../providers/AuthContext';
import EvaluacionesAlumnosForm from '../../componentes/componentesEscuela/EvaluacionesAlumnosForm';
import { useEvaluacionesAsignatura } from '../../hooks/escuela/useEvaluaciones';

export default function CrearEvaluacion() {
  const { cerrarSesion } = useContext(AuthContext);
  const { nidCurso, nidAsignatura, nidTrimestre } = useLocalSearchParams();
    const {alumnos, cargando: cargandoAlumnos, lanzarRefresco,error: errorAlumnos, setNidAsignatura: setNidAsignaturaAlumnos, setNidCurso: setNidCursoAlumnos} 
    = useAlumnosAsignaturaProfesor(nidCurso, nidAsignatura, cerrarSesion);

  const { evaluaciones, cargando: cargandoEvaluaciones, error: errorEvaluaciones, lanzarRefresco: lanzarRefrescoEvaluaciones } = useEvaluacionesAsignatura(nidCurso, nidAsignatura, nidTrimestre, cerrarSesion);


  if (cargandoAlumnos) {
    return (<><ActivityIndicator /><Text>Cargando alumnos...</Text></>);
  }
  return (
    <ScrollView refreshControl={<RefreshControl refreshing={cargandoAlumnos} onRefresh={()=> {lanzarRefresco(); lanzarRefrescoEvaluaciones() }} />}>

      <EvaluacionesAlumnosForm alumnos={alumnos} nid_curso={nidCurso} nid_asignatura={nidAsignatura} nid_trimestre={nidTrimestre} evaluacionesRecuperadas={evaluaciones} />
    </ScrollView>
  );
}