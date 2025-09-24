import Registro from "../componentes/usuario/Registro";
import { View } from "react-native";
import Recaptcha from "../componentes/Recaptcha";
import { useState } from "react";
import Constantes from "../config/constantes.js";
import React from "react";

export default function PantallaRegistro() {
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const handleVerify = (tokenGoogle) => {
    setRecaptchaToken(tokenGoogle);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View style={{ display: "none" }}>
        <Recaptcha
          siteKey={Constantes.PUBLIC_KEY_TURNSTILE}
          onVerify={handleVerify}
        />
      </View>
      <Registro recaptchaToken={recaptchaToken} />
    </View>
  );
}
