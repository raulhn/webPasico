import { Link } from "expo-router";
import React from "react";
import {
  TextInput,
  Pressable,
  View,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Login() {
  const [inputActivo, setInputActivo] = React.useState(0);

  const [correo, setCorreo] = React.useState("");
  const [contrasena, setContrasena] = React.useState("");

  const logo = require("../../assets/logo.png");
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
          <TextInput
            placeholder="Correo Electrónico"
            onChangeText={(text) => setCorreo(text)}
            style={
              inputActivo === 1
                ? [estilos.inputFocus, { width: 300 }]
                : [estilos.input, { width: 300 }]
            }
            onFocus={() => setInputActivo(1)}
            onBlur={() => setInputActivo(0)}
          />
          <Text>Contraseña</Text>
          <TextInput
            id="contrasena"
            placeholder="Contraseña"
            style={
              inputActivo === 2
                ? [estilos.inputFocus, { width: 200 }]
                : [estilos.input, { width: 200 }]
            }
            secureTextEntry
            onChangeText={(text) => setContrasena(text)}
            onFocus={() => setInputActivo(2)}
            onBlur={() => setInputActivo(0)}
          />

          <Pressable onPress={() => {}} title="Iniciar Sesión">
            <View style={estilos.boton}>
              <Text
                style={{
                  color: "#fff",
                  textAlign: "center",
                }}
              >
                Iniciar
              </Text>
            </View>
          </Pressable>
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
      </View>
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
