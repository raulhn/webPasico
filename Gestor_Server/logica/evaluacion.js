const conexion = require('../conexion.js')
const constantes = require('../constantes.js')


function registrar_evaluacion(nota, nid_trimestre, nid_progreso, nid_matricula_asignatura, comentario)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('insert into ' + constantes.ESQUEMA_BD + '.evaluacion(' +
                'nota, nid_tipo_progreso, nid_trimestre, nid_matricula_asignatura, comentario) values(' +
                conexion.dbConn.escape(nota) + ', ' + conexion.dbConn.escape(nid_progreso) +
                ', ' + conexion.dbConn.escape(nid_trimestre) + ', ' + 
                conexion.dbConn.escape(nid_matricula_asignatura) + ', ' + conexion.dbConn.escape(comentario) + ')',
              (error, results,fields) =>
              {
                 if(error) {console.log(error); reject(error);}
                 else {resolve()} 
              }
            )
        }
    )
}

function obtener_trimestres()
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select * from ' + constantes.ESQUEMA_BD + '.trimestre',
                (error, results, fields) =>
                {
                    if(error) {console.log(error); reject();}
                    else {resolve(results)}
                }
            )
        }
    )
}

module.exports.obtener_trimestres = obtener_trimestres;
module.exports.registrar_evaluacion = registrar_evaluacion;