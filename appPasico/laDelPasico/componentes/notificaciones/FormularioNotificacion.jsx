import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import { useEffect, useState } from "react";

import { EntradaTexto, Boton } from "../componentesUI/ComponentesUI";
import ItemSelectorPersona from "../persona/ItemSelectorPersona";
import ServiceNotificacion from "../../servicios/serviceNotificacion";
import { AuthContext } from "../../providers/AuthContext";
import { useContext } from "react";

export default function FormularioNotificacion({
  callback,
  cancelar,
  valorTitulo = "",
  valorMensaje = "",
  tipo = "",
}) {
  const [titulo, setTitulo] = useState(valorTitulo);
  const [mensaje, setMensaje] = useState(valorMensaje);
  const { cerrarSesion } = useContext(AuthContext);

  const [personasSeleccionadas, setPersonasSeleccionadas] = useState([]);

  useEffect(() => {
    if (valorTitulo) {
      setTitulo(valorTitulo);
    }
    if (valorMensaje) {
      setMensaje(valorMensaje);
    }
  }, [valorTitulo, valorMensaje]);

  async function enviarNotificacion() {
    try {
      await ServiceNotificacion.registrarNotificacion(
        titulo,
        mensaje,
        personasSeleccionadas,
        {},
        cerrarSesion
      );
      callback(); // Llama al callback para refrescar la lista de notificaciones
    } catch (error) {
      console.error("Error al enviar la notificación:", error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Formulario de Notificación</Text>
      <Text style={{ fontSize: 16, marginBottom: 10 }}>{tipo}</Text>
      <EntradaTexto
        placeholder={"Título"}
        valor={titulo}
        setValor={(texto) => {
          setTitulo(texto);
        }}
      />
      <EntradaTexto
        placeholder={"Mensaje"}
        setValor={(texto) => {
          setMensaje(texto);
        }}
        valor={mensaje}
        multiline={true}
        alto={100}
      />
      <ItemSelectorPersona
        tipo={tipo}
        callback={(personasSeleccionadas) => {
          setPersonasSeleccionadas(personasSeleccionadas);
        }}
      />

      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          gap: 10,
        }}
      >
        <Boton
          nombre={"Enviar"}
          onPress={() => {
            enviarNotificacion();
          }}
        />
        <Boton
          nombre={"Cancelar"}
          onPress={() => {
            cancelar();
          }}
          color="red"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});
