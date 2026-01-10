import { View, StyleSheet, Text } from "react-native";
import { useState } from "react";
import { BotonIconoComunity } from "../../componentesUI/ComponentesUI";

export default function SelectorMes({ mes, setMes }) {
  const MESES = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  const [mesActual, setMesActual] = useState(mes);

  function incrementarMes() {
    let nuevoMes = mesActual + 1;
    if (nuevoMes > 12) {
      nuevoMes = 1;
    }
    setMesActual(nuevoMes);
    setMes(nuevoMes);
  }

  function decrementarMes() {
    let nuevoMes = mesActual - 1;
    if (nuevoMes < 1) {
      nuevoMes = 12;
    }
    setMesActual(nuevoMes);
    setMes(nuevoMes);
  }

  return (
    <View style={styles.contenedorSelector}>
      <BotonIconoComunity
        nombreIcono="arrow-left-drop-circle"
        tamaño={24}
        color="black"
        onPress={() => {
          decrementarMes();
        }}
      />
      <Text style={styles.textoMes}>{MESES[mesActual - 1]}</Text>
      <BotonIconoComunity
        nombreIcono="arrow-right-drop-circle"
        tamaño={24}
        color="black"
        onPress={() => {
          incrementarMes();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contenedorSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  textoMes: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
