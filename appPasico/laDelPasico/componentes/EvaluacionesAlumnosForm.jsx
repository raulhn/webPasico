import React, { useState } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Button, ScrollView } from 'react-native';
import { EntradaGroupRadioButton } from './componentesUI/ComponentesUI';

const opcionesProgreso = [
  { etiqueta: 'Progresa Adecuadamente', valor: 'adecuado' },
  { etiqueta: 'Necesita Mejorar', valor: 'mejorar' },
  { etiqueta: 'Sin evaluar', valor: 0}
];

export default function EvaluacionesAlumnosForm({ alumnos, onGuardar }) {
  // Estado para las evaluaciones de cada alumno
  const [evaluaciones, setEvaluaciones] = useState(
    alumnos.map(alumno => ({
      id: alumno.nid_persona,
      nota: '',
      progreso: 'adecuado',
      comentario: '',
    }))
  );

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
      {alumnos.map((alumno, idx) => (
        <View key={ alumno.nid_persona} style={estilos.card}>
          <Text style={estilos.nombre}>{alumno.nombre} {alumno.primer_apellido} {alumno.segundo_apellido}</Text>
          <Text style={estilos.label}>Nota (0-10):</Text>
          <TextInput
            style={estilos.input}
            keyboardType="numeric"
            maxLength={2}
            value={evaluaciones[idx].nota}
            onChangeText={v => handleChange(idx, 'nota', v.replace(/[^0-9]/g, '').slice(0,2))}
            placeholder="0-10"
          />
          <Text style={estilos.label}>Progreso:</Text>
    

          <EntradaGroupRadioButton
            titulo={"Progreso"}
            opciones={opcionesProgreso}
            valor={evaluaciones[idx].progreso}
            setValorSeleccionado={v => handleChange(idx, 'progreso', v)}
          />
          <Text style={estilos.label}>Comentario:</Text>
          <TextInput
            style={estilos.textarea}
            multiline
            numberOfLines={3}
            value={evaluaciones[idx].comentario}
            onChangeText={v => handleChange(idx, 'comentario', v)}
            placeholder="Comentario..."
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
