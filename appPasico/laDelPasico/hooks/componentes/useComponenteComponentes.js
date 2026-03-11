import { useEffect, useState } from "react";
import ServicioComponentes from "../../servicios/serviceComponentes";

export const useComponenteComponentes = (nidComponente) => {
  const [componentes, setComponentes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    ServicioComponentes.recuperarComponenteComponentes(nidComponente)
      .then((data) => {
        setComponentes(data.componentes);
        setCargando(false);
      })
      .catch((error) => {
        setError(true);
        setCargando(false);
      });
  }, [nidComponente]);

  return { componentes, cargando, error };
};
