import { useLocalSearchParams } from "expo-router";
import { View, Text, StyleSheet } from "react-native";

export default function EventoConcierto() {
      const { nidEvento } = useLocalSearchParams();

      return (
       <View style={estilos}><Text>{nidEvento}</Text></View>
      );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#fff",
    alignItems: "center",
  },})