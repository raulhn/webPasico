import { View, Text, StyleSheet } from "react-native";

export function MenuFoot() {
  return (
    <View className="bg-blue-500" style={estilos.container}>
      <Text className="text-white">Acerca de nosotros</Text>
      <Text className="text-white">Contáctanos</Text>
      <Text className="text-white">Política de privacidad</Text>
      <Text className="text-white">Términos y condiciones</Text>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    alignItems: "center",
    width: "100%",
  },
});
