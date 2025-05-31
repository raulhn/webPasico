import { View, Text, StyleSheet } from "react-native";
import { useRol } from "../../hooks/useRol";
import { Boton, BotonFixed } from "../componentesUI/ComponentesUI";
export default function CardPartitura({
  partitura,
  edicion,
  rolEdicion = false,
}) {
  const rol = useRol();

  function botonEditar() {
    if (rolEdicion && edicion) {
      return (
        <BotonFixed
          colorBoton={edicion.colorBoton}
          icon={edicion.icono}
          size={edicion.size}
          onPress={() => edicion.accion(partitura.nid_partitura)}
        />
      );
    }
  }

  return (
    <View style={styles.card}>
      <Text style={styles.titulo}>{partitura.titulo}</Text>

      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
          }}
        >
          Categoria:
        </Text>
        <Text> {partitura.nombre_categoria}</Text>
      </View>
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
          }}
        >
          Autor:
        </Text>
        <Text> {partitura.autor}</Text>
      </View>

      <View style={{ position: "absolute", top: 10, right: 20 }}>
        {botonEditar()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: "95%",
    height: 120,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    position: "relative",
  },
  titulo: {
    fontSize: 15,
    paddingBottom: 5,
    fontWeight: "bold",
    color: "#007CFA",
    textOverflow: "ellipsis",
  },
});
