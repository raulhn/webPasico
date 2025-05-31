import { useContext } from "react";
import { AuthContext } from "../providers/AuthContext.js";

export const useRol = () => {
  const { roles } = useContext(AuthContext);

  const esRol = (rolesPermitidos) => {
    if (!roles || roles.length === 0) {
      return false; // Si no hay roles, no se muestra la opción
    }
    const rolesAdministrador = roles.find((rol) =>
      rolesPermitidos.includes(roles.rol)
    );

    return !rolesAdministrador || rolesAdministrador.length === 0;
  };

  return { esRol };
};
