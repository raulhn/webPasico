import { useContext, useEffect } from "react";
import Main from "../../../../componentes/Main";

import useNotification from "../../../../hooks/useNotification";
import { registrarConexion } from "../../../../servicios/serviceConexion";
import { View } from "react-native";
import { useState } from "react";

import Tunstile from "../../../../componentes/Turnstile";
import { AuthContext } from "../../../../providers/AuthContext.js";
import * as Notifications from "expo-notifications";

import { useNotificationObserver } from "../../../../hooks/useNotification";
import Constantes from "../../../../config/constantes.js";
import { ModalAviso } from "../../../../componentes/componentesUI/ComponentesUI.jsx";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});
export default function Inicio() {
  console.log("Renderizando Inicio.jsx");
  const { expoPushToken } = useNotification();
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const { guardarTokenNotificacion } = useContext(AuthContext);
  const [error, setError] = useState(null);
  useEffect(() => {
    if (expoPushToken && recaptchaToken) {
      guardarTokenNotificacion(expoPushToken); // Guarda el token de notificación en el contexto
      registrarConexion(expoPushToken, recaptchaToken)
        .then((response) => {
          console.log("Registro de conexión exitoso:", response);
        })
        .catch((error) => {
          console.log("Error al registrar conexión:", error);
          setError(
            "Error al registrar conexión. Por favor, inténtalo de nuevo.",
            error,
          );
        });
      setRecaptchaToken(null);
    }
  }, [expoPushToken, recaptchaToken]);

  useNotificationObserver();

  // Envía el token al servidor backend
  const handleVerify = (event) => {
    const token = event.nativeEvent.data;
    setRecaptchaToken(token); // Guarda el token en el estado
  };

  return (
    <View style={{ flex: 1 }}>
      <Main />
      <View style={{ height: 1, opacity: 0.01 }}>
        <Tunstile
          siteKey={Constantes.PUBLIC_KEY_TURNSTILE}
          onVerify={handleVerify}
        />
      </View>
      <ModalAviso
        visible={!!error}
        setVisible={() => setError(null)}
        mensaje={error}
        textBoton={"Cerrar"}
      />
    </View>
  );
}
