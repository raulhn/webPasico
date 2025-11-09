import * as serviceAsignaturas from "../services/ServiceAsignaturas.js";
import { useState, useEffect } from "react";

export const useAsignaturas = () => {
  const [asignaturas, setAsignaturas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [refrescar, setRefrescar] = useState(false);

  async function fetchAsignaturas() {
    try {
      console.log("Petición obtener asignaturas")
      const data = await serviceAsignaturas.obtenerAsignaturas();
      console.log('Retorno ', data)
      setAsignaturas(data.asignaturas);
      setRefrescar(false);
    } catch (error) {
      setError(error);
      setRefrescar(false);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    fetchAsignaturas();
  }, [refrescar]);

  function lanzarRefresco() {
    setCargando(true);
    setRefrescar(true);
  }

  return { asignaturas, cargando, error, lanzarRefresco };
};


export const useAsignaturasProfesor = (cerrarSesion) =>
{
  const [asignaturas, setAsignaturas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [refrescar, setRefrescar] = useState(true);

  async function fetchAsignaturasProfesor() {
    try {
      const data = await serviceAsignaturas.obtenerAsignaturasProfesor(cerrarSesion);
      setAsignaturas(data);
      setRefrescar(false);
      setCargando(false);
    } catch (error) {
      setError(error);
      setRefrescar(false);
      setCargando(false);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    if(refrescar) {
      fetchAsignaturasProfesor();
    }
  }, [refrescar]);

  function lanzarRefresco() {
    setCargando(true);
    setRefrescar(true);
  }

  return { asignaturas, cargando, error, lanzarRefresco };
};



  
