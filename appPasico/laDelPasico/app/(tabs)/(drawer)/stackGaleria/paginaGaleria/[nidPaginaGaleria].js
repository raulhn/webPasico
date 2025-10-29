import { useLocalSearchParams } from "expo-router";
import Pagina from "../../../../../componentes/Pagina";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PaginaInicio() {
  const { nidPagina } = useLocalSearchParams();

  return <Pagina nidPagina={nidPagina} />;
}
