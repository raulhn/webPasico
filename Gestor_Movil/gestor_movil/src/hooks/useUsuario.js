import {useState, useEffect} from "react";
import {login} from "../services/ServiceUsuario";

export const useUsuario = () =>{
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    // Lógica para obtener el usuario
  }, []);

  async function realizarLogin(correoElectronico, password, callback) {
    // Lógica para iniciar sesión
    await login(correoElectronico, password)
      .then((data) => {
        setUsuario(data.usuario);
        callback(data.usuario);
      })
      .catch((error) => {
        console.log("Error en el login", error);
      });
  }

  return { usuario, setUsuario, realizarLogin };
}