import { CustomTabs } from "../componentesUI/ComponentesUI";
import SelectorGrupo from "./SelectorGrupo";
import SelectorPersona from "./SelectorPersona";
import { View } from "react-native";
import { useState } from "react";

export default function TabSelector({ callback, personasSeleccionadas, tipo }) {
  const [conjuntoPersonas, setconjuntoPersonas] = useState([]);
  const [tipoSeleccionado, setTipoSeleccionado] = useState("");

  const recuperaPersonas = (eventosRecuperados) => {
    setconjuntoPersonas(eventosRecuperados);
  };

  const recuperaConjunto = (conjuntoRecuperado) => {
    setconjuntoPersonas(conjuntoRecuperado);
  };

  const tabs = [
    {
      nombre: "Grupos",
      contenido: () => {
        return <SelectorGrupo callback={recuperaConjunto} />;
      },
    },
    {
      nombre: "Individual",
      contenido: () => {
        return (
          <SelectorPersona
            callback={recuperaPersonas}
            personasSeleccionadas={personasSeleccionadas}
            tipo={tipo}
          />
        );
      },
    },
  ];

  return <CustomTabs tabs={tabs} />;
}
