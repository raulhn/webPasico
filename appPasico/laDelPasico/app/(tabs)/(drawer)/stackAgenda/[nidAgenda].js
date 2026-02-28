import { useLocalSearchParams } from "expo-router";
import DetalleEvento from "../../../../componentes/componentesAgenda/DetalleEvento";
export default function PantallDetalleEvento({ evento }) {
  const { evento } = useLocalSearchParams();

  return <DetalleEvento evento={evento} />;
}
