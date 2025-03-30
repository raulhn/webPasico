import React from "react";
import {
  ViewPropTypes,
  StyleSheet,
  View,
  StyledText,
  Text,
} from "react-native";

export default function AppBar() {
  return (
    <View style={estilos.container}>
      <Text>aa</Text>
      <Text>bb</Text>
      <Text>cc</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    display: "flex",
    backgroundColor: "gray",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    padding: 10,
  },
});
