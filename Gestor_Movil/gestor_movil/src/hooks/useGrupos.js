import * as ServiceGrupos from "../services/serviceGrupos.js";
import { useState, useEffect } from "react";

export const useGrupos = (nid_curso) => {
  const [grupos, setGrupos] = useState([]);
  const [error, setError] = useState(false);
  const [refrescar, setRefrescar] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrupos = async () => {
      if (!nid_curso) {
        setGrupos([]);
        setLoading(false);
        return;
      }

      try {
        const response = await ServiceGrupos.obtenerGrupos(nid_curso);
        setGrupos(response.grupos);
        setLoading(false);
      } catch (error) {
        setError(true);
        setLoading(false);
        console.error("Error al obtener grupos:", error);
      }
    };

    fetchGrupos();
  }, [refrescar, nid_curso]);

  function lanzarRefresco() {
    setLoading(true);
    setRefrescar((valorActual) => !valorActual);
  }

  async function crearGrupo(curso, nombre, nid_asigntura) {
    try {
      await ServiceGrupos.crearGrupo(curso, nombre, nid_asigntura);
    } catch (error) {
      console.log("Se ha producido un error al añadir el grupo", error);
      throw new Error("Se ha producido un error al añadir el grupo");
    }
  }

  return { grupos, error, crearGrupo, loading, lanzarRefresco };
};
