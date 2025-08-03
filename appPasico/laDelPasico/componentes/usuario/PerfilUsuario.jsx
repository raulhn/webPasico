import { AuthContext } from "../../providers/AuthContext";
import { useContext } from "react";
import { Pressable, View, StyleSheet, Text } from "react-native";
import serviceUsuario from "../../servicios/serviceUsuario"; // Ajusta la ruta según tu estructura de carpetas
import { useRouter } from "expo-router"; // Asegúrate de tener instalado expo-router
import { useEffect } from "react";

import { Boton } from "../componentesUI/ComponentesUI"; // Asegúrate de que Boton esté correctamente importado

export default function PerfilUsuario() {
  const { usuario, cerrarSesion } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (!usuario) {
      console.log(
        "No hay usuario, redirigiendo a la pantalla de inicio de sesión"
      );
      router.replace("/(tabs)/(drawer)"); // Redirige a la pantalla de inicio de sesión si no hay usuario}
    }
  }, [usuario]);

  if (!usuario) {
    return null;
  }

  function lanzaCerrarSesion() {
    try {
      serviceUsuario.logout().then((response) => {
        if (response.error) {
          console.log("Error al cerrar sesión:", response.mensaje);
        } else {
          cerrarSesion(); // Llama a la función de cierre de sesión del contexto
          router.replace("/(tabs)/(drawer)"); // Redirige a la pantalla de inicio de sesión
        }
      });
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  }

  return (
    <>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>
        Perfil de Usuario
      </Text>
      <Text style={{ fontSize: 16, marginTop: 10 }}>
        Nombre: {usuario.nombre}
      </Text>
      <Boton
        nombre="Cambiar Contraseña"
        onPress={() => {
          router.replace("/PantallaCambioPass");
        }}
        color="#007BFF"
      />
      <Boton
        nombre="Cerrar Sesión"
        onPress={lanzaCerrarSesion}
        color="#FF0000"
        colorTexto="#FFF"
      />
    </>
  );
}

const estilos = StyleSheet.create({
  botonCerrarSesion: {
    backgroundColor: "#FF0000",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
});
