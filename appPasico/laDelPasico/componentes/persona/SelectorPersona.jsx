import { ActivityIndicator, TextInput } from "react-native";
import { usePersonas } from "../../hooks/personas/usePersonas";
import { View, Text, TouchableOpacity } from "react-native";

import { AuthContext } from "../../providers/AuthContext";
import { useContext, useEffect } from "react";
import { FlatList } from "react-native";
import { CheckBox, EntradaTexto, Boton } from "../componentesUI/ComponentesUI";
import { useState, useRef } from "react";
import SelectorTipoPersona from "./SelectorTipoPersona";

export default function SelectorPersona({
  callback,
  personasSeleccionadas = new Set(),
  tipo = "",
}) {
  const { cerrarSesion } = useContext(AuthContext);

  const { personas, cargando } = usePersonas(tipo, cerrarSesion);

  const [personasFiltradas, setPersonasFiltradas] = useState([]);

  const [filtro, setFiltro] = useState("");

  const [seleccionados, setSeleccionados] = useState(personasSeleccionadas);

  const [numElementos, setNumElementos] = useState(30);

  const [nidTipoMusico, setNidTipoMusico] = useState(null);

  const flatListRef = useRef(null);

  function seleccion(item, seleccionado) {
    const nuevoSet = new Set(seleccionados);

    if (seleccionado) {
      nuevoSet.add(item.valor);
    } else {
      nuevoSet.delete(item.valor);
    }
    setSeleccionados(nuevoSet);
  }

  function seleccionarTodos() {
    if (seleccionados.size === personasFiltradas.length) {
      setSeleccionados(new Set());
    } else {
      setSeleccionados(new Set(personasFiltradas.map((p) => p.nid_persona)));
    }
  }

  function descripcionTipo() {
    if (tipo === "MUSICOS") {
      return "Selección Músicos";
    }
  }

  function obtenerIdentificador(item) {
    if (tipo === "MUSICOS") {
      return (
        item.nid_persona +
        "-" +
        item.nid_tipo_musico +
        "-" +
        item.nid_instrumento
      );
    }
    return item.nid_persona.toString();
  }

  // Filtra las personas al cargar el componente //
  useEffect(() => {
    const limpiar = (texto) =>
      texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    let personasFiltradas = personas;

    if (tipo === "MUSICOS" && nidTipoMusico) {
      personasFiltradas = personas.filter(
        (persona) => persona.nid_tipo_musico === nidTipoMusico
      );
      setPersonasFiltradas(personasFiltradas);
    }

    if (filtro === "") {
      setPersonasFiltradas(personasFiltradas);
    } else {
      personasFiltradas = personasFiltradas.filter((persona) => {
        const nombreCompleto = `${persona.nombre} ${persona.primer_apellido} ${persona.segundo_apellido}`;
        return limpiar(nombreCompleto)
          .toLowerCase()
          .includes(filtro.toLowerCase());
      });

      setPersonasFiltradas(personasFiltradas);
    }
    const nuevoSet = new Set(seleccionados);
    setSeleccionados(nuevoSet);
  }, [filtro, personas, nidTipoMusico]);

  if (cargando) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }
  return (
    <View style={{ padding: 10, flex: 1 }}>
      <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 10 }}>
        {descripcionTipo()}
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          marginBottom: 10,
        }}
      >
        <TextInput
          placeholder="Buscar persona..."
          style={{ width: "50%" }}
          onChangeText={(text) => {
            setFiltro(text);
          }}
          value={filtro}
        />
        <SelectorTipoPersona
          setTexto={(tipoSeleccionado) => {
            if (tipoSeleccionado === null) {
              setNidTipoMusico(null);
              return;
            }
            setNidTipoMusico(tipoSeleccionado.valor);
          }}
        />
      </View>
      <CheckBox
        setValorSeleccionado={() => {
          seleccionarTodos();
        }}
        item={{
          etiqueta: "Seleccionar todos",
        }}
      />
      <FlatList
        ref={flatListRef}
        data={personasFiltradas.slice(0, numElementos)}
        keyExtractor={obtenerIdentificador}
        renderItem={({ item }) => {
          const etiqueta = `${item.nombre} ${item.primer_apellido} ${item.segundo_apellido}`;
          return (
            <CheckBox
              setValorSeleccionado={seleccion}
              valorSeleccionado={seleccionados.has(item.nid_persona)}
              item={{
                etiqueta: etiqueta,
                valor: item.nid_persona,
              }}
            />
          );
        }}
      />

      <View style={[{ flexDirection: "row", justifyContent: "space-around" }]}>
        <View
          style={
            personasFiltradas.length <= numElementos ? { display: "none" } : {}
          }
        >
          <Boton
            nombre={"Cargar más"}
            onPress={() => {
              setNumElementos(numElementos + 30);
              setTimeout(() => {
                if (flatListRef.current) {
                  flatListRef.current.scrollToOffset({
                    offset: 10, // Puedes ajustar este valor según lo que necesites
                    animated: true,
                  });
                }
              }, 100);
            }}
          />
        </View>

        <Boton
          nombre={"Cerrar"}
          color={"red"}
          onPress={() => {
            callback(seleccionados);
          }}
        />
      </View>
    </View>
  );
}
