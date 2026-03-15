import { useContext, useEffect } from "react";
import Main from "../../../../componentes/Main";

import useNotification from "../../../../hooks/useNotification";
import { registrarConexion } from "../../../../servicios/serviceConexion";
import { View } from "react-native";
import { useState } from "react";

import Tunstile from "../../../../componentes/Turnstile";
import { AuthContext } from "../../../../providers/AuthContext.js";

import { router } from "expo-router";

import * as Notifications from "expo-notifications";
import { useNotificationObserver } from "../../../../hooks/useNotification";
import Constantes from "../../../../config/constantes.js";

export default function Inicio() {
  const expoPushToken = useNotification();
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const { guardarTokenNotificacion } = useContext(AuthContext);
  useNotificationObserver();
  useEffect(() => {
    if (expoPushToken && recaptchaToken) {
      guardarTokenNotificacion(expoPushToken); // Guarda el token de notificación en el contexto
      registrarConexion(expoPushToken, recaptchaToken)
        .then((response) => {
          console.log("Registro de conexión exitoso:", response);
        })
        .catch((error) => {
          console.log("Error al registrar conexión:", error);
        });
      setRecaptchaToken(null);
    }
  }, [expoPushToken, recaptchaToken]);

  // Envía el token al servidor backend
  const handleVerify = (event) => {
    const token = event.nativeEvent.data;

    setRecaptchaToken(token); // Guarda el token en el estado
  };

  return (
    <View style={{ flex: 1 }}>
      <Main />

      <View style={{ display: "none" }}>
        <Tunstile
          siteKey={Constantes.PUBLIC_KEY_TURNSTILE}
          onVerify={handleVerify}
        />
      </View>
    </View>
  );
}
