import { View, Text, Modal } from "react-native";
import { useEffect, useState } from "react";
import { GroupRadioInput } from "../componentesUI/ComponentesUI";
import { Pressable, StyleSheet } from "react-native";
import ServiceTipoMusico from "../../servicios/serviceTipoMusico";
import { AuthContext } from "../../providers/AuthContext";
import { useContext } from "react";
import { Boton } from "../componentesUI/ComponentesUI";

export default function SelectorTipoPersona({
  setTexto,
  ancho = "200",
  placeHolderFiltro = "Elige Tipo",
}) {
  const [visible, setVisible] = useState(false);
  const [refrescar, setRefrescar] = useState(false);
  const [opciones, setOpciones] = useState([]);
  const [valor, setValor] = useState(null);
  const { cerrarSesion } = useContext(AuthContext);

  useEffect(() => {
    ServiceTipoMusico.obtenerTiposMusico(cerrarSesion).then((respuesta) => {
      if (respuesta.error) {
        console.error("Error al obtener los tipos de músico:", respuesta.error);
      } else {
        const tipos = respuesta.tipos_musico.map((tipo) => ({
          etiqueta: tipo.descripcion,
          valor: tipo.nid_tipo_musico,
        }));
        setOpciones(tipos);
      }
    });
  }, [refrescar]);

  const setValorSeleccionado = (valor) => {
    setTexto(valor);
    setValor(valor);
    setVisible(false);
  };

  return (
    <>
      <Pressable onPress={() => setVisible(true)}>
        <View style={[estilos.entradaTexto, { width: ancho }]}>
          <Text style={valor ? {} : { color: "gray" }}>
            {valor && valor.etiqueta !== ""
              ? valor.etiqueta
              : placeHolderFiltro}
          </Text>
        </View>
      </Pressable>
      <Modal
        animationType="slide"
        visible={visible}
        onRequestClose={() => {
          setVisible(false);
        }}
      >
        <View style={estilos.modalContainer}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>
            Selecciona el tipo de persona
          </Text>
          <GroupRadioInput
            opciones={opciones}
            setValorSeleccionado={setValorSeleccionado}
            valor={valor}
          />
        </View>

        <View style={{ flex: 1, alignItems: "center" }}>
          <Boton
            nombre="Limpiar"
            onPress={() => {
              setValorSeleccionado(null);
            }}
          />
        </View>
      </Modal>
    </>
  );
}

const estilos = StyleSheet.create({
  modalContainer: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    padding: 20,
  },
  entradaTexto: {
    height: 40,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  titulo: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
