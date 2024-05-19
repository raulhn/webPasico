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
                    var minutos_totales = Number(minutos_inicio) + (Number(hora_inicio) * 60);   
                    var minutos_comienzo_clase = Number(minutos_totales) + (Number(duracion_clase) * Number(num_clase));

                    var hora_comienzo_clase = Math.trunc(Number(minutos_comienzo_clase) / 60);
                    var minuto_comienzo_clase = Math.abs(Number(minutos_totales) - Number(minutos_comienzo_clase)) % 60;

                    console.log('Inserta clase')

                    console.log('insert into ' + constantes.ESQUEMA_BD + '.horario_clase(hora_inicio, minutos_inicio, duracion_clase, nid_horario) ' +
                    ' values(' + conexion.dbConn.escape(hora_comienzo_clase) + ', ' + conexion.dbConn.escape(minuto_comienzo_clase) + ', ' +
                        conexion.dbConn.escape(duracion_clase) + ', ' + conexion.dbConn.escape(nid_horario) + ')');
                    conexion.dbConn.query(
                        'insert into ' + constantes.ESQUEMA_BD + '.horario_clase(hora_inicio, minutos_inicio, duracion_clase, nid_horario) ' +
                        ' values(' + conexion.dbConn.escape(hora_comienzo_clase) + ', ' + conexion.dbConn.escape(minuto_comienzo_clase) + ', ' +
                            conexion.dbConn.escape(duracion_clase) + ', ' + conexion.dbConn.escape(nid_horario) + ')',
                        (error, results, fields) =>
                        {
                            if(error) {conexion.dbConn.rollback(); console.log(error); reject();}
                            else {conexion.dbConn.commit(); resolve();} 
                        }
                        
                    )
                }
            )
        }
    )
}


function eliminar_horario_clase(nid_horario_clase)
{
    return new Promise(
        (resolve, reject) =>
            {
                conexion.beginTransaction(
                    () =>
                        {
                            conexion.dbConn.query("delete from " + constantes.ESQUEMA_BD + ".horario_clase where nid_horario_clase = " + 
                              conexion.dbConn.escape(nid_horario_clase),
                            (error, results, fields) =>
                            {
                                if(error) {console.log(error); conexion.dbConn.rollback(); reject()}
                                else {conexion.dbConn.commit(); resolve();}
                            })
                        }
                )
            }
    )
}

function obtener_horario(nid_horario)
{
    return new Promise(
        (resolve, reject) =>
            {
                conexion.dbConn.query("select * " +
                                      "from " + constantes.ESQUEMA_BD + ".horario_clases " +
                                      "where nid_horario = " + conexion.dbConn.escape(nid_horario),
                    (error, results, fields) =>
                        {
                            if(error) {console.log(error); reject();}
                            else {resolve(results)}
                        }
                )
            }
    )
}

function eliminar_horario_clase_no_commit(nid_horario_clase)
{
    return new Promise(
        (resolve, reject) =>
       {

            {
                conexion.dbConn.query("delete from " + constantes.ESQUEMA_BD + ".horario_clase where nid_horario_clase = " + 
                    conexion.dbConn.escape(nid_horario_clase),
                (error, results, fields) =>
                {
                    if(error) {console.log(error);  reject()}
                    else {resolve();}
                })
            }
        }
            
    )
}

function eliminar_horario(nid_horario)
{
    return new Promise(
        (resolve, reject) =>
            {
                conexion.beginTransaction(
                    async () =>
                        {
                            let horario_clase = await obtener_horario(nid_horario);

                            for (i = 0; i < horario_clase.length; i++)
                            {
                                try
                                {
                                    eliminar_horario_clase_no_commit(horario_clase[i]['nid_horario_clase']);
                                } 
                                catch(error)
                                {
                                    console.log(error);
                                    reject();
                                }
                            }
                            
                            conexion.dbConn.query("delete from " + constantes.ESQUEMA_BD + "horario where nid_horario = " + conexion.dbConn.escape(nid_horario),
                            () =>
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

function crear_horario(dia, hora_inicio, minutos_inicio, hora_fin, minutos_fin, nid_asignatura, nid_profesor, duracion_clase)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
                () =>
                {
                    conexion.dbConn.query('insert into ' + constantes.ESQUEMA_BD + '.horario(dia, nid_asignatura, nid_profesor)' +
                        ' values(' + conexion.dbConn.escape(dia) + ', ' + conexion.dbConn.escape(nid_asignatura) + ', ' + conexion.dbConn.escape(nid_profesor) + ')',
                        async (error, results, fields) =>
                        {
                            if(error) {console.log(error); conexion.dbConn.rollback(); reject();}
                            else {
                                total = Math.abs((Number(hora_inicio) - Number(hora_fin))) * 60;

                                total = total + Math.abs((Number(minutos_inicio) - Number(minutos_fin)));
                                num_clases = total / Number(duracion_clase);


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


function asignar_horario_clase(nid_horario_clase, nid_matricula_asignatura)
{
    return new Promise(
        (resolve, reject) =>
            {
                conexion.dbConn.beginTransaction(
                    () =>
                        {
                            conexion.dbConn.query("update " + constantes.ESQUEMA_BD + ".matricula_asignatura set nid_horario_clase = " +
                                conexion.dbConn.escape(nid_horario_clase) + " where nid_matricula_asignatura = " + 
                                conexion.dbConn.escape(nid_matricula_asignatura),
                              (error, results, fields) =>
                                {
                                    if (error) {console.log(error); conexion.dbConn.rollback(); reject();}
                                    else {conexion.dbConn.commit(); resolve();}
                                }
                            )
                        }
                )
            }
    )
}

function liberar_horario_clase(nid_matricula_asignatura)
{
    return new Promise(
        (resolve, reject) =>
            {
                conexion.dbConn.beginTransaction(
                    () =>
                        {
                            conexion.dbConn.query("update " + constantes.ESQUEMA_BD + ".matricula_asignatura set nid_horario_clase = null " +
                                "where nid_matricula_asignatura = " + conexion.dbConn.escape(nid_matricula_asignatura),
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


function obtener_horarios(nid_profesor, nid_asignatura)
{
    return new Promise(
        (resolve, reject) =>
            {
                conexion.dbConn.beginTransaction("select h.* from " + constantes.ESQUEMA_BD + ".horario h " +
                     "where (h.nid_profesor = " + conexion.dbConn.escape(nid_profesor) + " or nullif(" +  conexion.dbConn.escape(nid_profesor) + ", \'\') is null) " +
                      " and (h.nid_asignatura = " + conexion.dbConn.escape(nid_asignatura) + " or nullif(" + conexion.dbConn.escape(nid_asignatura) + ", \'\') is null) ",
                  (error, results, fields) =>
                    {
                        if(error) {console.log(error); reject();}
                        else {resolve(results)}
                    }
                )
            }
    )
}


function obtener_horarios_clase(nid_profesor, nid_asignatura)
{
    return new Promise(
        (resolve, reject) =>
            {
                conexion.dbConn.beginTransaction("select hc.* from " + constantes.ESQUEMA_BD + ".horario h, " + constantes.ESQUEMA_BD +  ".horario_clase hc " +
                     "where h.nid_horario = hc.nid_horario " +
                      " and (h.nid_profesor = " + conexion.dbConn.escape(nid_profesor) + " or nullif(" +  conexion.dbConn.escape(nid_profesor) + ", \'\') is null) " +
                      " and (h.nid_asignatura = " + conexion.dbConn.escape(nid_asignatura) + " or nullif(" + conexion.dbConn.escape(nid_asignatura) + ", \'\') is null) ",
                  (error, results, fields) =>
                    {
                        if(error) {console.log(error); reject();}
                        else {resolve(results)}
                    }
                )
            }
    )
}

function obtener_horarios_asignados(nid_profesor, nid_asignatura)
{
    return new Promise(
        (resolve, reject) =>
            {
                conexion.dbConn.beginTransaction("select ma.* " +
                                                "from " + constantes.ESQUEMA_BD + ".horario h, " + constantes.ESQUEMA_BD +  ".horario_clase hc, " +
                                                        constantes.ESQUEMA_BD + ".matricula_asignatura ma " +
                                                "where h.nid_horario = hc.nid_horario " +
                                                 " and (h.nid_profesor = " + conexion.dbConn.escape(nid_profesor) + " or nullif(" +  conexion.dbConn.escape(nid_profesor) + ", \'\') is null) " +
                                                 " and (h.nid_asignatura = " + conexion.dbConn.escape(nid_asignatura) + " or nullif(" + conexion.dbConn.escape(nid_asignatura) + ", \'\') is null) " +
                                                 " and ma.nid_horario_clase = hc.nid_horario_clase",
                  (error, results, fields) =>
                    {
                        if(error) {console.log(error); reject();}
                        else {resolve(results)}
                    }
                )
            }
    )
}

function obtener_horario(nid_horario)
{
    return new Promise(
        (resolve, reject) =>
            {
                conexion.dbConn.beginTransaction("select h.* from " + constantes.ESQUEMA_BD + ".horario h " +
                     "where h.nid_horario = " + conexion.dbConn.escape(nid_horario) ,
                  (error, results, fields) =>
                    {
                        if(error) {console.log(error); reject();}
                        else {resolve(results)}
                    }
                )
            }
    )
}


function obtener_horario_clase(nid_horario)
{
    return new Promise(
        (resolve, reject) =>
            {
                conexion.dbConn.beginTransaction("select hc.* from " + constantes.ESQUEMA_BD + ".horario h, " + constantes.ESQUEMA_BD +  ".horario_clase hc " +
                     "where h.nid_horario = hc.nid_horario " +
                      " and h.nid_horario = " + conexion.dbConn.escape(nid_horario),
                  (error, results, fields) =>
                    {
                        if(error) {console.log(error); reject();}
                        else {resolve(results)}
                    }
                )
            }
    )
}

function obtener_horario_asignado(nid_horario)
{
    return new Promise(
        (resolve, reject) =>
            {
                conexion.dbConn.beginTransaction("select ma.* " +
                                                "from " + constantes.ESQUEMA_BD + ".horario h, " + constantes.ESQUEMA_BD +  ".horario_clase hc, " +
                                                        constantes.ESQUEMA_BD + ".matricula_asignatura ma " +
                                                "where h.nid_horario = hc.nid_horario " +
                                                 " and h.nid_profesor = " + conexion.dbConn.escape(nid_horario) + " and ma.nid_horario_clase = hc.nid_horario_clase",
                  (error, results, fields) =>
                    {
                        if(error) {console.log(error); reject();}
                        else {resolve(results)}
                    }
                )
            }
    )
}


module.exports.registrar_horario_clase = registrar_horario_clase;
module.exports.crear_horario = crear_horario;

module.exports.asignar_horario_clase = asignar_horario_clase;
module.exports.liberar_horario_clase = liberar_horario_clase;
module.exports.eliminar_horario_clase = eliminar_horario_clase;
module.exports.eliminar_horario = eliminar_horario;

module.exports.obtener_horarios = obtener_horarios;
module.exports.obtener_horarios_clase = obtener_horarios_clase;
module.exports.obtener_horarios_asignados = obtener_horarios_asignados;

module.exports.obtener_horario = obtener_horario;
module.exports.obtener_horario_clase = obtener_horario_clase;
module.exports.obtener_horario_asignado = obtener_horario_asignado;