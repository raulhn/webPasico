import * as ServicePartituras from '../services/ServicePartituras';

import { useState, useEffect } from 'react';

export const usePartituras = () => {
  const [partituras, setPartituras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPartituras() {
      try {
        const data = await ServicePartituras.obtenerPartituras();
        setPartituras(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPartituras();
  }, []);


  return { partituras, loading, error };
}


export const usePartitura = (nid_partitura) => {
  const [partitura, setPartitura] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPartitura() {
      try {
        if (!nid_partitura) {
          setPartitura(null);
          setLoading(false);
          return;
        }
        const data = await ServicePartituras.obtenerPartitura(nid_partitura);
        setPartitura(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchPartitura();
  }, [nid_partitura]);


  async function registrarPartitura(datosPartitura) {
    if (!datosPartitura.nid_partitura) {
      await ServicePartituras.registrarPartitura(datosPartitura);
    }
    else {
      await ServicePartituras.actualizarPartitura(datosPartitura);
    }
    // Refrescar la partitura después de registrar o actualizar
    const data = await ServicePartituras.obtenerPartitura(datosPartitura.nid_partitura);
    setPartitura(data);
  }
  return { partitura, loading, error, registrarPartitura };
}