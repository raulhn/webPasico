// Función para manejar el timeout
function fetchWithTimeout(url, options, timeout = 5000) {
  // Timeout en milisegundos (5 segundos por defecto)
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("Timeout: El servicio no respondió a tiempo")),
        timeout
      )
    ),
  ]);
}

module.exports.fetchWithTimeout = fetchWithTimeout;
