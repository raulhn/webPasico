import * as ServiceTrimestre from "../services/ServiceTrimestre.js"
import {useState, useEffect} from "react"

export const useTrimestres = () =>
{
    const [trimestres, setTrimestres] = useState([]);
    const [cargando, setCargando] = useState(true);
    const [error, setError] = useState(null);
    const [refrescar, setRefrescar] = useState(false);

    function lanzarRefresco() {
        setRefrescar(!refrescar);
    }

    useEffect(() => {
        const fetchTrimestres = async () => {
            try {
                const response = await ServiceTrimestre.obtenerTrimestres();
                setTrimestres(response);
            } catch (error) {
                setError(error);
            } finally {
                setCargando(false);
            }
        };

        fetchTrimestres();
    }, []);

    return { trimestres, cargando, error, lanzarRefresco };
}
