const constantes = require("./constantes.js");

// https://attacomsian.com/blog/uploading-files-nodejs-express
function subirFicheros(fichero, nombreImagen) {
  return new Promise((resolve, reject) => {
    try {
      if (!fichero) {
        reject(new Error("Error al subir fichero"));
      } else {
        const archivo = fichero.imagen;
        console.log(constantes.RUTA_SUBIDAS + nombreImagen);
        archivo.mv(constantes.RUTA_SUBIDAS + nombreImagen);

        resolve();
      }
    } catch (err) {
      console.log(err);
      reject(err);
    }
  });
}

module.exports.subirFicheros = subirFicheros;
