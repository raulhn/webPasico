import { View, StyleSheet, Text } from "react-native";
import { useState } from "react";
import { BotonIconoComunity } from "../../componentesUI/ComponentesUI";

export default function SelectorMes({ mes, anio, setMes }) {
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
  const [anioActual, setAnioActual] = useState(anio);

  function incrementarMes() {
    let nuevoMes = mesActual + 1;
    let nuevoAnio = anioActual;
    if (nuevoMes > 12) {
      nuevoMes = 1;
      nuevoAnio += 1;
      setAnioActual(nuevoAnio);
    }
    setMesActual(nuevoMes);
    setMes(nuevoMes, nuevoAnio);
  }
  console.log(mesActual, anioActual);
  function decrementarMes() {
    let nuevoMes = mesActual - 1;
    let nuevoAnio = anioActual;
    if (nuevoMes < 1) {
      nuevoMes = 12;
      nuevoAnio -= 1;
      setAnioActual(nuevoAnio);
    }
    setMesActual(nuevoMes);
    setMes(nuevoMes, nuevoAnio);
  }

  return (
    <>
      <View style={styles.contenedorSelector}>
        <BotonIconoComunity
          nombreIcono="arrow-left-drop-circle"
          tamaño={24}
          color="black"
          onPress={() => {
            decrementarMes();
          }}
        />
        <Text style={styles.textoMes}>
          {anioActual + " - " + MESES[mesActual - 1]}
        </Text>
        <BotonIconoComunity
          nombreIcono="arrow-right-drop-circle"
          tamaño={24}
          color="black"
          onPress={() => {
            incrementarMes();
          }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  contenedorSelector: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 1,
  },
  contenedorSelectorAnio: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 10,
  },
  textoMes: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
