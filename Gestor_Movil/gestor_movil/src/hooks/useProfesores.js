import * as ServiceProfesores from "../services/ServiceProfesores";
import { useState, useEffect } from "react";

export const useProfesoresAsignatura = (nidAsignatura, cerrarSesion) => {
  const [profesores, setProfesores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [refrescar, setRefrescar] = useState(false);

  async function fetchProfesoresAsignatura() {
    try {
      const data = await ServiceProfesores.obtenerProfesoresAsignatura(
        nidAsignatura,
        cerrarSesion,
      );
      setProfesores(data);
      setRefrescar(false);
      setError(false);
    } catch (error) {
      setError(error);
      setRefrescar(false);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    fetchProfesoresAsignatura();
  }, [refrescar]);

  function lanzarRefresco() {
    setCargando(true);
    setRefrescar(true);
  }

  return { profesores, cargando, error, lanzarRefresco };
};

export const useProfesores = (cerrarSesion) => {
  const [profesores, setProfesores] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(false);
  const [refrescar, setRefrescar] = useState(false);

  async function fetchProfesores() {
    try {
      const data = await ServiceProfesores.obtenerProfesores(cerrarSesion);
      setProfesores(data);
      setRefrescar(false);
      setError(false);
    } catch (error) {
      setError(error);
      setRefrescar(false);
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    fetchProfesores();
  }, [refrescar]);

  function lanzarRefresco() {
    setCargando(true);
    setRefrescar(true);
  }

  return { profesores, cargando, error, lanzarRefresco };
};
