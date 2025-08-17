import { useContext, useEffect } from "react";
import Main from "../../../componentes/Main";
import Recaptcha from "../../../componentes/Recaptcha";
import useNotification from "../../../hooks/useNotification";
import { registrarConexion } from "../../../servicios/serviceConexion";
import { View } from "react-native";
import { useState } from "react";

import Tunstile from "../../../componentes/Turnstile";
import { AuthContext } from "../../../providers/AuthContext.js";
import ConstantesGoogle from "../../../config/constantesGoogle.js";

import { router } from "expo-router";

import * as Notifications from "expo-notifications";

export default function Index() {
  const expoPushToken = useNotification();
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const { guardarTokenNotificacion } = useContext(AuthContext);

  useEffect(() => {
    console.log("Iniciando listener de notificaciones");
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log("Notification received:", notification);
        console.log("Notification data:", notification.request.content.data);
      }
    );

    // 1. Solo usar getLastNotificationResponseAsync al montar, y solo si la app NO está en foreground
    Notifications.getLastNotificationResponseAsync().then((notificacion) => {
      if (notificacion) {
        if (notificacion.notification.request.content.data) {
          router.push(notificacion.notification.request.content.data);
        }
      }
    });

    // 2. Usar el listener para cuando la app está abierta o background
    const responseNotification =
      Notifications.addNotificationResponseReceivedListener((notificacion) => {
        if (notificacion.notification.request.content.data) {
          router.push(notificacion.notification.request.content.data);
        }
      });
    return () => {
      subscription.remove();
      responseNotification.remove();
    };
  }, []);

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
    console.log("Recaptcha token recibido:", event.nativeEvent.data);
    const token = event.nativeEvent.data;

    setRecaptchaToken(token); // Guarda el token en el estado
  };

  console.log(
    "Google API Key:",
    !process.env.GOOGLE_API_KEY
      ? ConstantesGoogle.key
      : process.env.GOOGLE_API_KEY
  );
  return (
    <View style={{ flex: 1 }}>
      <Main />

      <View style={{ display: "none" }}>
        <Tunstile
          siteKey={
            !process.env.GOOGLE_API_KEY
              ? ConstantesGoogle.key
              : process.env.GOOGLE_API_KEY
          }
          onVerify={handleVerify}
        />
      </View>
    </View>
  );
}
