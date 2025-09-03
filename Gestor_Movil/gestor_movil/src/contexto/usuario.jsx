import { useState, useEffect } from "react";

import { UsuarioContext } from "./UsuarioContext";


export const UsuarioProvider = ({ children }) => {


    // Inicializa el usuario desde sessionStorage si existe
    const [usuario, setUsuario] = useState(() => {
        let stored = sessionStorage.getItem("usuario");
        if (stored === "undefined"){sessionStorage.setItem("usuario", JSON.stringify(null)); }
        return stored ? JSON.parse(stored) : null;
    });

    const [roles, setRoles] = useState(() => {
        let stored = sessionStorage.getItem("roles");
        if(stored === "undefined"){sessionStorage.setItem("roles", JSON.stringify([]));
            stored = []
        }
        return stored ? JSON.parse(stored) : [];
    });

    function actualizarUsuario(usuarioActualizado) {
        console.log("Lanza actualizacion", usuarioActualizado);
        setUsuario(usuarioActualizado);
        if (usuarioActualizado) {
            sessionStorage.setItem("usuario", JSON.stringify(usuarioActualizado));
        } else {
            sessionStorage.removeItem("usuario");
        }
    }

    function actualizarRoles(rolesActualizados) {
        console.log("Lanza actualizacion de roles", rolesActualizados);
        setRoles(rolesActualizados);
        sessionStorage.setItem("roles", JSON.stringify(rolesActualizados));
    }

    // Si el usuario cambia desde otro sitio, sincroniza el estado
    useEffect(() => {
        const handleStorage = () => {
            const stored = sessionStorage.getItem("usuario");
            setUsuario(stored ? JSON.parse(stored) : null);
        };
        window.addEventListener("storage", handleStorage);
        return () => window.removeEventListener("storage", handleStorage);
    }, []);

    return (
        <UsuarioContext.Provider value={{
            usuario: usuario,
            actualizarUsuario: actualizarUsuario,
            roles: roles,
            actualizarRoles: actualizarRoles
        }}>
            {children}
        </UsuarioContext.Provider>
    );
};