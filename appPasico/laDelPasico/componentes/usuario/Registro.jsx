import React from "react";

import { View, Text, ScrollView, TextInput, Image, Modal } from "react-native";

import { StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import ServiceUsuario from "../../servicios/serviceUsuario.js";
import Tunstile from "../../componentes/Turnstile.jsx";

import { ActivityIndicator } from "react-native";

import {
  ModalAviso,
  ModalExito,
  EntradaTexto,
  Boton,
} from "../componentesUI/ComponentesUI.jsx";

export default function registrarUsuario(recaptchaToken) {
  const [inputActivo, setInputActivo] = React.useState(0);
  const logo = require("../../assets/logo.png");

  const [errorValidacion, setErrorValidacion] = useState(false);
  const [exito, setExito] = useState(false);
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

    peticionRegistrarUsuario(token);
    setLanzaRegistro(false);
  }

  function incluyeRecaptcha() {
    if (lanzaRegistro) {
      return (
        <Tunstile
          siteKey={process.env.GOOGLE_API_KEY}
          onVerify={handleVerify}
        />
      );
    } else {
      return null;
    }
  }

  function peticionRegistrarUsuario(recaptchaToken) {
    try {
      setMensajeError("");

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
          })
          .catch((error) => {
            console.log("Error al registrar el usuario:", error);
          });
      } else {
        console.log("El token de reCAPTCHA no está disponible");

        console.log("Se ha producido un error durante el registro de usuario");
      }
    } catch (error) {
      console.log("Error en la petición:", error);
      setMensajeError(
        "Se ha producido un error durante el registro de usuario"
      );
    }
  }

  function lanzarRegistro() {
    if (!validacionRegistro()) {
      setErrorValidacion(true);
    } else {
      setLanzaRegistro(true);
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
              <EntradaTexto
                valor={nombre}
                setValor={setNombre}
                secureTextEntry={false}
                placeholder="Nombre"
                ancho="300"
              />

              <Text>Primer Apellido</Text>
              <EntradaTexto
                valor={primerApellido}
                setValor={setPrimerApellido}
                secureTextEntry={false}
                placeholder="Primer Apellido"
                ancho={"300"}
              />

              <Text>Segundo Apellido</Text>
              <EntradaTexto
                valor={segundoApellido}
                setValor={setSegundoApellido}
                secureTextEntry={false}
                placeholder={"Segundo Apellido"}
                ancho={"300"}
              />

              <Text>Correo Electrónico</Text>
              <EntradaTexto
                valor={correo}
                setValor={setCorreo}
                secureTextEntry={false}
                placeholder={"Correo Electrónico"}
                ancho={"300"}
              />

              <Text>Contraseña</Text>
              <EntradaTexto
                valor={password}
                setValor={setPassword}
                secureTextEntry={true}
                placeholder="Contraseña"
                ancho="200"
              />

              <Text>Repita la contraseña</Text>
              <EntradaTexto
                valor={password2}
                setValor={setPassword2}
                secureTextEntry={true}
                placeholder="Contraseña"
                ancho="200"
              />

              <Boton
                onPress={lanzarRegistro}
                nombre="Registrarse"
                colorTexto="#FFF"
                color="#007BFF"
              />
            </View>
            {incluyeRecaptcha()}
          </View>
        </View>
      </ScrollView>

      <ModalAviso
        visible={errorValidacion}
        setVisible={() => {
          setErrorValidacion(false);
        }}
        mensaje={mensajeError}
        textBoton="Aceptar"
      />
      <ModalExito
        visible={exito}
        callback={() => {
          setExito(false);
        }}
        mensaje={mensajeExito}
        textBoton="Aceptar"
      />

      {/* Modal de carga */}
      <Modal visible={lanzaRegistro} transparent={true} animationType="fade">
        <View style={estilos.modalCargando}>
          <View style={estilos.modalCargandoInterno}>
            <ActivityIndicator size="large" color="#007BFF" />
            <Text style={{ paddingTop: 10 }}>Cargando...</Text>
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
  modalCargando: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalCargandoInterno: {
    justifyContent: "center",
    alignItems: "center",
    width: 150,
    height: 150,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    borderColor: "black",
    borderWidth: 1,
    position: "relative",
    backgroundColor: "#f9f7f7",
  },
});
