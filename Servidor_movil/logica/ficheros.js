const fs = require("fs");
const docxConverter = require("docx-pdf");

const constantes = require("../constantes.js");

function createFile(fileName, content) {
  return new Promise((resolve, reject) => {
    fs.writeFile(fileName.toString(), content, (err) => {
      if (err) {
        console.error("Error al crear el archivo:", err);
        reject(err);
      } else {
        console.log("Archivo creado con éxito");
        resolve();
      }
    });
  });
}

function readFile(fileName) {
  return new Promise((resolve, reject) => {
    fs.readFile(fileName.toString(), "utf8", (err, data) => {
      if (err) {
        console.error("Error al leer el archivo:", err);
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
}

function convertirPdf(uri) {
  return new Promise((resolve, reject) => {
    docxConverter("/tmp/temp.docx", "/tmp/archivo.pdf", function (err, result) {
      if (err) {
        console.error("fichero.js -> convertirPdf: Error al convertir:", err);
        reject(err);
      } else {
        console.log("Conversión exitosa:", result);
        resolve(result);
      }
    });
  });
}

module.exports.readFile = readFile;
module.exports.createFile = createFile;
