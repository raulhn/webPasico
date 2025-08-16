import ServiceTablonAnuncios from "../servicios/serviceTablon";
import { useState, useEffect } from "react";

export const useTablonAnuncios = (cerrarSesion, usuario) => {
  const [anuncios, setAnuncios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [refrescar, setRefrescar] = useState(false);

  function lanzarRefresco() {
    setRefrescar(true);
    setCargando(true);
  }

  useEffect(() => {
    ServiceTablonAnuncios.obtenerAnuncios(cerrarSesion, usuario)
      .then((data) => {
        setAnuncios(data.tablones_anuncios);
        setError(null);
        setRefrescar(false);
        setCargando(false);
      })
      .catch((error) => {
        console.log("Error al obtener anuncios:", error);
        setError(error);
        setRefrescar(false);
        setCargando(false);
      })
      .finally(() => {
        console.log("Finalizando carga de anuncios");
        setCargando(false);
        setRefrescar(false);
      });
  }, [refrescar]);

  return { anuncios, cargando, refrescar, error, lanzarRefresco };
};

export const useTablonAnuncio = (nidAnuncio, cerrarSesion) => {
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
      ServiceTablonAnuncios.obtenerAnuncio(nidAnuncio, cerrarSesion)
        .then((data) => {
          setAnuncio(data.tablones_anuncios);

          setError(null);
          setCargando(false);
          setRefrescar(false);
        })
        .catch((error) => {
          console.log("Error al obtener el anuncio:", error);
          setError(error);
          setCargando(false);
          setRefrescar(false);
        })
        .finally(() => {
          console.log("Finalizando carga del anuncio");
          setCargando(false);
          setRefrescar(false);
        });
    } else {
      setAnuncio(null);
      setCargando(false);
      setError(null);
    }
  }, [nidAnuncio, refrescar]);

  return { anuncio, cargando, error, refrescar, lanzarRefresco };
};
