import { CustomTabs, Boton } from "../componentesUI/ComponentesUI";
import SelectorGrupoMusicos from "./SelectorGrupoMusicos";
import SelectorPersona from "./SelectorPersona";
import { View } from "react-native";
import { useEffect, useState } from "react";
import Constantes from "../../config/constantes";

export default function TabSelector({ callback, personasSeleccionadas, tipo }) {
  const [pestanaSeleccionada, setPestanaSeleccionada] = useState(0);
  const recuperaPersonas = (eventosRecuperados) => {
    const seleccion = {};
    seleccion.tipo = Constantes.INDIVIDUAL;
    seleccion.conjunto = eventosRecuperados;
    callback(seleccion);
  };

  const recuperaConjuntoMusicos = (conjuntoRecuperado) => {
    console.log("Conjunto recuperado:", conjuntoRecuperado);
    const seleccion = {};

    seleccion.tipo = Constantes.BANDA;
    seleccion.conjunto = conjuntoRecuperado;
    callback(seleccion);
  };

  const [seleccionadasIndvidual, setseleccionadasIndividual] = useState([]);
  const [seleccionadasBanda, setseleccionadasBanda] = useState([]);

  useEffect(() => {
    if (personasSeleccionadas) {
      if (personasSeleccionadas.tipo === Constantes.INDIVIDUAL) {
        setPestanaSeleccionada(1);
        console.log("Personas seleccionadas:", personasSeleccionadas.conjunto);
        setseleccionadasIndividual(personasSeleccionadas.conjunto);
      } else if (personasSeleccionadas.tipo === Constantes.BANDA) {
        setPestanaSeleccionada(0);
        setseleccionadasBanda(personasSeleccionadas.conjunto);
      }
    }
  }, [personasSeleccionadas]);

  const tabs = [
    {
      nombre: "Bandas",
      contenido: () => {
        return (
          <SelectorGrupoMusicos
            callback={recuperaConjuntoMusicos}
            valorTiposMusicos={seleccionadasBanda}
          />
        );
      },
    },
    {
      nombre: "Individual",
      contenido: () => {
        return (
          <>
            <SelectorPersona
              callback={recuperaPersonas}
              personasSeleccionadas={seleccionadasIndvidual}
              tipo={tipo}
            />
          </>
        );
      },
    },
  ];

  return <CustomTabs tabs={tabs} pestana={pestanaSeleccionada} />;
}
