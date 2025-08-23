import Registro from "../componentes/usuario/Registro";
import React from "react";
import { View } from "react-native";
import Recaptcha from "../componentes/Recaptcha";
import { useState } from "react";

import { GOOGLE_API_KEI } from '@env';



export default function PantallaRegistro() {
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const handleVerify = (tokenGoogle) => {
    setRecaptchaToken(tokenGoogle);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View style={{ display: "none" }}>
        <Recaptcha
          siteKey={GOOGLE_API_KEI}
          onVerify={handleVerify}
        />
      </View>
      <Registro recaptchaToken={recaptchaToken} />
    </View>
  );
}
