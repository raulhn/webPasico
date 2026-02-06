import ServicioEventoConcierto from "../../servicios/serviceEventoConcierto";

export const useEventoConcierto = (cerrarSesion) => {
  async function registrarEventoConcierto(evento) {
    try {
      const respuesta = await ServicioEventoConcierto.registrarEventoConcierto(
        evento,
        cerrarSesion
      );

      return respuesta;
    } catch (error) {
      console.log("Error al registrar el evento:", error);
      throw new Error("Error al registrar el evento");
    }
  }
  async function actualizarEventoConcierto(evento) {
    try {
      const respuesta = await ServicioEventoConcierto.actualizarEventoConcierto(
        evento,
        cerrarSesion
      );
      return respuesta;
    } catch (error) {
      console.log("Error al actualizar el evento:", error);
      throw new Error("Error al actualizar el evento");
    }
  }

  async function eliminarEventoConcierto(nidEvento) {
    try {
      await ServicioEventoConcierto.eliminarEventoConcierto(
        nidEvento,
        cerrarSesion
      );
    } catch (error) {
      console.log("Error al eliminar el evento:", error);
      throw new Error("Error al eliminar el evento");
    }
  }

  return {
    registrarEventoConcierto,
    actualizarEventoConcierto,
    eliminarEventoConcierto,
  };
};
