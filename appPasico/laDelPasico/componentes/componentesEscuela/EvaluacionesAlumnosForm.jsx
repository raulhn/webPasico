import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Button, ScrollView } from 'react-native';
import { EntradaGroupRadioButton, EntradaTexto, Boton, ModalExito, ModalAviso, BotonFixed } from '../componentesUI/ComponentesUI';
import ServiceEvaluaciones from '../../servicios/serviceEvaluaciones';
import { useRouter } from 'expo-router';

const opcionesProgreso = [
  { etiqueta: 'Progresa Adecuadamente', valor: 2 },
  { etiqueta: 'Necesita Mejorar', valor: 1 },
  { etiqueta: 'Sin evaluar', valor: 0}
];

export default function EvaluacionesAlumnosForm({ alumnos, evaluacionesRecuperadas=[], nid_curso, nid_asignatura, nid_trimestre }) {
  // Estado para las evaluaciones de cada alumno

  const router = useRouter();

  const [modalVisibleExito, setModalVisibleExito] = useState(false);
  const [modalVisibleAviso, setModalVisibleAviso] = useState(false);

  function recuperarEvaluacion(alumno)
{
  const progresos = ["Sin evaluar", "Necesita Mejorar", "Progresa Adecuadamente"]
  let evaluacionRecuperada = null;
  for (const evaluacionActual of evaluacionesRecuperadas) {
    
    if (evaluacionActual.nid_alumno === alumno.nid_persona) {
      evaluacionRecuperada = evaluacionActual;

      const evaluacionProcesada = {
      id: evaluacionRecuperada.nid_alumno,
      nid_evaluacion: evaluacionRecuperada.nid_evaluacion,
      nid_matricula_asignatura: evaluacionRecuperada.nid_matricula_asignatura,
      nota: evaluacionRecuperada.nota ? evaluacionRecuperada.nota.toString() : '',
      progreso: { valor: evaluacionRecuperada.nid_tipo_progreso, etiqueta: progresos[evaluacionRecuperada.nid_tipo_progreso] },
      comentario: evaluacionRecuperada.comentario,
      nombre: evaluacionRecuperada.alumno,
      nid_matricula: alumno.nid_matricula
      };
  
      return evaluacionProcesada
    }
  }

  return { id: alumno.nid_persona,
           nid_evaluacion: null,
           nid_matricula_asignatura: alumno.nid_matricula_asignatura,
           nota: '',
           progreso: { valor: "0", etiqueta: progresos[0] },
           comentario: '',
           nombre: alumno.nombre + " " + alumno.primer_apellido + " " + alumno.segundo_apellido,
          nid_matricula: alumno.nid_matricula
      };
}

  const [evaluaciones, setEvaluaciones] = useState(
    alumnos.map(alumno => (recuperarEvaluacion(alumno)))
  );

  useEffect(() => {
    const evaluacionesProcesadas = alumnos.map(alumno => (recuperarEvaluacion(alumno)));
    
   setEvaluaciones(evaluacionesProcesadas);
  }, [alumnos, evaluacionesRecuperadas]);


  let evaluacionesEdicion = [...evaluaciones]

  const handleGuardar = () => {

    ServiceEvaluaciones.registrarEvaluaciones(evaluaciones, nid_curso, nid_asignatura, nid_trimestre)
      .then(response => {
        console.log("Evaluaciones guardadas:", response);
        setModalVisibleExito(true);
      })
      .catch(error => {
        console.error("Error al guardar evaluaciones:", error);
        setModalVisibleAviso(true);
      });
  };



  return (
    <>
    <ScrollView contentContainerStyle={estilos.scrollContainer}>
      {evaluaciones.map((evaluacion, idx) => (
        <View key={ evaluacion.id} style={estilos.card}>
          <Text style={estilos.nombre}>{evaluacion.nombre}</Text>
          <View style={{position: "absolute", top: 10, right: 10}}>

        <BotonFixed
            icon="menu-book"
            onPress={() => {
              router.push({
                pathname: "/stackEvaluaciones/fichaEvaluacion/" + evaluacion.nid_matricula,
                params: { pestana: Number(nid_trimestre) - 1 },
              });
            }}
            size={30}
          />
          </View>
          <Text style={estilos.label}>Nota (0-10)</Text>


          <EntradaTexto placeholder={"0-10"} valor={evaluacionesEdicion[idx].nota} 
          setValor={(v) => {evaluacionesEdicion[idx].nota = v; setEvaluaciones([...evaluacionesEdicion])}} />
          <Text style={estilos.label}>Progreso:</Text>
    

          <EntradaGroupRadioButton
            titulo={"Progreso"}
            opciones={opcionesProgreso}
            valor={evaluacionesEdicion[idx].progreso}
            setValorSeleccionado={v => {evaluacionesEdicion[idx].progreso = v; setEvaluaciones([...evaluacionesEdicion])}}
          />
          <Text style={estilos.label}>Comentario:</Text>
          <EntradaTexto 
            placeholder={"Comentario"}
            valor={evaluacionesEdicion[idx].comentario}
            setValor={(v) => {evaluacionesEdicion[idx].comentario = v; setEvaluaciones([...evaluacionesEdicion])}}
            multiline= {true}
            ancho={"100%"}
            alto={"100"}
          />
        
        </View>
      ))}

      <Boton nombre="Guardar Evaluaciones" onPress={handleGuardar} />
    </ScrollView>
    <ModalExito
      visible={modalVisibleExito}
      setVisible={() => setModalVisibleExito(false)}
      mensaje="Evaluaciones guardadas con éxito"
      textBoton={"Aceptar"}
    />
    <ModalAviso
      visible={modalVisibleAviso}
      setVisible={() => setModalVisibleAviso(false)}
      mensaje="Error al guardar evaluaciones"
      textBoton={"Aceptar"}
    />
    </>
  );
}

const estilos = StyleSheet.create({
  scrollContainer: {
    padding: 16,
    alignItems: 'center',
    paddingBottom: 40,
  },
  card: {
    width: '98%',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 2,
  },
  nombre: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#0077cc',
  },
  label: {
    fontSize: 14,
    color: '#444',
    marginTop: 8,
    marginBottom: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    fontSize: 16,
    marginBottom: 6,
    backgroundColor: '#f9f9f9',
  },
  picker: {
    height: 40,
    width: '100%',
    marginBottom: 6,
  },
  textarea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 8,
    fontSize: 15,
    minHeight: 60,
    backgroundColor: '#f9f9f9',
    textAlignVertical: 'top',
  },
});
