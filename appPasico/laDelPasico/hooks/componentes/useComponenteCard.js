import ServicioComponente from "../../servicios/serviceComponentes";
import { useEffect, useState } from "react";

export const useComponenteCard = (nid_componente) => {
  const [componenteCard, setComponenteCard] = useState({});
  const [cargado, setCargado] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (nid_componente) {
      ServicioComponente.recuperarComponenteCard(nid_componente)
        .then((data) => {
          setComponenteCard(data);
          setCargado(true);
        })
        .catch((error) => {
          setError(error);
          setCargado(true); // Considera la carga como completa incluso si hay un error
        });
    }
  }, [nid_componente]);

  return { componenteCard, cargado, error };
};
