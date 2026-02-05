import { View, Text, StyleSheet, Pressable } from "react-native";

export default function Dia({
  numDia,
  accion,
  disabled = false,
  esHoy = false,
  esSeleccionado = false,
  tieneEvento = false,
}) {
  return (
    <View style={estilos.contenedor}>
      <Pressable
        onPress={() => {
          accion();
        }}
      >
        <View
          style={[
            tieneEvento ? estilos.contenedorConEvento : {},
            esHoy ? estilos.contenedorHoy : {},
            esSeleccionado ? estilos.contenedorSeleccionado : {},
          ]}
        >
          <Text style={disabled ? estilos.textoDisabled : estilos.texto}>
            {numDia}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  texto: {
    fontSize: 20,
    color: "#333",
  },
  textoDisabled: {
    color: "#ccc",
    fontSize: 20,
  },
  contenedorHoy: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffeb3b",
    borderRadius: 80,
    width: 30,
  },
  contenedorSeleccionado: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#90caf9",
    borderRadius: 80,
    width: 30,
  },
  contenedorConEvento: {
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#4caf50",
    width: 30,
    alignItems: "center",
    justifyContent: "center",
  },
});
