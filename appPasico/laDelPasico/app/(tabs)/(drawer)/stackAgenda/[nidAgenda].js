import { useLocalSearchParams } from "expo-router";
import DetalleEvento from "../../../../componentes/componentesGeneral/agenda/DetalleEvento";
export default function PantallDetalleEvento() {
  const { evento } = useLocalSearchParams();

  return <DetalleEvento evento={evento} />;
}
