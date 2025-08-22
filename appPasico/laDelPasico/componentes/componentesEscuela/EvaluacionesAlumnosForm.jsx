import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Button, ScrollView } from 'react-native';
import { EntradaGroupRadioButton, EntradaTexto } from '../componentesUI/ComponentesUI';

const opcionesProgreso = [
  { etiqueta: 'Progresa Adecuadamente', valor: 'adecuado' },
  { etiqueta: 'Necesita Mejorar', valor: 'mejorar' },
  { etiqueta: 'Sin evaluar', valor: 0}
];

export default function EvaluacionesAlumnosForm({ alumnos, evaluacionesRecuperadas=[], onGuardar }) {
  // Estado para las evaluaciones de cada alumno

function recuperarEvaluacion(alumno)
{
  let evaluacionRecuperada = null;
  for (const evaluacionActual of evaluacionesRecuperadas) {
    
    if (evaluacionActual.nid_alumno === alumno.nid_persona) {
      evaluacionRecuperada = evaluacionActual;

      console.log("Evaluacion recuperada:", evaluacionActual);
      return {
      id: evaluacionRecuperada.nid_alumno,
      nota: evaluacionRecuperada.nota,
      progreso: evaluacionRecuperada.progreso,
      comentario: evaluacionRecuperada.comentario,
      nombre: evaluacionRecuperada.alumno
    };
    }
  }
  
  return { id: alumno.nid_persona, nota: '', progreso: 0, comentario: '', nombre: alumno.nombre + " " + alumno.primer_apellido + " " + alumno.segundo_apellido };
}

  const [evaluaciones, setEvaluaciones] = useState(
    alumnos.map(alumno => (recuperarEvaluacion(alumno)))
  );

  useEffect(() => {
    const evaluacionesProcesadas = alumnos.map(alumno => (recuperarEvaluacion(alumno)));
    console.log("Evaluaciones procesadas:", evaluacionesProcesadas);
   setEvaluaciones(evaluacionesProcesadas);
  }, [alumnos, evaluacionesRecuperadas]);



  const handleChange = (index, campo, valor) => {
    const nuevas = [...evaluaciones];
    nuevas[index][campo] = valor;
    setEvaluaciones(nuevas);
  };

  const handleGuardar = () => {
    if (onGuardar) onGuardar(evaluaciones);
  };

  return (
    <ScrollView contentContainerStyle={estilos.scrollContainer}>
      {evaluaciones.map((evaluacion, idx) => (
        <View key={ evaluacion.id} style={estilos.card}>
          <Text style={estilos.nombre}>{evaluacion.nombre}</Text>
          <Text style={estilos.label}>Nota (0-10):</Text>


          <EntradaTexto placeholder={"0-10"} valor={evaluacion.nota} setValor={(v) => handleChange(idx, 'nota', v)} />
          <Text style={estilos.label}>Progreso:</Text>
    

          <EntradaGroupRadioButton
            titulo={"Progreso"}
            opciones={opcionesProgreso}
            valor={evaluaciones.progreso}
            setValorSeleccionado={v => handleChange(idx, 'progreso', v)}
          />
          <Text style={estilos.label}>Comentario:</Text>
          <EntradaTexto 
            placeholder={"Comentario"}
            valor={evaluacion.comentario}
            setValor={(v) => handleChange(idx, 'comentario', v)}
            multiline= {true}
            ancho={"100%"}
            alto={"100"}
          />
        
        </View>
      ))}
      <Button title="Guardar Evaluaciones" onPress={handleGuardar} />
    </ScrollView>
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
