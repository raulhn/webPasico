import { CustomTabs, Boton } from "../componentesUI/ComponentesUI";
import SelectorGrupo from "./SelectorGrupo";
import SelectorPersona from "./SelectorPersona";
import { Text, View } from "react-native";
import { useEffect, useState } from "react";
import Constantes from "../../config/constantes";
import { useAsignaturas } from "../../hooks/escuela/useAsignaturas";
import { useTiposMusicos } from "../../hooks/personas/useTipoMusicos";

export default function TabSelector({ callback, personasSeleccionadas, tipo }) {
  const [pestanaSeleccionada, setPestanaSeleccionada] = useState(0);
  const recuperaPersonas = (eventosRecuperados) => {
    const seleccion = {};
    seleccion.tipo = Constantes.INDIVIDUAL;
    seleccion.conjunto = eventosRecuperados;
    callback(seleccion);
  };

  const { tiposMusicos } = useTiposMusicos();
  const listaTiposMusicos = tiposMusicos.map((tipo) => ({
    etiqueta: tipo.descripcion,
    valor: tipo.nid_tipo_musico,
  }));

  const recuperaConjuntoMusicos = (conjuntoRecuperado) => {
    const seleccion = {};

    seleccion.tipo = Constantes.BANDA;
    seleccion.conjunto = conjuntoRecuperado;
    callback(seleccion);
  };

  const recuperaConjuntoAlumnos = (conjuntoRecuperado) => {
    const seleccion = {};
    seleccion.tipo = Constantes.ESCUELA;
    seleccion.conjunto = conjuntoRecuperado;

    callback(seleccion);
  };

  const [seleccionadasIndvidual, setseleccionadasIndividual] = useState([]);
  const [seleccionadasBanda, setseleccionadasBanda] = useState([]);
  const [seleccionadasEscuela, setseleccionadasEscuela] = useState([]);

  const { asignaturas, error, cargando } = useAsignaturas();

  const listaAsignaturas = asignaturas.map((asignatura) => ({
    etiqueta: asignatura.descripcion,
    valor: asignatura.nid_asignatura,
  }));

  useEffect(() => {
    if (personasSeleccionadas) {
      if (personasSeleccionadas.tipo === Constantes.INDIVIDUAL) {
        setPestanaSeleccionada(1);
        setseleccionadasIndividual(personasSeleccionadas.conjunto);
      } else if (personasSeleccionadas.tipo === Constantes.BANDA) {
        setPestanaSeleccionada(0);
        setseleccionadasBanda(personasSeleccionadas.conjunto);
      } else if (personasSeleccionadas.tipo === Constantes.ESCUELA) {
        setPestanaSeleccionada(0);
        setseleccionadasEscuela(personasSeleccionadas.conjunto);
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
            <SelectorGrupo
              titulo={"Selecciona Banda"}
              callback={recuperaConjuntoMusicos}
              valorTipos={seleccionadasBanda}
              opciones={listaTiposMusicos}
            />
          </>
        );
      },
    });
  }

  if (tipo == Constantes.ESCUELA) {
    tabs.push({
      nombre: "Asignaturas",
      contenido: () => {
        return (
          <>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <Text style={estilos.titulo}>Selecciona Asignatura</Text>
            </View>

            <SelectorGrupo
              titulo={"Selecciona Asignatura"}
              callback={recuperaConjuntoAlumnos}
              valorTipos={seleccionadasEscuela}
              opciones={listaAsignaturas}
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
