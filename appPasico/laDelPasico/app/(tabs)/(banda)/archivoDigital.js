import { View, Text, StyleSheet } from "react-native";
import SelectorPartituras from "../../../componentes/componentesPartitura/SelectorPartituras";

export default function ArchivoDigital() {
  const recuperaPartitura = (nidPartitura) => {
    console.log("Recuperando partitura con nid:", nidPartitura);
  };

  const edicion = {
    icono: "mode-edit",
    size: 30,
  };

  return (
    <View style={estilos.container}>
      <Text style={estilos.title}>Archivo Digital</Text>

      {/* Aquí puedes agregar más contenido o componentes según sea necesario */}
      <SelectorPartituras callback={recuperaPartitura} edicion={edicion} />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    borderColor: "#ccc",
    borderWidth: 1,
    width: "100%",
    height: "100%",
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
});
