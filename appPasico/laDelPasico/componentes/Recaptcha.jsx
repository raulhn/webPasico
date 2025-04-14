import React, { useRef } from "react";
import { StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";

export default function Recapcha({ siteKey, onVerify }) {
  const webviewRef = useRef();

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
        <script>
          function onTurnstileSuccess(token) {
            // Envía el token a la aplicación React Native
            window.ReactNativeWebView.postMessage(token);
          }
        </script>
      </head>
      <body>
        <div
          class="cf-turnstile"
          data-sitekey="${siteKey}"
          data-callback="onTurnstileSuccess"
        ></div>
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
          console.log("Evento " + event.nativeEvent);
          const token = event.nativeEvent.data;
          console.log("Token de reCAPTCHA:", token);
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
