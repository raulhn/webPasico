import React, { useEffect, useState } from "react";
import serviceComponentes from "../../servicios/serviceComponentes.js";
import { WebView } from "react-native-webview";

export default function ComponenteTexto(nidComponente) {
  const [componenteTexto, setComponenteTexto] = useState({});

  useEffect(() => {
    serviceComponentes
      .recuperarComponenteTexto(nidComponente)
      .then((data) => {
        setComponenteTexto(data);
      })
      .error((error) => {
        console.log("Error al recuperar componente texto: ", error);
      });
  }, [nidComponente]);

  return <WebView source={{ html: componenteTexto.cTexto }}></WebView>;
}
