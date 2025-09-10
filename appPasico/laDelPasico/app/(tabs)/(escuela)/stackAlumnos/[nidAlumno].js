import {View, ScrollView, Text, ActivityIndicator, StyleSheet} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useContext } from 'react';
import { AuthContext } from '../../../../providers/AuthContext'
import {useAlumnoProfesor } from '../../../../hooks/escuela/useAlumnos'
import  { RefreshControl } from 'react-native';
import { Boton } from '../../../../componentes/componentesUI/ComponentesUI';
import { useNavigation } from 'expo-router';
import { useEffect } from 'react';

export default function FichaAlumno() {
   const { nidAlumno, nidCurso } = useLocalSearchParams();
   const { cerrarSesion } = useContext(AuthContext);

   const { alumno, cargando, error, refrescar, lanzarRefresco} = useAlumnoProfesor(nidAlumno, nidCurso, cerrarSesion);


  
   if (cargando)
   {
     return (
       <View style={estilos.centrado}>
         <ActivityIndicator size="large" color="#0077cc" />
       </View>
     );
   }

   if (error || (!alumno && !cargando))
   {
     return (
       <View style={estilos.centrado}>
         <Text style={estilos.error}>Error al cargar la información del alumno</Text>
         <Boton nombre="Reintentar" onPress={lanzarRefresco} />
       </View>
     );
   }

   function muestraPadre()
   {
    if (alumno && alumno.padre)
    {
      const padre = alumno.padre;
      return (
        <View style={estilos.card}>
          <Text style={estilos.tituloSecundario}>Padre</Text>
          <Text style={estilos.texto}>{padre.nombre} {padre.primer_apellido} {padre.segundo_apellido}</Text>
           <Text style={estilos.label}>Correo electrónico:</Text>
           <Text style={estilos.texto}>{padre.correo_electronico}</Text>
           <Text style={estilos.label}>Teléfono:</Text>
           <Text style={estilos.texto}>{padre.telefono}</Text>
        </View>
      );
    }
   }

   function muestraMadre()
   {
     if (alumno && alumno.madre)
     {
       const madre = alumno.madre;
       return (
         <View style={estilos.card}>
           <Text style={estilos.tituloSecundario}>Madre</Text>
           <Text style={estilos.texto}>{madre.nombre} {madre.primer_apellido} {madre.segundo_apellido}</Text>
           <Text style={estilos.label}>Correo electrónico:</Text>
           <Text style={estilos.texto}>{madre.correo_electronico}</Text>
           <Text style={estilos.label}>Teléfono:</Text>
           <Text style={estilos.texto}>{madre.telefono}</Text>
         </View>
       );
     }
   }

   function muestraAlumno()
   {
     if (alumno && alumno.persona)
     {
       const alumnoRecuperado = alumno.persona;
       return (
         <View style={estilos.card}>
           <Text style={estilos.tituloPrincipal}>Alumno</Text>
           <Text style={estilos.texto}>{alumnoRecuperado.nombre} {alumnoRecuperado.primer_apellido} {alumnoRecuperado.segundo_apellido}</Text>
           <Text style={estilos.label}>Correo electrónico:</Text>
           <Text style={estilos.texto}>{alumnoRecuperado.correo_electronico}</Text>
           <Text style={estilos.label}>Teléfono:</Text>
           <Text style={estilos.texto}>{alumnoRecuperado.telefono}</Text>
         </View>
       );
     }
   }

  return (
    <ScrollView
      style={estilos.fondo}
      contentContainerStyle={estilos.scrollContainer}
      refreshControl={<RefreshControl refreshing={refrescar} onRefresh={lanzarRefresco} />}
    >
      {muestraAlumno()}
      {muestraPadre()}
      {muestraMadre()}
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  fondo: {
    backgroundColor: "#f4f6fa",
  },
  scrollContainer: {
    padding: 16,
    alignItems: "center",
  },
  centrado: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f4f6fa",
  },
  card: {
    width: "98%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  tituloPrincipal: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0077cc",
    marginBottom: 8,
  },
  tituloSecundario: {
    fontSize: 17,
    fontWeight: "600",
    color: "#444",
    marginBottom: 4,
  },
  texto: {
    fontSize: 16,
    color: "#222",
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    color: "#888",
    marginTop: 6,
    marginBottom: 2,
  },
  error: {
    color: "#c00",
    fontSize: 16,
    marginBottom: 12,
    textAlign: "center",
  },
});