import { useState, useEffect } from "react";
import * as ServiceCursos from "../services/ServiceCursos";

export const useCursos = () => {
  const [cursos, setCursos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCursos = async () => {
      try {
        const data = await ServiceCursos.obtenerCursos();
        setCursos(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCursos();
  }, []);

  function obtener_curso_seleccionado() {
    return cursos.find((curso) => curso.activo === "S");
  }
  return { cursos, loading, error, obtener_curso_seleccionado };
};
