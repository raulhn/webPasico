import {useState, useEffect} from "react";
import * as ServiceUsuario from "../services/ServiceUsuario";

export const useUsuario = () =>{
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    // Lógica para obtener el usuario
  }, []);

  async function realizarLogin(correoElectronico, password, callback) {
    try
    {
      await ServiceUsuario.login(correoElectronico, password)
        .then((data) => {
          setUsuario(data.usuario);
          callback(data.usuario);
        });
    }
    catch(error) {
      console.log("Error en el login", error);
    }
  }

  async function logout() {
    try {
      await ServiceUsuario.logout();
      setUsuario(null);
    } catch (error) {
      console.log("Error en el logout", error);
    }
  }



  return { usuario, setUsuario, realizarLogin, logout };
}