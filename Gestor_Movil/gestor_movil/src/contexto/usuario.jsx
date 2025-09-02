import { useState, useEffect } from "react";

import { UsuarioContext } from "./UsuarioContext";


export const UsuarioProvider = ({ children }) => {


    // Inicializa el usuario desde sessionStorage si existe
    const [usuario, setUsuario] = useState(() => {
        const stored = sessionStorage.getItem("usuario");
        return stored ? JSON.parse(stored) : null;
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
            actualizarUsuario: actualizarUsuario
        }}>
            {children}
        </UsuarioContext.Provider>
    );
};