import { useEffect } from "react";
import Main from "../../../componentes/Main";
import Recaptcha from "../../../componentes/Recaptcha";
import constantesGoogle from "../../../config/constantesGoogle.js";
import useNotification from "../../../hooks/useNotification";
import { registrarConexion } from "../../../servicios/serviceConexion";
import { View } from "react-native";
import { useState } from "react";
import { Stack } from "expo-router";

export default function Index() {
  const expoPushToken = useNotification();
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  useEffect(() => {
    if (expoPushToken && recaptchaToken) {
      console.log(expoPushToken, recaptchaToken);
      registrarConexion(expoPushToken, recaptchaToken)
        .then((response) => {})
        .catch((error) => {});

      // Limpia el token de reCAPTCHA después de procesarlo
      setRecaptchaToken(null);
    }
  }, [expoPushToken, recaptchaToken]);

  // Envía el token al servidor backend
  const handleVerify = (tokenGoogle) => {
    setRecaptchaToken(tokenGoogle);
  };

  return (
    <View style={{ flex: 1 }}>
      <Main />
      <Recaptcha siteKey={constantesGoogle.key} onVerify={handleVerify} />
    </View>
  );
}
