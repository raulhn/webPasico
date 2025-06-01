import { useContext } from "react";
import { AuthContext } from "../providers/AuthContext.js";

export const useRol = () => {
  const { roles } = useContext(AuthContext);

  const esRol = (rolesPermitidos) => {
    if (!roles || roles.length === 0) {
      return false; // Si no hay roles, no se muestra la opción
    }

    for (let a = 0; a < roles.length; a++) {
      for (let i = 0; i < rolesPermitidos.length; i++) {
        if (roles[a].rol === rolesPermitidos[i]) {
          return true;
        }
      }
    }
    return false;
  };

  return { esRol };
};
