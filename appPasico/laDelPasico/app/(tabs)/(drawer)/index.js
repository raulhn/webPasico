import { useContext, useEffect } from "react";
import Main from "../../../componentes/Main";
import Recaptcha from "../../../componentes/Recaptcha";
import constantesGoogle from "../../../config/constantesGoogle.js";
import useNotification from "../../../hooks/useNotification";
import { registrarConexion } from "../../../servicios/serviceConexion";
import { View } from "react-native";
import { useState } from "react";

import Tunstile from "../../../componentes/Turnstile";
import { AuthContext } from "../../../providers/AuthContext.js";

export default function Index() {
  const expoPushToken = useNotification();
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const { guardarTokenNotificacion } = useContext(AuthContext);

  useEffect(() => {
    if (expoPushToken && recaptchaToken) {
      guardarTokenNotificacion(expoPushToken); // Guarda el token de notificación en el contexto
      registrarConexion(expoPushToken, recaptchaToken)
        .then((response) => {})
        .catch((error) => {});
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
        <Tunstile siteKey={constantesGoogle.key} onVerify={handleVerify} />
      </View>
    </View>
  );
}
