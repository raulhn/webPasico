import { useState, useEffect } from "react";
import { Platform } from "react-native";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

import { registrarConexion } from "../servicios/serviceConexion";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

const useNotification = () => {
  const [expoPushToken, setExpoPushToken] = useState("");

  function handleRegistrationError(errorMessage) {
    alert(errorMessage);
    throw new Error(errorMessage);
  }

  async function registerForPushNotificationsAsync() {
    //Configura el canal de notificaciones para Android
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }

    //Pide los permisos para recibir notificaciones push
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      let mensaje =
        "Permiso no concedido para obtener el token de push para la notificación push!";
      if (finalStatus !== "granted") {
        handleRegistrationError(mensaje);
        return;
      }

      //Recupera eel projetID y el push token
      const projectId =
        Constants?.expoConfig?.extra?.eas?.projectId ??
        Constants?.easConfig?.projectId;
      if (!projectId) {
        handleRegistrationError("Project ID not found");
      }
      try {
        const pushTokenString = (
          await Notifications.getExpoPushTokenAsync({
            projectId,
          })
        ).data;
        console.log(pushTokenString);
        registrarConexion(pushTokenString)
          .then((response) => {
            console.log("Token registrado correctamente");
          })
          .catch((error) => {
            console.error("Error al registrar el token:", error);
          });
        return pushTokenString;
      } catch (e) {
        handleRegistrationError(`${e}`);
      }
    } else {
      let mensajeDispositivo =
        "¡Debe usar un dispositivo físico para recibir notificaciones push!";
      handleRegistrationError(mensajeDispositivo);
    }
  }

  useEffect(() => {
    registerForPushNotificationsAsync()
      .then((token) => setExpoPushToken(token ?? ""))
      .catch((error) => setExpoPushToken(`${error}`));
  });

  return expoPushToken;
};

export default useNotification;
