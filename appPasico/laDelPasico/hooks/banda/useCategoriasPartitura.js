import { useEffect, useState } from "react";
import ServiceCategoriaPartituras from "../../servicios/serviceCategoriaPartitura";

export const useCategoriasPartitura = (cerrarSesion) => {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [refrescar, setRefrescar] = useState(false);

  function lanzarRefresco() {
    setRefrescar(true);
  }

  useEffect(() => {
    ServiceCategoriaPartituras.obtenerCategoriasPartitura(cerrarSesion)
      .then((respuesta) => {
        if (respuesta.error) {
          console.log("Error al obtener las categorías:", respuesta.error);
        } else {
          const categorias = respuesta.categorias.map((categoria) => ({
            etiqueta: categoria.nombre_categoria,
            valor: categoria.nid_categoria,
          }));

          setCategorias(categorias);
          setCargando(false);
          setError(false);
          setRefrescar(false);
        }
      })
      .catch((error) => {
        console.log("Error al obtener las categorías:", error);
        setError(true);
        setCategorias([]);
        setCargando(false);
        setRefrescar(false);
      });
  }, [refrescar]);

  return {
    categorias,
    cargando,
    error,
    lanzarRefresco,
  };
};
