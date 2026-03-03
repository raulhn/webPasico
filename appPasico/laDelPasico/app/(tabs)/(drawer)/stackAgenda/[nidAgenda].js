import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";
import DetalleEvento from "../../../../componentes/componentesGeneral/agenda/DetalleEvento";
import { useContext } from "react";
import { AuthContext } from "../../../../providers/AuthContext";

export default function PantallDetalleEvento() {
  const { cerrarSesion } = useContext(AuthContext);
  const { nidAgenda, tipo } = useLocalSearchParams();

  return (
    <View>
      <DetalleEvento
        nid_evento={nidAgenda}
        tipo={tipo}
        cerrar_sesion={cerrarSesion}
      />
    </View>
  );
}
