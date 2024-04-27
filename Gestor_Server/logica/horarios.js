const conexion = require('../conexion.js')
const constantes = require('../constantes.js')


function crear_horario(dia, hora_inicio, hora_fin, nid_asignatura, nid_profesor, duracion_clase)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
                () =>
                {
                    conexion.dbConn.query('insert into ' + constantes.ESQUEMA_BD + '.horario(dia, hora_inicio, hora_fin, nid_asignatura, nid_profesor)' +
                        ' values(' + conexion.dbConn.escape(dia) + ', ' + conexion.dbConn.escape(hora_inicio) + ', ' + conexion.dbConn.escape(hora_fin) +
                        ', ' + conexion.dbConn.escape(nid_asignatura) + ', ' + conexion.dbConn.escape(nid_profesor),
                        (error, results, fields) =>
                        {
                            if(error) {console.log(error); conexion.dbConn.rollback(); reject();}
                            else {conexion.dbConn.commit(); resolve();}
                        }
                    )
                }
            )
        }
    )
}