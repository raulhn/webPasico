import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null); // Estado para el usuario autenticado
  const [tokenNotificacion, setTokenNotificacion] = useState(null); // Estado para el token de notificación
  const [roles, setRoles] = useState([]); // Estado para los roles del usuario

  const iniciarSesion = (datosUsuario) => {
    setUsuario(datosUsuario); // Guarda los datos del usuario
  };

  const cerrarSesion = () => {
    setUsuario(null); // Limpia los datos del usuario
    setRoles([]); // Limpia los roles del usuario
  };

  const guardarTokenNotificacion = (token) => {
    setTokenNotificacion(token); // Guarda el token de notificación
  };

  const guardarRoles = (roles) => {
    setRoles(roles); // Guarda los roles del usuario
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        roles,
        iniciarSesion,
        cerrarSesion,
        guardarTokenNotificacion,
        tokenNotificacion,
        guardarRoles,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
