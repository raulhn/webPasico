import { View, StyleSheet } from "react-native";
import {
  BotonFixed,
  EntradaGroupRadioButton,
} from "../componentesUI/ComponentesUI";
import { useEffect, useState } from "react";
import SelectorTipoPersona from "./SelectorTipoPersona";
import Constantes from "../../config/constantes.js";

export default function SelectorMultipleTipoPersona({
  titulo,
  tiposEventos,
  callback,
  opciones = [],
}) {
  const [numTiposEvento, setNumTiposEvento] = useState(1);
  const [tiposEventoRecuperados, setTiposEventoRecuperados] =
    useState(tiposEventos);

  useEffect(() => {
    if (tiposEventos && tiposEventos.length > 0) {
      setTiposEventoRecuperados(tiposEventos);
      setNumTiposEvento(tiposEventos.length);
    } else {
      setTiposEventoRecuperados([null]);
      setNumTiposEvento(1);
    }
  }, [tiposEventos]);

  function actualizarEventosRecuperados(eventosRecuperados) {
    setTiposEventoRecuperados(eventosRecuperados);
    callback(eventosRecuperados);
  }

  let retorno = [];
  for (let i = 0; i < numTiposEvento; i++) {
    if (i == numTiposEvento - 1) {
      retorno.push(
        <View style={estilos.containerSeleccionTipos} key={i}>
          <EntradaGroupRadioButton
            titulo={titulo}
            opciones={opciones}
            setValorSeleccionado={(valorSeleccionado) => {
              let auxTiposEvento = [...tiposEventoRecuperados];
              auxTiposEvento[i] = valorSeleccionado;
              actualizarEventosRecuperados(auxTiposEvento);
            }}
            valor={tiposEventoRecuperados[i] || null}
          />

          <BotonFixed
            onPress={() => {
              setNumTiposEvento(numTiposEvento + 1);
              let auxTiposEventosRecuperados = [...tiposEventoRecuperados];
              auxTiposEventosRecuperados.push(null);
              actualizarEventosRecuperados(auxTiposEventosRecuperados);
            }}
            size={30}
          ></BotonFixed>
        </View>
      );
    } else {
      retorno.push(
        <View style={estilos.containerSeleccionTipos} key={i}>
          <EntradaGroupRadioButton
            titulo={titulo}
            opciones={opciones}
            setValorSeleccionado={(valorSeleccionado) => {
              let auxTiposEvento = [...tiposEventoRecuperados];
              auxTiposEvento[i] = valorSeleccionado;
              actualizarEventosRecuperados(auxTiposEvento);
            }}
            valor={tiposEventoRecuperados[i] || null}
          />

          <BotonFixed
            onPress={() => {
              setNumTiposEvento(numTiposEvento - 1);
              let auxTiposEventosRecuperados = [...tiposEventoRecuperados];
              auxTiposEventosRecuperados.splice(i, 1);

              actualizarEventosRecuperados(auxTiposEventosRecuperados);
            }}
            size={30}
            colorBoton={"#FF0000"}
            icon={"close"}
          ></BotonFixed>
        </View>
      );
    }
  }
  return retorno;
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titulo: {
    fontSize: 24, // Tamaño de fuente grande
    fontWeight: "bold", // Negrita para destacar
    color: Constantes.COLOR_AZUL, // Color azul para resaltar
    marginBottom: 20, // Espacio debajo del título
    textAlign: "center", // Centrado horizontalmente
  },
  containerSeleccionTipos: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
