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