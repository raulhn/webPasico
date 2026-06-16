import { obtenerInstrumentos } from "../../servicios/serviceInstrumentos";
import { useState, useEffect } from "react";

export const useInstrumentos = (cerrar_sesion) => {
  const [instrumentos, setInstrumentos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInstrumentos = async () => {
      try {
        const data = await obtenerInstrumentos(cerrar_sesion);
        setInstrumentos(data);
      } catch (err) {
        setError(err);
      } finally {
        setCargando(false);
      }
    };
    fetchInstrumentos();
  }, []);

  return { instrumentos, cargando, error };
};
