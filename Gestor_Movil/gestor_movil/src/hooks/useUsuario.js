import {useState, useEffect} from "react";
import * as ServiceUsuario from "../services/ServiceUsuario";

export const useUsuario = () =>{
  const [usuario, setUsuario] = useState(null);
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    // Lógica para obtener el usuario
  }, []);

  async function realizarLogin(correoElectronico, password, callback) {
    try
    {

      await ServiceUsuario.login(correoElectronico, password);
      const infoUsuario = await refrescarUsuario();
      callback(infoUsuario.usuario, infoUsuario.roles);

    }
    catch(error) {
      console.log("Error en el login", error);
      callback(null, null);
    }
  }

  async function refrescarUsuario()
  {
    try{
      const data = await ServiceUsuario.obtenerUsuario();
      if (data.error && data.codigo === 1)
      {
        setUsuario(null);
        setRoles([])
        return null;
      }
      else{
        setUsuario(data.usuario);
        setRoles(data.roles)
        return data;
      }
    }
    catch(error) {
      console.log("Error al obtener el usuario", error);
      setUsuario(null);
      setRoles([]);
      return null;
    }
  }

  async function logout() {
    try {
      await ServiceUsuario.logout();
      setUsuario(null);
      setRoles([]);
    } catch (error) {
      console.log("Error en el logout", error);
    }
  }

  async function cambiarPassword(passwordActual, nuevoPassword) {
    try {
      await ServiceUsuario.cambiarPassword(passwordActual, nuevoPassword);
      return true;
    } catch (error) {
      console.log("Error al cambiar la contraseña", error);
      return false;
    }
  }


  return { usuario, setUsuario, realizarLogin, logout, refrescarUsuario, roles, cambiarPassword };
}