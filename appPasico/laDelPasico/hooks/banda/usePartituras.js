import {useEffect, useState} from "react";
import ServicePartituras from "../../servicios/servicePartituras";

export const usePartituras = (cerrarSesion) => {
  const [partituras, setPartituras] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [refrescar, setRefrescar] = useState(false);
  const { cerrarSesion } = useContext(AuthContext);

    function lanzarRefresco()
    {
        setRefrescar(true);
    }

  useEffect(() => {
    ServicePartituras.obtenerPartituras(cerrarSesion)
      .then((response) => {
        setPartituras(response.partituras);
        setCargando(false);
        setRefrescar(false);
      })
      .catch((error) => {
        setError(true);
        setCargando(false);
        setRefrescar(false);
      });
  }, [refrescar]);

  return {
    partituras,
    cargando,
    error,
    lanzarRefresco
  };
};

export const usePartiturasEvento = (nid_evento)