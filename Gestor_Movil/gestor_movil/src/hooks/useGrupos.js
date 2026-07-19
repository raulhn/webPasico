import * as ServiceGrupos from "../services/serviceGrupos.js";
import { useState, useEffect } from "react";

export const useGrupos = () => {
  const [grupos, setGrupos] = useState([]);
  const [error, setError] = useState(false);
  const [refrescar, setRefrescar] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGrupos = async () => {
      try {
        const response = await ServiceGrupos.obtenerGrupos();
        setLoading(false);
        setGrupos(response.grupos);
      } catch (error) {
        setError(true);
        console.error("Error al obtener grupos:", error);
      }
    };

    fetchGrupos();
  }, []);

  function lanzarRefresco() {
    setLoading(true);
    setRefrescar(!refrescar);
  }

  async function crearGrupo(nombre, nid_asigntura) {
    try {
      await ServiceGrupos.crearGrupo(nombre, nid_asigntura);
    } catch (error) {
      console.log("Se ha producido un error al añadir el grupo", error);
      throw new Error("Se ha producido un error al añadir el grupo");
    }
  }

  return { grupos, error, crearGrupo, loading, lanzarRefresco };
};
