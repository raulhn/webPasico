import { SafeAreaView } from "react-native-safe-area-context";
import EntradaTexto from "../componentesUI/EntradaTexto";
import { View, Text, Image } from "react-native";
import { useState } from "react";
import { StyleSheet } from "react-native";
import Boton from "../componentesUI/Boton";

export default function CambiarPassword() {
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [contrasenaActual, setContrasenaActual] = useState("");

  const logo = require("../../assets/logo.png");

  const cambiarContrasena = () => {};

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <View style={{ paddingBottom: 30 }}>
        <Image source={logo} style={estilos.logo}></Image>
      </View>
      <View>
        <Text>Contraseña Actual</Text>
        <EntradaTexto
          valor={contrasenaActual}
          setValor={setContrasenaActual}
          secureTextEntry={true}
        />

        <Text>Nueva Contraseña</Text>
        <EntradaTexto
          valor={nuevaContrasena}
          setValor={setNuevaContrasena}
          secureTextEntry={true}
        />

        <Text>Confirmar Nueva Contraseña</Text>
        <EntradaTexto
          valor={confirmarContrasena}
          setValor={setConfirmarContrasena}
          secureTextEntry={true}
        />
      </View>
      <Boton nombre="Actualizar" onPress={cambiarContrasena} color="#007CFA" />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  logo: {
    height: 100,
    width: 100,
  },
});
