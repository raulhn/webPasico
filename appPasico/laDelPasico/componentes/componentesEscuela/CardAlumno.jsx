import { MaterialIcons } from '@expo/vector-icons';
import {View, Text, StyleSheet} from 'react-native';
import Constantes from '../../config/constantes.js';

export default function CardAlumno({ alumno }) {
    return (
        <View style={estilos.contenedor}>
            <View style={estilos.fila}>
                <MaterialIcons
                    name="person"
                    size={18}
                    color={Constantes.COLOR_AZUL}
                    style={{ marginRight: 6 }}
                />
                <Text
                    style={estilos.nombre}
                    numberOfLines={2}
                    ellipsizeMode="tail"
                    
                >
                    {alumno.nombre} {alumno.primer_apellido} {alumno.segundo_apellido}
                </Text>
            </View>
        </View>
    );
}

const estilos = StyleSheet.create({
    contenedor: {
        padding: 10,
        backgroundColor: "#fff",
        borderRadius: 12,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.15,
        shadowRadius: 4,
        elevation: 4,
        borderWidth: 0,
        width: "95%",
        alignSelf: "center",
    },
    fila: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        width: "100%",
    },
    nombre: {
        fontSize: 18,
        fontWeight: "600",
        color: "#333",
        letterSpacing: 0.5,
        flexShrink: 1,      // <-- Permite que el texto se reduzca si es necesario
        flexGrow: 1,        // <-- Ocupa el espacio restante
    }
});