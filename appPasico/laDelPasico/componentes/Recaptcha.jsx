import React, { useRef } from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

export default function Recapcha({ siteKey, onVerify }) {
  const webviewRef = useRef();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <script src="https://www.google.com/recaptcha/api.js?render=${siteKey}"></script>
        <script>
          function executeReCaptcha() {
            grecaptcha.ready(function() {
              grecaptcha.execute('${siteKey}', { action: 'submit' }).then(function(token) {
                // Envía el token a la aplicación React Native
                window.ReactNativeWebView.postMessage(token);
              });
            });
          }
        </script>
      </head>
      <body onload="executeReCaptcha()">
        <p>Generando token de reCAPTCHA...</p>
      </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <WebView
        ref={webviewRef}
        originWhitelist={["*"]}
        baseUrl="https://ladelpasico.es"
        source={{ html: htmlContent }}
        onMessage={(event) => {
          const token = event.nativeEvent.data;
          onVerify(token); // Envía el token al callback
        }}
        javaScriptEnabled={true}
        style={styles.webview}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  display: "none",
});
