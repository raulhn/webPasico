import Registro from "../componentes/usuario/Registro";
import React from "react";
import { View } from "react-native";
import Recaptcha from "../componentes/Recaptcha";
import ConstantesGoogle from "../config/constantesGoogle.js";
import { useState } from "react";

export default function PantallaRegistro() {
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const handleVerify = (tokenGoogle) => {
    setRecaptchaToken(tokenGoogle);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View style={{ display: "none" }}>
        <Recaptcha siteKey={ConstantesGoogle.key} onVerify={handleVerify} />
      </View>
      <Registro recaptchaToken={recaptchaToken} />
    </View>
  );
}
