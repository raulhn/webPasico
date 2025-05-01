import * as SecureStore from "expo-secure-store";

async function obtenerToken(key) {
  try {
    const value = await SecureStore.getItemAsync(key);
    if (value) {
      console.log(`Token recuperado: ${value}`);
      return value;
    } else {
      console.log("No se encontró ningún token con esa clave.");
      return null;
    }
  } catch (error) {
    console.log("Error al obtener el token:", error);
    return null;
  }
}

async function guardarToken(key, value) {
  try {
    let token = await SecureStore.getItemAsync(key);
    if (token) {
      await SecureStore.deleteItemAsync(key);
    }
    await SecureStore.setItemAsync(key, value);
    console.log(`Token guardado con la clave: ${key}`);
  } catch (error) {
    console.log("Error al guardar el token:", error);
  }
}

async function eliminarToken(key) {
  try {
    await SecureStore.deleteItemAsync(key);
    console.log(`Token eliminado con la clave: ${key}`);
  } catch (error) {
    console.log("Error al eliminar el token:", error);
  }
}

module.exports.obtenerToken = obtenerToken;
module.exports.guardarToken = guardarToken;
module.exports.eliminarToken = eliminarToken;
