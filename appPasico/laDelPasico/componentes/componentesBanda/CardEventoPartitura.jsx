import { Text, View, StyleSheet } from "react-native";

export default function CardEventoPartitura({ EventoPartitura }) {
  let fecha_evento = "";
  let arrayColores = [
    "#FF5733",
    "#33FF57",
    "#8A2BE2",
    "#FF4500",
    "#1E90FF",
    "#FFD700",
  ];

  if (EventoPartitura.fecha_evento) {
    const fecha = new Date(EventoPartitura.fecha_evento);
    const formattedDate = fecha.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    fecha_evento = formattedDate;
  } else {
    fecha_evento = "Sin Definir";
  }

  function incluirTipos() {
    let tipos = EventoPartitura.tipos_evento;

    let muestraTipos = [];
    for (let i = 0; i < tipos.length; i++) {
      let color = arrayColores[i % arrayColores.length];

      muestraTipos.push(
        <View style={{ flexDirection: "row" }} key={i}>
          <Text style={{ fontWeight: "bold", color: color }}>
            {tipos[i].descripcion}{" "}
          </Text>
        </View>
      );
    }
    return muestraTipos;
  }

  return (
    <View style={styles.card}>
      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.titulo}>
        {EventoPartitura.nombre}
      </Text>

      <Text numberOfLines={2} ellipsizeMode="tail">
        {EventoPartitura.descripcion}
      </Text>
      <View
        style={[
          { flexDirection: "row", gap: 5 },
          EventoPartitura.lugar ? {} : { display: "none" },
        ]}
      >
        <Text numberOfLines={1} style={{ fontWeight: "bold" }}>
          Lugar:{" "}
        </Text>
        <Text>{EventoPartitura.lugar}</Text>
      </View>
      <View
        style={[
          { flexDirection: "row", gap: 5 },
          EventoPartitura.vestimenta ? {} : { display: "none" },
        ]}
      >
        <Text numberOfLines={1} style={{ fontWeight: "bold" }}>
          Vestimenta:{" "}
        </Text>
        <Text>{EventoPartitura.vestimenta}</Text>
      </View>
      <View style={{ flexDirection: "row", gap: 5 }}>{incluirTipos()}</View>
      <View
        style={{
          flexDirection: "row",
          position: "absolute",
          bottom: 10,
          right: 20,
        }}
      >
        <Text style={{ color: "#007CFA", fontWeight: "bold" }}>Fecha: </Text>
        <Text>{fecha_evento}</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    height: 170,
    width: "95%",

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
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007CFA",
  },
});
