import { StyleSheet, View, Text } from "react-native";
import Pagina from "../../../componentes/Pagina.jsx";
export default function PlanEstudios() {
  return (
    <View style={estilos.principal}>
      <Pagina nidPagina={16} incluirTitulo={true} />
    </View>
  );
}

const estilos = StyleSheet.create({
  principal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
  titulo: {
    fontSize: 30,
    fontWeight: "bold",
    marginVertical: 10,
    alignContent: "center",
    textAlign: "center",
  },
  texto: {
    fontSize: 20,
    marginVertical: 10,
    alignContent: "center",
    textAlign: "center",
  },
});
