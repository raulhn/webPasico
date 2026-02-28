import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";
import DetalleEvento from "../../../../componentes/componentesGeneral/agenda/DetalleEvento";
export default function PantallDetalleEvento() {
  const { nidAgenda } = useLocalSearchParams();

  return (
    <View>
      <Text>{nidAgenda}</Text>
    </View>
  );
}
