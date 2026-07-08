const fs = require("fs");

const constantes = require("../constantes.js");

function createFile(fileName, content) {
  return new Promise((resolve, reject) => {
    try {
      fs.writeFile(fileName.toString(), content, (err) => {
        try {
          if (err) {
            console.error("Error al crear el archivo:", err);
            reject(err);
          } else {
            console.log("Archivo creado con éxito");
            resolve();
          }
        } catch (err) {
          console.error("Error al crear el archivo:", err);
          reject(err);
        }
      });
    } catch (err) {
      console.error("Error al crear el archivo:", err);
      reject(err);
    }
  });
}

function readFile(fileName) {
  return new Promise((resolve, reject) => {
    try {
      fs.readFile(fileName.toString(), "utf8", (err, data) => {
        try {
          if (err) {
            console.error("Error al leer el archivo:", err);
            reject(err);
          } else {
            resolve(data);
          }
        } catch (err) {
          console.error("Error al leer el archivo:", err);
          reject(err);
        }
      });
    } catch (err) {
      console.error("Error al leer el archivo:", err);
      reject(err);
    }
  });
}

module.exports.readFile = readFile;
module.exports.createFile = createFile;
