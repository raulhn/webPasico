import serviceAsignaturas from "../../servicios/serviceAsignaturas.js";
import { useState, useEffect } from "react";

export const useAsignaturas = () => {
  const [asignaturas, setAsignaturas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [refrescar, setRefrescar] = useState(false);

  async function fetchAsignaturas() {
    try {
      const data = await serviceAsignaturas.obtenerAsignaturas();

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

  function obtenerAsignatura(nid_asignatura) {
    const asignatura = asignaturas.find(
      (a) => a.nid_asignatura === nid_asignatura
    );

    return asignatura ? asignatura.descripcion : null;
  }
  return { asignaturas, cargando, error, lanzarRefresco, obtenerAsignatura };
};

export const useAsignaturasProfesor = (cerrarSesion) => {
  const [asignaturas, setAsignaturas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [refrescar, setRefrescar] = useState(false);

  async function fetchAsignaturasProfesor() {
    try {
      const data = await serviceAsignaturas.obtenerAsignaturasProfesor(
        cerrarSesion
      );
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
    fetchAsignaturasProfesor();
  }, [refrescar]);

  function lanzarRefresco() {
    setCargando(true);
    setRefrescar(true);
  }

  return { asignaturas, cargando, error, lanzarRefresco };
};

