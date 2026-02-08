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
          if (!disabled && typeof accion === "function") accion();
        }}
        disabled={disabled}
        android_ripple={{ color: "rgba(0,0,0,0.06)", radius: 24 }}
      >
        <View
          style={[
            estilos.dayBox,
            esHoy && estilos.dayToday,
            esSeleccionado && estilos.daySelected,
            tieneEvento && estilos.dayWithEvent,
          ]}
        >
          <Text
            style={
              disabled
                ? estilos.textoDisabled
                : esSeleccionado
                ? estilos.textoSelected
                : estilos.texto
            }
          >
            {numDia}
          </Text>
          {tieneEvento && <View style={[estilos.eventDot, esSeleccionado && estilos.eventDotOnSelected]} />}
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
    padding: 4,
  },
  texto: {
    fontSize: 20,
    color: "#333",
  },
  textoDisabled: {
    color: "#ccc",
    fontSize: 20,
  },
  dayBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  dayToday: {
    backgroundColor: "#fff59d",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  daySelected: {
    backgroundColor: "#1976d2",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 6,
  },
  dayWithEvent: {
    borderWidth: 1.5,
    borderColor: "#4caf50",
  },
  textoSelected: {
    color: "#fff",
    fontSize: 20,
  },
  eventDot: {
    position: "absolute",
    bottom: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4caf50",
  },
  eventDotOnSelected: {
    backgroundColor: "#a5d6a7",
  },
});
