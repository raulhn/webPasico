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
import Constantes from "../../config/constantes";

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

  const [personasSeleccionadas, setPersonasSeleccionadas] = useState(null);

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
      if (!personasSeleccionadas) {
        return;
      }

      if (personasSeleccionadas.tipo === Constantes.INDIVIDUAL) {
        const arrayPersonas = Array.from(personasSeleccionadas.conjunto);

        await ServiceNotificacion.registrarNotificacion(
          arrayPersonas,
          titulo,
          mensaje,
          null,
          cerrarSesion
        );
      } else if (personasSeleccionadas.tipo === Constantes.BANDA) {
        const arrayGrupos = personasSeleccionadas.conjunto.map(
          (grupo) => grupo.valor
        );
        await ServiceNotificacion.registrarNotificacionGrupo(
          personasSeleccionadas.tipo,
          arrayGrupos,
          titulo,
          mensaje,
          null,
          cerrarSesion
        );
      }
      callback(); // Llama al callback para refrescar la lista de notificaciones
    } catch (error) {
      console.error("Error al enviar la notificación:", error);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Formulario de Notificación</Text>

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
        callback={(personasSeleccionadasRecuperadas) => {
          setPersonasSeleccionadas(personasSeleccionadasRecuperadas);
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
});
