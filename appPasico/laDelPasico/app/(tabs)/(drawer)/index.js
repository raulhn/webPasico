import { useEffect } from "react";
import Main from "../../../componentes/Main";
import Recaptcha from "../../../componentes/Recaptcha";
import constantesGoogle from "../../../config/constantesGoogle.js";
import useNotification from "../../../hooks/useNotification";
import { registrarConexion } from "../../../servicios/serviceConexion";
import { View } from "react-native";
import { useState } from "react";

import Tunstile from "../../../componentes/Turnstile";

export default function Index() {
  const expoPushToken = useNotification();
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  useEffect(() => {
    if (expoPushToken && recaptchaToken) {
      console.log(expoPushToken, recaptchaToken);
      registrarConexion(expoPushToken, recaptchaToken)
        .then((response) => {})
        .catch((error) => {});
      setRecaptchaToken(null);
    }
  }, [expoPushToken, recaptchaToken]);

  // Envía el token al servidor backend
  const handleVerify = (event) => {
    const token = event.nativeEvent.data;
    console.log("Token de reCAPTCHA:", token);
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
