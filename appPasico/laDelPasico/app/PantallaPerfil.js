import PerfilUsuario from "../componentes/usuario/PerfilUsuario";
import { View } from "react-native";

export default function PantallaPerfil() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <PerfilUsuario />
    </View>
  );
}
