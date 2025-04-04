import { useLocalSearchParams } from "expo-router";
import Pagina from "../../../componentes/Pagina";

export default function PaginaInicio() {
  const { nidPagina } = useLocalSearchParams();
  return <Pagina nidPagina={nidPagina} />;
}
