import React from "react";

import { View, Text, Button, TextInput, Pressable, Image } from "react-native";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import Recaptcha from "../../componentes/Recaptcha.jsx";

export default function Registro() {
  const [inputActivo, setInputActivo] = React.useState(0);
  const logo = require("../../assets/logo.png");

  const [recaptchaToken, setRecaptchaToken] = useState(null);

  let dataRegistro = {
    nombre,
    primerApellido,
    segundoApellido,
    correo,
    password,
  };

  useEffect(() => {
    if (expoPushToken && recaptchaToken) {
      // Aquí se realiza la llamada al servicio de registro
      // Limpia el token de reCAPTCHA después de procesarlo
      setRecaptchaToken(null);
    }
  }, [expoPushToken, recaptchaToken]);

  // Envía el token al servidor backend
  const handleVerify = (tokenGoogle) => {
    setRecaptchaToken(tokenGoogle);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View style={estilos.container}>
          <View style={{ paddingBottom: 30 }}>
            <Image source={logo} style={estilos.logo}></Image>
          </View>
          <Text style={{ fontSize: 20, fontWeight: "bold" }}>
            Registro de Usuario
          </Text>
          <View
            style={{
              paddingTop: 20,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Text>Nombre</Text>
            <TextInput
              placeholder="Nombre"
              onFocus={() => setInputActivo(1)}
              onBlur={() => setInputActivo(0)}
              onChangeText={(text) => setNombre((dataRegistro.nombre = text))}
              style={
                inputActivo === 1
                  ? [estilos.inputFocus, { width: 300 }]
                  : [estilos.input, { width: 300 }]
              }
            />
            <Text>Primer Apellido</Text>
            <TextInput
              placeholder="Primer Apellido"
              onFocus={() => setInputActivo(2)}
              onBlur={() => setInputActivo(0)}
              onChangeText={(text) =>
                setPrimerApellido((dataRegistro.primerApellido = text))
              }
              style={
                inputActivo === 2
                  ? [estilos.inputFocus, { width: 300 }]
                  : [estilos.input, { width: 300 }]
              }
            />
            <Text>Segundo Apellido</Text>
            <TextInput
              onFocus={() => setInputActivo(3)}
              onBlur={() => setInputActivo(0)}
              placeholder="Segundo Apellido"
              onChangeText={(text) =>
                setSegundoApellido((dataRegistro.segundoApellido = text))
              }
              style={
                inputActivo === 3
                  ? [estilos.inputFocus, { width: 300 }]
                  : [estilos.input, { width: 300 }]
              }
            />
            <Text>Correo Electrónico</Text>
            <TextInput
              onFocus={() => setInputActivo(4)}
              onBlur={() => setInputActivo(0)}
              placeholder="Correo Electrónico"
              onChangeText={(text) => setCorreo((dataRegistro.correo = text))}
              style={
                inputActivo === 4
                  ? [estilos.inputFocus, { width: 300 }]
                  : [estilos.input, { width: 300 }]
              }
            />
            <Text>Contraseña</Text>
            <TextInput
              onFocus={() => setInputActivo(5)}
              onBlur={() => setInputActivo(0)}
              placeholder="Contraseña"
              onChangeText={(text) =>
                setContrasena((dataRegistro.password = text))
              }
              style={
                inputActivo === 5
                  ? [estilos.inputFocus, { width: 200 }]
                  : [estilos.input, { width: 200 }]
              }
              secureTextEntry
            />
            <Pressable
              onPress={() => {
                // Aquí puedes manejar el inicio de sesión del usuario
              }}
              title="Registrarse"
            >
              <View style={estilos.boton}>
                <Text
                  style={{
                    color: "#fff",
                    textAlign: "center",
                  }}
                >
                  Registrarse
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
      <Recaptcha siteKey={constantesGoogle.key} onVerify={handleVerify} />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  input: {
    width: 200,
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: "#ccc",
  },
  inputFocus: {
    width: 200,
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: "blue",
    borderWidth: 2,
  },
  boton: {
    backgroundColor: "#007BFF",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    width: 120,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    height: 100,
    width: 100,
  },
});
