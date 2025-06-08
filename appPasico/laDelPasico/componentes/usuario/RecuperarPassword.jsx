import { StyleSheet, View, Image, Text } from "react-native";
import { useState } from "react";

import serviceUsuario from "../../servicios/serviceUsuario";

import {
  ModalAviso,
  ModalExito,
  Boton,
  EntradaTexto,
} from "../componentesUI/ComponentesUI";

export default function RecuperarPassword() {
  const logo = require("../../assets/logo.png");
  const [correo, setCorreo] = useState("");
  const [error, setError] = useState(null);
  const [exito, setExito] = useState(null);

  function peticionRecuperarPassword() {
    if (correo === "") {
      setError("El campo correo es obligatorio");
      return;
    }

    serviceUsuario
      .recuperarPassword(correo)
      .then((response) => {
        if (response.error) {
          setError("Se ha producido un error al recuperar la contraseña");
        } else {
          setExito("Se enviará un correo para recuperar la contraseña");
        }
      })
      .catch((error) => {
        console.error("Error al recuperar la contraseña:", error);
      });
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View style={{ paddingBottom: 30 }}>
        <Image source={logo} style={estilos.logo}></Image>
      </View>
      <Text>Correo Electrónico</Text>
      <EntradaTexto
        valor={correo}
        setValor={setCorreo}
        secureTextEntry={false}
        placeholder={"Correo Electrónico"}
        ancho={"300"}
      />
      <Boton
        nombre="Recuperar Contraseña"
        onPress={() => {
          peticionRecuperarPassword();
        }}
      />
      <ModalAviso
        visible={error !== null}
        mensaje={error}
        setVisible={() => setError(null)}
        textBoton="Aceptar"
      />
      <ModalExito
        visible={exito !== null}
        mensaje={exito}
        callback={() => setExito(null)}
        textBoton="Aceptar"
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  logo: {
    height: 100,
    width: 100,
  },
});
