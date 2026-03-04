import { useLocalSearchParams } from "expo-router";
import DetalleEventoConcierto from "../../../../../componentes/componentesBanda/DetalleEventoConcierto";

export default function EventoConcierto() {
  const { nidEvento } = useLocalSearchParams();
  return <DetalleEventoConcierto nidEvento={nidEvento} />;
}
