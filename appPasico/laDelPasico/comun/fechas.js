export function obtenerFechaFormateada(date) {
  try {
    if (!date) {
      return null;
    }
    const d = new Date(date);
    const madridDate = d.toLocaleString("en-GB", { timeZone: "Europe/Madrid" });
    // Formato sv-SE: 'YYYY-MM-DD HH:mm:ss'
    return madridDate.replace("T", " ");
  } catch (error) {
    return null;
  }
}
