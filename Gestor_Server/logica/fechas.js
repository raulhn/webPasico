function formatearFecha(fechaISO) {
  if (!fechaISO || fechaISO.length === 0) {
    return null; // Devuelve un mensaje si la fecha es nula o vacía
  }
  const fecha = new Date(fechaISO); // Convierte la fecha ISO a un objeto Date
  const dia = String(fecha.getDate()).padStart(2, "0"); // Obtiene el día (2 dígitos)
  const mes = String(fecha.getMonth() + 1).padStart(2, "0"); // Obtiene el mes (2 dígitos, +1 porque los meses empiezan en 0)
  const anio = fecha.getFullYear(); // Obtiene el año completo
  return `${dia}/${mes}/${anio}`; // Devuelve la fecha en formato dd/mm/yyyy
}

module.exports.formatearFecha = formatearFecha;
