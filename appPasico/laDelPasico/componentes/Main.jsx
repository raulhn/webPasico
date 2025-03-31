import { StatusBar } from "expo-status-bar";

import { Noticias } from "./Noticias";
import { Image } from "react-native";
import { StyleSheet, View, Text } from "react-native";
import { MenuPasico } from "./MenuPasico"; // Adjust the path if necessary
import { Link } from "expo-router";
import AppBar from "./appBar.jsx";

const logo = require("../assets/logo.png");

export default function Main() {
  return (
    <View style={{ flex: 1, backgroundColor: "white" }}>
      <View style={styles.principal}>
        <Noticias style={styles.noticias} />
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: "center",
    marginVertical: 5,
  },
  logo: {
    width: "80%",
    height: 70,
  },
  noticias: {
    flex: 1,
    paddingHorizontal: 10,
  },
  principal: {
    backgroundColor: "white",

    flex: 1,
  },
  titulo: {
    fontSize: 30,
    fontWeight: "bold",
    marginVertical: 10,
    alignContent: "center",
    textAlign: "center",
  },
});
