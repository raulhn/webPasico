import { useContext } from "react";
import { AuthContext } from "../providers/AuthContext.js";

export const useRol = () => {
  const { roles } = useContext(AuthContext);
  const esRol = (rol) => {
    if (!rol) {
      return false; // Si no hay rol, no se muestra la opción
    }

    if (!roles || roles.length === 0) {
      return false; // Si no hay roles, no se muestra la opción
    }
    const rolSocio = roles.find((elemento) => elemento.rol === rol);

    if (!rolSocio) {
      return false; // Si no hay rol de socio, no se muestra la opción
    } else {
      return true;
    }
  };

  return { esRol };
};
