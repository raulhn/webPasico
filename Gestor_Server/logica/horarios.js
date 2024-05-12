const conexion = require('../conexion.js')
const constantes = require('../constantes.js')


function registrar_horario_clase(hora_inicio, minutos_inicio, duracion_clase, num_clase, nid_horario)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
                () =>
                {
                    var minutos_totales = minutos_inicio + (hora_inicio * 60);   
                    var minutos_comienzo_clase = minutos_totales + (duracion_clase * num_clase);

                    var hora_comienzo_clase = minutos_comienzo_clase / 60;
                    var minuto_comienzo_clase = (hora_comienzo_clase) - minutos_comienzo_clase;

                    conexion.dbConn.query(
                        'insert into ' + constantes.ESQUEMA_BD + '.horario_clase(hora_inicio, minutos_inicio, duracion_clase, nid_horario) ' +
                        ' values(' + conexion.dbConn.escape(hora_comienzo_clase) + ', ' + conexion.dbConn.escape(minuto_comienzo_clase) + ', ' +
                            conexion.dbConn.escape(duracion_clase) + ', ' + conexion.dbConn.escape(nid_horario) + ')',
                        (error, results, fields) =>
                        {
                            if(error) {conexion.dbConn.rollback(); reject();}
                            else {resolve();}
                        }
                        
                    )
                }
            )
        }
    )
}

function crear_horario(dia, hora_inicio, minutos_inicio, hora_fin, minutos_fin, nid_asignatura, nid_profesor, duracion_clase)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
                () =>
                {
                    conexion.dbConn.query('insert into ' + constantes.ESQUEMA_BD + '.horario(dia, nid_asignatura, nid_profesor)' +
                        ' values(' + conexion.dbConn.escape(dia) + ', ' + conexion.dbConn.escape(hora_inicio) + ', ' + conexion.dbConn.escape(hora_fin) +
                        ', ' + conexion.dbConn.escape(nid_asignatura) + ', ' + conexion.dbConn.escape(nid_profesor),
                        async (error, results, fields) =>
                        {
                            if(error) {console.log(error); conexion.dbConn.rollback(); reject();}
                            else {
                                total = (hora_inicio - hora_fin) * 60;
                                total = total + (minutos_inicio - minutos_fin);
                                num_clases = total / duracion_clase;

                                for (i = 0; i < num_clases; i++)
                                {
                                    try
                                    {
                                        await registrar_horario_clase(hora_inicio, minutos_inicio, duracion_clase, i, results.insertId);
                                    }
                                    catch(error)
                                    {
                                        conexion.dbConn.rollback();
                                        console.log(error);
                                        resolve();
                                    }
                                }
                                conexion.dbConn.commit(); 
                                resolve(); 
                            }
                        }
                    )
                }
            )
        }
    )
}

module.exports.registrar_horario_clase = registrar_horario_clase;
module.exports.crear_horario = crear_horario;
