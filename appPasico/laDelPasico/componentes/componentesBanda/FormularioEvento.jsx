import { View, Text, StyleSheet } from "react-native";
import { useState } from "react";
import EntradaTexto from "../componentesUI/EntradaTexto";
import Boton from "../componentesUI/Boton";
import { AuthContext } from "../../providers/AuthContext";
import { useContext } from "react";
import serviceEventoConcierto from "../../servicios/serviceEventoConcierto"; // Asegúrate de importar tu servicio correctamente

import ModalExito from "../componentesUI/ModalExito";
import EntradaFecha from "../componentesUI/EntradaFecha";

export default function FormularioEvento({ cancelar, callback }) {
  const [nombreEvento, setNombreEvento] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaEvento, setFechaEvento] = useState("");

  const { cerrarSesion } = useContext(AuthContext);

  const [exito, setExito] = useState(false);

  function registrarEventoConcierto() {
    if (nombreEvento === "" || descripcion === "") {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const evento = {
      nombre: nombreEvento,
      fecha_evento: new Date(fechaEvento),
      descripcion: descripcion,
      tipo_evento: "Concierto",
      publicado: "N",
    };

    serviceEventoConcierto
      .registrarEventoConcierto(evento, cerrarSesion)
      .then((response) => {
        if (response.error) {
          console.error("Error al obtener eventos:", response.mensaje);
          return;
        }
        console.log("Evento registrado:", response);

        setExito(true); // Cambia el estado de éxito a verdadero
        //  callback(); // Llama a la función de callback para refrescar la lista de eventos
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

      <EntradaFecha></EntradaFecha>
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
      <ModalExito
        visible={exito} // Cambia esto según tu lógica
        callback={() => {
          setExito(false);
          callback(); // Llama a la función de callback para refrescar la lista de eventos
        }} // Cambia esto según tu lógica
        mensaje="Evento registrado con éxito"
        textBoton="Aceptar"
      />
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
