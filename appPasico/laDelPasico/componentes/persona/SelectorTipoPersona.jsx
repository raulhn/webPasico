import { View, Text } from "react-native";
import { useState } from "react";
import { GroupRadioInput } from "../componentesUI/ComponentesUI";

export default function SelectorTipoPersona() {
  return (
    <View style={{ padding: 20 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
        Selecciona el tipo de persona
      </Text>

      <GroupRadioInput
        opciones={opciones}
        setValorSeleccionado={setValorSeleccionado}
        valor={valor}
      />
    </View>
  );
}
