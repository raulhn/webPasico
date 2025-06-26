import { useEffect, useState } from "react";
import { useTiposMusicos } from "../../hooks/personas/useTipoMusicos";
import SelectorMultipleTipoPersona from "./SelectorMultipleTipoPersona";
import { View } from "react-native";
import { Boton } from "../componentesUI/ComponentesUI";

export default function SelectorGrupoMusicos({ callback, valorTiposMusicos }) {
  const { tiposMusicos } = useTiposMusicos();
  const [tiposMusicosRecuperados, setTiposMusicosRecuperados] = useState([]);

  useEffect(() => {
    if (valorTiposMusicos && valorTiposMusicos.length > 0) {
      setTiposMusicosRecuperados(valorTiposMusicos);
    }
  }, [valorTiposMusicos]);

  return (
    <View style={{ gap: 10, paddingTop: 10 }}>
      <SelectorMultipleTipoPersona
        tiposEventos={tiposMusicosRecuperados}
        callback={(eventos) => {
          setTiposMusicosRecuperados(eventos);
        }}
      />
      <View style={{ alignItems: "center", marginTop: 20 }}>
        <Boton
          nombre="Aceptar"
          onPress={() => callback(tiposMusicosRecuperados)}
        />
      </View>
    </View>
  );
}
