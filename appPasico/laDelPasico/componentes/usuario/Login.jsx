import { Link, useRouter } from "expo-router";
import React from "react";
import serviceUsuario from "../../servicios/serviceUsuario";
import { useContext } from "react";
import Boton from "../componentesUI/Boton";
import EntradaTexto from "../componentesUI/EntradaTexto";
import {
  TextInput,
  Pressable,
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
} from "react-native";
import { AuthContext } from "../../providers/AuthContext";
import ModalAviso from "../componentesUI/ModalAviso";

export default function Login() {
  const { iniciarSesion, tokenNotificacion } = useContext(AuthContext);

  const [correo, setCorreo] = React.useState("");
  const [contrasena, setContrasena] = React.useState("");

  const logo = require("../../assets/logo.png");
  const router = useRouter();
  const [error, setError] = React.useState(null);

  function realizarLogin() {
    {
      serviceUsuario
        .login(correo, contrasena, tokenNotificacion)
        .then((response) => {
          if (response.error) {
            setError("Error en el inicio de sesión"); // Muestra el error en el modal
          } else {
            iniciarSesion(response.usuario); // Guarda el usuario en el contexto
            router.replace("/(tabs)/(drawer)");
          }
        })
        .catch((error) => {
          console.error("Error al iniciar sesión:", error);
        });
    }
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
