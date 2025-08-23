import Registro from "../componentes/usuario/Registro";
import React from "react";
import { View } from "react-native";
import Recaptcha from "../componentes/Recaptcha";
import { useState } from "react";
import Constants from 'expo-constants';

const KEY_GOOGLE = Constants.expoConfig.extra.GOOGLE;

export default function PantallaRegistro() {
  const [recaptchaToken, setRecaptchaToken] = useState(null);

  const handleVerify = (tokenGoogle) => {
    setRecaptchaToken(tokenGoogle);
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <View style={{ display: "none" }}>
        <Recaptcha
          siteKey={KEY_GOOGLE.apiKey}
          onVerify={handleVerify}
        />
      </View>
      <Registro recaptchaToken={recaptchaToken} />
    </View>
  );
}
