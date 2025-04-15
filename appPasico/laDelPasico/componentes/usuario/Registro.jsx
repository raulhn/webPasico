import React from "react";

import {
  View,
  Text,
  ScrollView,
  TextInput,
  Pressable,
  Image,
  Modal,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import ServiceUsuario from "../../servicios/serviceUsuario.js";
import Tunstile from "../../componentes/Turnstile.jsx";
import constantesGoogle from "../../config/constantesGoogle.js";

export default function registrarUsuario(recaptchaToken) {
  const [inputActivo, setInputActivo] = React.useState(0);
  const logo = require("../../assets/logo.png");

  const [errorValidacion, setErrorValidacion] = useState(false);
  const [exito, setExito] = useState(false);
  const [botonPresionado, setBotonPresionado] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [mensajeExito, setMensajeExito] = useState("");

  // Estados para los campos del formulario
  const [nombre, setNombre] = useState("");
  const [primerApellido, setPrimerApellido] = useState("");
  const [segundoApellido, setSegundoApellido] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  const [lanzaRegistro, setLanzaRegistro] = useState(false);

  function validacionRegistro() {
    if (nombre === "") {
      setMensajeError("El campo nombre es obligatorio");
      return false;
    }
    if (primerApellido === "") {
      setMensajeError("El campo primer apellido es obligatorio");
      return false;
    }
    if (correo === "") {
      setMensajeError("El campo correo es obligatorio");
      return false;
    }
    if (password === "") {
      setMensajeError("El campo contraseña es obligatorio");
      return false;
    }
    if (password !== password2) {
      setMensajeError("Las contraseñas no coinciden");
      return false;
    }
    if (password.length < 8) {
      setMensajeError("La contraseña debe tener al menos 8 caracteres");
      return false;
    }
    return true;
  }

  function handleVerify(event) {
    const token = event.nativeEvent.data;
    console.log("Token de reCAPTCHA:", token);
    peticionRegistrarUsuario(token);
    setLanzaRegistro(false);
  }

  function incluyeRecaptcha() {
    if (lanzaRegistro) {
      return (
        <Tunstile siteKey={constantesGoogle.key} onVerify={handleVerify} />
      );
    } else {
      return null;
    }
  }

  function peticionRegistrarUsuario(recaptchaToken) {
    try {
      setMensajeError("");
      if (!validacionRegistro()) {
        setErrorValidacion(true);
      } else {
        if (recaptchaToken) {
          ServiceUsuario.registrarUsuario(
            nombre,
            primerApellido,
            segundoApellido,
            correo,
            password,
            recaptchaToken
          )
            .then((response) => {
              if (response.error) {
                setMensajeError(response.mensaje);
                setErrorValidacion(true);
              } else {
                setMensajeExito("Usuario registrado correctamente");
                setExito(true);
              }
              // Aquí puedes manejar la respuesta del servidor
            })
            .catch((error) => {
              console.error("Error al registrar el usuario:", error);
              // Aquí puedes manejar el error
            });
        } else {
          console.log("El token de reCAPTCHA no está disponible");

          console.log(
            "Se ha producido un error durante el registro de usuario"
          );
        }
      }
    } catch (error) {
      console.error("Error en la petición:", error);
      setMensajeError(
        "Se ha producido un error durante el registro de usuario"
      );
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
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
                onChangeText={(text) => {
                  setNombre(text);
                }}
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
                onChangeText={(text) => {
                  setPrimerApellido(text);
                }}
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
                onChangeText={(text) => {
                  setSegundoApellido(text);
                }}
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
                onChangeText={(text) => {
                  setCorreo(text);
                }}
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
                onChangeText={(text) => {
                  setPassword(text);
                }}
                style={
                  inputActivo === 5
                    ? [estilos.inputFocus, { width: 200 }]
                    : [estilos.input, { width: 200 }]
                }
                secureTextEntry
              />
              <Text>Repita la contraseña</Text>
              <TextInput
                onFocus={() => setInputActivo(6)}
                onBlur={() => setInputActivo(0)}
                placeholder="Contraseña"
                onChangeText={(text) => {
                  setPassword2(text);
                }}
                style={
                  inputActivo === 6
                    ? [estilos.inputFocus, { width: 200 }]
                    : [estilos.input, { width: 200 }]
                }
                secureTextEntry
              />
              <Pressable
                onPress={() => {
                  setLanzaRegistro(true);
                  peticionRegistrarUsuario();
                }}
                onPressOut={() => {
                  setBotonPresionado(false);
                }}
                onPressIn={() => {
                  setBotonPresionado(true);
                }}
                title="Registrarse"
              >
                <View
                  style={
                    botonPresionado ? estilos.botonPresionado : estilos.boton
                  }
                >
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
            {incluyeRecaptcha()}
          </View>
        </View>
      </ScrollView>

      <Modal visible={errorValidacion} transparent={true} animationType="fade">
        <View
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={estilos.modal}>
            <View
              style={{
                borderRadius: 10,
                position: "absolute",
                top: 5,
                right: 5,
              }}
            >
              <Pressable
                onPress={() => {
                  setErrorValidacion(false);
                }}
              >
                <View style={estilos.botonCierre}>
                  <MaterialIcons name="close" size={24} color="white" />
                </View>
              </Pressable>
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                padding: 10,
              }}
            >
              <MaterialIcons
                name="warning-amber"
                size={60}
                color="#f87c00"
                style={estilos.iconoWarning}
              />
              <Text style={{ textAlign: "center" }}>{mensajeError}</Text>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={exito} transparent={true} animationType="fade">
        <View
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View style={estilos.modal}>
            <View
              style={{
                borderRadius: 10,
                position: "absolute",
                top: 5,
                right: 5,
              }}
            >
              <Pressable
                onPress={() => {
                  setExito(false);
                }}
              >
                <View style={estilos.botonCierre}>
                  <MaterialIcons name="close" size={24} color="white" />
                </View>
              </Pressable>
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                padding: 10,
              }}
            >
              <MaterialIcons
                name="check-circle-outline"
                size={60}
                color="#4caf50"
                style={estilos.iconoWarning}
              />
              <Text style={{ textAlign: "center" }}>{mensajeExito}</Text>
            </View>
          </View>
        </View>
      </Modal>
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
  botonPresionado: {
    backgroundColor: "#0056b3",

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
  modal: {
    justifyContent: "center",
    alignItems: "center",
    width: 300,
    height: 200,
    backgroundColor: "white",
    borderRadius: 10,
    borderColor: "black",
    borderWidth: 1,
    position: "relative",
    backgroundColor: "#f9f7f7",
  },
  iconoWarning: { paddingBottom: 10 },
  botonCierre: {
    padding: 3,
    margin: 5,
    borderRadius: 30,
    backgroundColor: "#ea0505",
  },
});
