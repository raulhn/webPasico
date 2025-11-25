import { SafeAreaView } from "react-native-safe-area-context";

import {
  View,
  Text,
  Image,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { useContext, useState } from "react";
import { StyleSheet } from "react-native";
import { AuthContext } from "../../providers/AuthContext";
import serviceUsuario from "../../servicios/serviceUsuario";
import Constantes from "../../config/constantes.js";

import {
  ModalAviso,
  ModalExito,
  EntradaTexto,
  Boton,
} from "../componentesUI/ComponentesUI";

export default function CambiarPassword() {
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [contrasenaActual, setContrasenaActual] = useState("");

  const logo = require("../../assets/logo.png");

  const { cerrarSesion } = useContext(AuthContext);

  const [error, setError] = useState(null);
  const [exito, setExito] = useState(null);

  const peticionCambiarContraseña = () => {
    if (nuevaContrasena !== confirmarContrasena) {
      setError("Las contraseñas no coinciden");
      return;
    }

    serviceUsuario
      .cambiarPassword(contrasenaActual, nuevaContrasena, cerrarSesion)
      .then((response) => {
        if (response.error) {
          console.log("Error al cambiar la contraseña:", response.mensaje);
          setError(response.mensaje);
        } else {
          setExito("Contraseña cambiada con éxito");
        }
      })
      .catch((error) => {
        console.log("Error al cambiar la contraseña:", error);
      });
  };

  return (
    <SafeAreaView>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          padding: 10,
        }}
      >
        <KeyboardAvoidingView
          sytle={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0} // Ajusta según tu header
        >
          <ScrollView
            contentContainerStyle={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <View style={{ justifyContent: "center", alignItems: "center" }}>
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
              <Boton
                nombre="Actualizar"
                onPress={peticionCambiarContraseña}
                color={Constantes.COLOR_AZUL}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
      <ModalAviso
        visible={error !== null}
        setVisible={() => setError(null)}
        mensaje={error}
        textBoton="Aceptar"
      />
      <ModalExito
        visible={exito !== null}
        setVisible={() => setExito(null)}
        mensaje={exito}
        textBoton="Aceptar"
      />
    </SafeAreaView>
  );
}

const estilos = StyleSheet.create({
  logo: {
    height: 100,
    width: 100,
  },
});
