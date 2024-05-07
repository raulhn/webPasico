const conexion = require('../conexion.js')
const constantes = require('../constantes.js')


function registrar_horario_clase(hora_inicio, minutos_inicio, duracion_clase)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
                () =>
                {
                    var minutos_inicio_clase = (minutos_inicio +  duracion_clase);
                    var hora_inicio_clase = 

                    conexion.dbConn.query(
                        'insert into ' + constantes.ESQUEMA_BD + '.horario_clase(hora_inicio, minutos_inicio, duracion_clase, nid_horario) ' +
                        ' values(' + conexion.dbConn.escape(hora_inicio) + ', ' + conexion.dbConn.escape(minutos_inicio) + ', ' +
                            conexion.dbConn.escape(duracion_clase) + ')'
                        +
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
                        (error, results, fields) =>
                        {
                            if(error) {console.log(error); conexion.dbConn.rollback(); reject();}
                            else {
                                total = (hora_inicio - hora_fin) * 60;
                                total = total + (minutos_inicio - minutos_fin) * 60
                                num_clases = total / duracion_clase;

                                for (i = 0; i < num_clases; i++)
                                {

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