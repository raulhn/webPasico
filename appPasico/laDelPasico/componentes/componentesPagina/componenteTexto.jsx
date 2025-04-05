import React, { useEffect, useState } from "react";
import serviceComponentes from "../../servicios/serviceComponentes.js";

import AutoHeightWebView from "../../autoHeightWebView/index.js";
import { Dimensions } from "react-native";
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

export default function ComponenteTexto({ nid_componente = null }) {
  const [componenteTexto, setComponenteTexto] = useState({});
  const [cargado, setCargado] = useState(false);

  const [webViewHeight, setWebViewHeight] = useState(0); // Estado para la altura del WebView

  useEffect(() => {
    if (nid_componente) {
      serviceComponentes
        .recuperarComponenteTexto(nid_componente)
        .then((data) => {
          setComponenteTexto(data);
          setCargado(true);
        })
        .catch((error) => {});
    }
  }, [nid_componente]);

  if (!cargado) {
    return null;
  }

  const htmlContent = `
      <html>
      <head>

        <style>
          body {
            font-size: 18px; /* Cambia el tamaño del texto */
            font-family: "Times New Roman", sans-serif;
            color: #333; /* Cambia el color del texto */
            background-color: white; /* Cambia el color de fondo */
            margin: 0;
            padding: 10px;
          }
        </style>
      </head>
      <body>
      ${componenteTexto.componente.cTexto}
         </body>
    </html>`;

  return (
    <View style={styles.container}>
      <AutoHeightWebView
        source={{ html: htmlContent }}
        style={styles.webView}
        customStyle={`
          body {
            font-size: 15px;
            font-family: "Times New Roman", sans-serif;
            color: #333;
            margin: 0;
            padding: 10px;
          }
        `}
        //   scalesPageToFit={true} // Configura explícitamente
        viewportContent={"width=device-width, user-scalable=no"} // Configura explícitamente
        onSizeUpdated={(size) => {}}
        files={undefined} // Sobrescribe la propiedad predeterminada
        customScript={""} // Sobrescribe la propiedad predeterminada
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "white",
  },
  webView: {
    width: Dimensions.get("window").width,
  },
});
/*
  return (
    <AutoHeightWebView
      style={{ width: Dimensions.get("window").width - 15, marginTop: 35 }}
      customScript={`document.body.style.background = 'lightyellow';`}
      customStyle={`
      * {
        font-family: 'Times New Roman';
      }
      p {
        font-size: 16px;
      }
    `}
      onSizeUpdated={(size) => console.log(size.height)}
      files={[
        {
          href: "cssfileaddress",
          type: "text/css",
          rel: "stylesheet",
        },
      ]}
      source={{
        html: `<p style="font-weight: 400;font-style: normal;font-size: 21px;line-height: 1.58;letter-spacing: -.003em;">Tags are great for describing the essence of your story in a single word or phrase, but stories are rarely about a single thing. <span style="background-color: transparent !important;background-image: linear-gradient(to bottom, rgba(146, 249, 190, 1), rgba(146, 249, 190, 1));">If I pen a story about moving across the country to start a new job in a car with my husband, two cats, a dog, and a tarantula, I wouldn’t only tag the piece with “moving”. I’d also use the tags “pets”, “marriage”, “career change”, and “travel tips”.</span></p>`,
      }}
      scalesPageToFit={true}
      viewportContent={"width=device-width, user-scalable=no"}
    />
  );
}*/
