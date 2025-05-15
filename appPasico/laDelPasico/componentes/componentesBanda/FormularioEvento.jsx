import { View, Text, StyleSheet } from "react-native";
import { useState } from "react";
import EntradaTexto from "../componentesUI/EntradaTexto";
import Boton from "../componentesUI/Boton";
import { AuthContext } from "../../providers/AuthContext";
import { useContext } from "react";
import serviceEventoConcierto from "../../servicios/serviceEventoConcierto"; // Asegúrate de importar tu servicio correctamente

export default function FormularioEvento({ cancelar, guardar }) {
  const [nombreEvento, setNombreEvento] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaEvento, setFechaEvento] = useState("");

  const { cerrarSesion } = useContext(AuthContext);

  function registrarEventoConcierto() {
    if (nombreEvento === "" || descripcion === "") {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const evento = {
      nombre: nombreEvento,
      fecha_evento: "2023-10-01", // Cambia esto por la fecha real
      descripcion: descripcion,
      tipo_evento: "Concierto",
      publicado: true,
    };

    serviceEventoConcierto
      .registrarEventoConcierto(evento, cerrarSesion)
      .then((response) => {
        console.log("Evento registrado:", response);
        alert("Evento registrado con éxito");
      })
      .catch((error) => {
        console.error("Error al registrar el evento:", error);
        alert("Error al registrar el evento");
      });
  }

  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Crear evento</Text>
      <Text>Nombre de Evento</Text>
      <EntradaTexto
        placeholder="Nombre del Evento"
        setValor={(text) => setNombreEvento(text)}
      ></EntradaTexto>

      <Text>Descripción</Text>
      <EntradaTexto
        placeholder="Descripción del Evento"
        setValor={(text) => setDescripcion(text)}
        ancho={300}
        alto={100}
        multiline={true}
      ></EntradaTexto>

      <Text>Fecha</Text>
      <EntradaTexto
        placeholder="Fecha del Evento"
        setValor={(text) => setFechaEvento(text)}
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          gap: 10,
          width: "100%",
        }}
      >
        <Boton nombre="Guardar" onPress={registrarEventoConcierto} />
        <Boton nombre="Cancelar" color="red" onPress={cancelar} />
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titulo: {
    fontSize: 24, // Tamaño de fuente grande
    fontWeight: "bold", // Negrita para destacar
    color: "#007CFA", // Color azul para resaltar
    marginBottom: 20, // Espacio debajo del título
    textAlign: "center", // Centrado horizontalmente
  },
});
