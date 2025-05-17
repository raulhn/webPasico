const serviceComun = require('./serviceComun');
const constantes = require('../constantes');


function registrarPartitura(partitura) {
  return new Promise((resolve, reject) => {
    const data = {
      titulo: partitura.titulo,
      autor: partitura.autor,
      categoria: partitura.categoria,
    };
    serviceComun
      .peticionSesion(
        'POST',
        constantes.URL_SERVICIO_MOVIL + 'registrar_partitura',
        data
      )
      .then((response) => {
        response.json().then((data) => {
          if (data.error) {
            reject("Error al registrar la partitura: " + data.mensaje);
          } else {
            resolve(data);
          }
        });

      })
      .catch((error) => {
        reject(error);
      });
  });
}

function actulizarPartitura(partitura) {
  return new Promise((resolve, reject) => {
    const data = {
      nid_partitura: partitura.nid_partitura,
      titulo: partitura.titulo,
      autor: partitura.autor,
      categoria: partitura.categoria,
    };
    serviceComun
      .peticionSesion(
        'POST',
        constantes.URL_SERVICIO_MOVIL + 'actualizar_partitura',
        data
      )
      .then((response) => {
        response.json().then((data) => {
          if (data.error) {
            reject("Error al actualizar la partitura: " + data.mensaje);
          } else {
            resolve(data);
          }
        });
      })
      .catch((error) => {
        reject(error);
      });
  });
}

module.exports.registrarPartitura = registrarPartitura;
module.exports.actulizarPartitura = actulizarPartitura;