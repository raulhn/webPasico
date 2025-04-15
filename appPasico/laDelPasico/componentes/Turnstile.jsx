import React from "react";
import { View } from "react-native";
import { WebView } from "react-native-webview";

// https://dev.to/ryabinin/protect-your-react-native-application-using-cloudflare-turnstile-4l4l
const Turnstile = ({ siteKey, onVerify }) => {
  return (
    <View style={{ flex: 1 }}>
      <WebView
        originWhitelist={["*"]}
        onMessage={onVerify}
        source={{
          baseUrl: "https://ladelpasico.es",
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <script src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=_turnstileCb" async defer></script>
              </head>
              <body>
                <div id="myWidget"></div>
                <script>
                  // Esta función se llama cuando el script de Turnstile está listo
                  function _turnstileCb() {
                    turnstile.render('#myWidget', {
                      sitekey: '${siteKey}', // Inserta la clave correctamente
                      callback: (token) => {
                        // Envía el token al WebView
                        window.ReactNativeWebView.postMessage(token);
                      },
                    });
                  }
                </script>
              </body>
            </html>
          `,
        }}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        style={{ flex: 1 }}
      />
    </View>
  );
};

export default Turnstile;
