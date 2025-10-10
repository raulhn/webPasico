import * as ServiceCategorias from '../services/ServiceCategorias.js';

import { useState, useEffect } from 'react';

export const useCategorias = () => {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchCategorias() {
      try {
        const data = await ServiceCategorias.obtenerCategorias();
        setCategorias(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCategorias();
  }, []);

    return { categorias, loading, error };
}