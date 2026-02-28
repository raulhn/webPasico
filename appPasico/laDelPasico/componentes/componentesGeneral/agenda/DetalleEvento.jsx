import { View, Text } from "react-native";

export default function DetalleEvento({ evento }) {
  return (
    <View>
      <Text>{evento.nombre}</Text>
      <Text>{evento.descripcion}</Text>
      <Text>{evento.fecha}</Text>
      <Text>{evento.hora}</Text>
    </View>
  );
}
