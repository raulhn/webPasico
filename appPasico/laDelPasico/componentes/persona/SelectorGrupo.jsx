import { useEffect, useState } from "react";
import SelectorMultipleTipoPersona from "./SelectorMultipleTipoPersona";
import { View } from "react-native";
import { Boton } from "../componentesUI/ComponentesUI";

export default function SelectorGrupo({
  titulo,
  callback,
  valorTipos,
  opciones,
}) {
  const [tiposRecuperados, setTiposRecuperados] = useState([]);

  useEffect(() => {
    if (valorTipos && valorTipos.length > 0) {
      setTiposRecuperados(valorTipos);
    }
  }, [valorTipos]);

  return (
    <View style={{ gap: 10, paddingTop: 10 }}>
      <SelectorMultipleTipoPersona
        titulo={titulo}
        tiposEventos={tiposRecuperados}
        callback={(eventos) => {
          setTiposRecuperados(eventos);
        }}
        opciones={opciones}
      />
      <View style={{ alignItems: "center", marginTop: 20 }}>
        <Boton nombre="Aceptar" onPress={() => callback(tiposRecuperados)} />
      </View>
    </View>
  );
}
