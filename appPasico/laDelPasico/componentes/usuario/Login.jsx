import { Link, useRouter } from "expo-router";
import React from "react";
import { useState } from "react";
import serviceUsuario from "../../servicios/serviceUsuario";
import { useContext } from "react";

import {
  TextInput,
  Pressable,
  View,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import { AuthContext } from "../../providers/AuthContext";

import {
  EntradaTexto,
  Boton,
  ModalAviso,
  BotonIcono,
  ModalConfirmacion,
  ModalExito,
} from "../componentesUI/ComponentesUI";

export default function Login() {
  const { iniciarSesion, tokenNotificacion, guardarRoles } =
    useContext(AuthContext);

  const [correo, setCorreo] = React.useState("");
  const [contrasena, setContrasena] = React.useState("");

  const logo = require("../../assets/logo.png");
  const router = useRouter();
  const [error, setError] = React.useState(null);
  const [confirmacion, setConfirmacion] = useState(false);
  const [exito, setExito] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");

  function realizarLogin() {
    {
      serviceUsuario
        .login(correo, contrasena, tokenNotificacion)
        .then((response) => {
          if (response.error) {
            console.log("Error al iniciar sesión:", response);
            if (response.codigo == 2) {
              setConfirmacion(true); // Muestra el modal de confirmación
            } else {
              setError(response.mensaje); // Muestra el error en el modal
            }
          } else {
            iniciarSesion(response.usuario); // Guarda el usuario en el contexto
            guardarRoles(response.roles); // Guarda los roles en el contexto
            router.replace("Inicio");
          }
        })
        .catch((error) => {
          console.log("Error al iniciar sesión:", error);
        });
    }
  }

  function reenviarCorreoVerificacion() {
    serviceUsuario
      .reenviarCorreoVerificacion(correo, contrasena)
      .then((response) => {
        if (response.error) {
          console.log("Error al reenviar correo de verificación:", response);
          setError(response.mensaje); // Muestra el error en el modal
        } else {
          setConfirmacion(false); // Cierra el modal de confirmación
          setExito(true); // Muestra el modal de éxito
          setMensajeExito("Correo de verificación reenviado exitosamente."); // Establece el mensaje de éxito
        }
      })
      .catch((error) => {
        console.log("Error al reenviar correo de verificación:", error);
        setError("Ocurrió un error al reenviar el correo de verificación."); // Muestra un mensaje de error genérico
      });
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View style={{ position: "absolute", top: 40, left: 20 }}>
        <BotonIcono
          nombre={"arrow-back"}
          onPress={() => router.navigate("/")}
          size={30}
        ></BotonIcono>
      </View>
      <View style={estilos.container}>
        <View style={{ paddingBottom: 30 }}>
          <Image source={logo} style={estilos.logo}></Image>
        </View>
        <Text style={{ fontSize: 20, fontWeight: "bold" }}>Iniciar Sesión</Text>
        <View
          style={[
            { paddingTop: 20, justifyContent: "center", alignItems: "center" },
          ]}
        >
          <Text>Correo Electrónico</Text>
          <EntradaTexto
            valor={correo}
            setValor={setCorreo}
            secureTextEntry={false}
            placeholder="Correo Electrónico"
            ancho="300"
          />

          <Text>Contraseña</Text>
          <EntradaTexto
            valor={contrasena}
            setValor={setContrasena}
            secureTextEntry={true}
            placeholder="Contraseña"
            ancho="200"
          />

          <Boton
            onPress={realizarLogin}
            nombre="Iniciar Sesión"
            color="#007BFF"
            colorTexto="#FFF"
          />
        </View>
        <View style={{ paddingTop: 20, color: "blue" }}>
          <Link href="/PantallaRegistro" asChild>
            <Pressable>
              <View style={{ flexDirection: "column", alignItems: "center" }}>
                <Text>¿No tienes cuenta? </Text>
                <Text style={{ color: "blue" }}>Registrate</Text>
              </View>
            </Pressable>
          </Link>
        </View>

        <View style={{ paddingTop: 20, color: "blue" }}>
          <Link href="/PantallaRecuperarPassword" asChild>
            <Pressable>
              <View style={{ flexDirection: "column", alignItems: "center" }}>
                <Text>¿Has olvidado tu contraseña? </Text>
                <Text style={{ color: "blue" }}>Recuperar Contraseña</Text>
              </View>
            </Pressable>
          </Link>
        </View>
      </View>
      <ModalAviso
        visible={error !== null}
        setVisible={() => setError(null)}
        mensaje={error}
        textBoton="Aceptar"
      />
      <ModalConfirmacion
        visible={confirmacion}
        setVisible={() => setConfirmacion(false)}
        mensaje="Usuario aún no verificado ¿Desea recibir de nuevo el correo de confirmación?"
        textBotonCancelar="No Enviar"
        textBoton="Enviar"
        accion={() => {
          reenviarCorreoVerificacion();
          setConfirmacion(false);
        }}
        accionCancelar={() => setConfirmacion(false)}
      />
      <ModalExito
        visible={exito}
        setVisible={() => setExito(false)}
        mensaje={mensajeExito}
        textBoton="Aceptar"
      />
    </View>
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
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: "#ccc",
  },
  inputFocus: {
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
    width: 100,
    height: 50,
    justifyContent: "center",
  },
  logo: {
    height: 100,
    width: 100,
  },
});
