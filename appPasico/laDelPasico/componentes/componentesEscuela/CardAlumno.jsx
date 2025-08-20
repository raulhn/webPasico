import {View, Text, StyleSheet} from 'react-native';

export default function CardAlumno({ alumno }) {
    return (
        <View style={estilos.contenedor}>
                <Text style={estilos.nombre}>{alumno.nombre} {alumno.primer_apellido} {alumno.segundo_apellido}</Text>
       
            </View>
    );
}

const estilos = StyleSheet.create({
    contenedor: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ccc"
    },
    nombre: {
        fontSize: 16,
        fontWeight: "bold"
    }
});