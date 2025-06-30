import { CustomTabs, Boton } from "../componentesUI/ComponentesUI";
import SelectorGrupoMusicos from "./SelectorGrupoMusicos";
import SelectorPersona from "./SelectorPersona";
import { Text, View } from "react-native";
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
        setseleccionadasIndividual(personasSeleccionadas.conjunto);
      } else if (personasSeleccionadas.tipo === Constantes.BANDA) {
        setPestanaSeleccionada(0);
        setseleccionadasBanda(personasSeleccionadas.conjunto);
      }
    }
  }, [personasSeleccionadas]);

  let tabs = [];

  if (tipo === Constantes.BANDA) {
    tabs.push({
      nombre: "Bandas",
      contenido: () => {
        return (
          <>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text style={estilos.titulo}>Selecciona Banda</Text>
            </View>
            <SelectorGrupoMusicos
              callback={recuperaConjuntoMusicos}
              valorTiposMusicos={seleccionadasBanda}
            />
          </>
        );
      },
    });
  }

  tabs.push({
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
  });

  return <CustomTabs tabs={tabs} pestana={pestanaSeleccionada} />;
}

const estilos = {
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
  },
};
