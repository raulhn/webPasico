import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    
  const [usuario, setUsuario] = useState(null); // Estado para el usuario autenticado

  const iniciarSesion = (datosUsuario) => {
    setUsuario(datosUsuario); // Guarda los datos del usuario
  };

  const cerrarSesion = () => {
    setUsuario(null); // Limpia los datos del usuario
  };

  return (
    <AuthContext.Provider value={{ usuario, iniciarSesion, cerrarSesion }}>
      {children}
    </AuthContext.Provider>
  );
};
