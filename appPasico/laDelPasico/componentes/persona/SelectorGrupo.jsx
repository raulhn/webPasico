import { useEffect, useState } from "react";
import { useTiposMusicos } from "../../hooks/personas/useTipoMusicos";
import SelectorMultipleTipoPersona from "../persona/SelectorMultipleTipoPersona";
import { View } from "react-native";

export default function SelectorGrupo({ callback }) {
  const { tiposMusicos } = useTiposMusicos();
  const [tiposMusicosRecuperados, setTiposMusicosRecuperados] = useState([]);

  return (
    <View style={{ gap: 10, paddingTop: 10 }}>
      <SelectorMultipleTipoPersona
        tiposEventos={tiposMusicosRecuperados}
        callback={(eventos) => {
          setTiposMusicosRecuperados(eventos);
          callback(eventos);
        }}
      />
    </View>
  );
}
