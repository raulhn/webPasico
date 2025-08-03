import ServiceTablonAnuncios from "../servicios/serviceTablon";
import { useState, useEffect } from "react";

export const useTablonAnuncios = () => {
  const [anuncios, setAnuncios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [refrescar, setRefrescar] = useState(false);

  function lanzarRefresco() {
    setRefrescar(true);
  }

  useEffect(() => {
    ServiceTablonAnuncios.obtenerAnuncios()
      .then((data) => {
        setAnuncios(data.tablones_anuncios);
        setError(null);
        setRefrescar(false);
        setCargando(false);
      })
      .catch((error) => {
        console.error("Error al obtener anuncios:", error);
        setError(error);
        setRefrescar(false);
        setCargando(false);
      });
  }, [refrescar]);

  return { anuncios, cargando, refrescar, error, lanzarRefresco };
};

export const useTablonAnuncio = (nidAnuncio) => {
  const [anuncio, setAnuncio] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [refrescar, setRefrescar] = useState(false);

  function lanzarRefresco() {
    setCargando(true);
    setError(null);
    setRefrescar(true);
  }

  useEffect(() => {
    if (nidAnuncio) {
      ServiceTablonAnuncios.obtenerAnuncio(nidAnuncio)
        .then((data) => {
          setAnuncio(data.tablones_anuncios);
          setError(null);
          setCargando(false);
          setRefrescar(false);
        })
        .catch((error) => {
          console.error("Error al obtener el anuncio:", error);
          setError(error);
          setCargando(false);
          setRefrescar(false);
        });
    }
  }, [nidAnuncio]);

  return { anuncio, cargando, error, refrescar, lanzarRefresco };
};
