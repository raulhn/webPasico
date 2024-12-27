const conexion = require('../conexion.js')
const constantes = require('../constantes.js')

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

function existe_evaluacion(nid_trimestre, nid_asignatura, nid_profesor)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select count(*) num from ' + constantes.ESQUEMA_BD + '.evaluacion ' +
                                ' where nid_trimestre = ' + conexion.dbConn.escape(nid_trimestre) +
                                ' and nid_asignatura = ' + conexion.dbConn.escape(nid_asignatura) + 
                                ' and nid_profesor = ' + conexion.dbConn.escape(nid_profesor),
                    (error, results, fields) =>
                    {
                        
                        console.log('Numero ' + results[0]['num'])
                        if(error) {console.log(error); reject(error);}
                        else {resolve(results[0]['num'] > 0)}
                    }
             )
        }
    )
}

function obtener_evaluacion(nid_trimestre, nid_asignatura, nid_profesor)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select * from ' + constantes.ESQUEMA_BD + '.evaluacion ' +
                                ' where nid_trimestre = ' + conexion.dbConn.escape(nid_trimestre) +
                                ' and nid_asignatura = ' + conexion.dbConn.escape(nid_asignatura) + 
                                ' and nid_profesor = ' + conexion.dbConn.escape(nid_profesor),
                    (error, results, fields) =>
                    {
                        if(error) {console.log(error); reject(error);}
                        else {resolve(results[0])}
                    }
            )
        }
    )
}

function crear_evaluacion(nid_trimestre, nid_asignatura, nid_profesor)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
                () =>
                {
                    conexion.dbConn.query('insert into ' + constantes.ESQUEMA_BD + '.evaluacion' +
                                        '(nid_trimestre, nid_asignatura, nid_profesor) values(' +
                                        conexion.dbConn.escape(nid_trimestre) + ', ' + conexion.dbConn.escape(nid_asignatura) +
                                        ', ' + conexion.dbConn.escape(nid_profesor) + ')',
                            (error, results, fields) =>
                            {
                                if (error) {console.log(error); conexion.dbConn.rollback(); reject();}
                                else {conexion.dbConn.commit(); resolve(results.insertId)}
                            });
               }
            )
            
        }
    )
}

function registrar_evaluacion(nid_trimestre, nid_asignatura, nid_profesor)
{
    return new Promise(
        async (resolve, reject) =>
        {
            bExiste_evaluacion = await existe_evaluacion(nid_trimestre, nid_asignatura, nid_profesor);
            
            if (bExiste_evaluacion)
            {
                let evaluacion = await obtener_evaluacion(nid_trimestre, nid_asignatura, nid_profesor);
                resolve(evaluacion['nid_evaluacion'])
            }
            else
            {
                let nid_evaluacion = await crear_evaluacion(nid_trimestre, nid_asignatura, nid_profesor);
                resolve(nid_evaluacion)
            }
        }
    )
}

function existe_evaluacion_matricula(nid_evaluacion, nid_matricula_asignatura)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select count(*) num from ' + constantes.ESQUEMA_BD +
                              '.evaluacion_matricula ' +
                              ' where nid_evaluacion = ' + conexion.dbConn.escape(nid_evaluacion) +
                              ' and nid_matricula_asignatura = ' + conexion.dbConn.escape(nid_matricula_asignatura),
                    (error, results, fields) =>
                    {
                        if(error) {console.log(error); reject(error)}
                        else {resolve(results[0]['num'] > 0)}
                    }
            )
        }
    )
}


function obtener_evaluacion_matricula(nid_evaluacion, nid_matricula_asignatura)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select * from ' + constantes.ESQUEMA_BD +
                              '.evaluacion_matricula ' +
                              ' where nid_evaluacion = ' + conexion.dbConn.escape(nid_evaluacion) +
                              ' and nid_matricula_asignatura = ' + conexion.dbConn.escape(nid_matricula_asignatura),
                    (error, results, fields) =>
                    {
                        if(error) {console.log(error); reject(error)}
                        else {resolve(results[0])}
                    }
            )
        }
    )
}


function obtener_evaluaciones_matricula(nid_evaluacion)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select em.*, m.nid_persona nid_alumno from ' + constantes.ESQUEMA_BD +  '.evaluacion_matricula em, ' +
                                   constantes.ESQUEMA_BD + '.matricula_asignatura ma, ' +
                                   constantes.ESQUEMA_BD + '.matricula m '+
                                  ' where em.nid_evaluacion = ' + conexion.dbConn.escape(nid_evaluacion) + 
                                  ' and ma.nid = em.nid_matricula_asignatura ' +
                                  ' and m.nid = ma.nid_matricula',
                 (error, results, fields) =>
                 {
                    if(error) {console.log(error, reject(error))}
                    else {resolve(results)}
                 }

            )
        }
    )
}

function actualizar_evaluacion_matricula(nid_evaluacion_matricula, nota, nid_tipo_progreso, comentario)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
                () =>
                {
                    conexion.dbConn.query('update ' + constantes.ESQUEMA_BD + '.evaluacion_matricula set ' +
                                        ' nota = ' + conexion.dbConn.escape(nota) +
                                        ', nid_tipo_progreso = ' + conexion.dbConn.escape(nid_tipo_progreso) +
                                        ', comentario = ' + conexion.dbConn.escape(comentario) +
                                        ' where nid_evaluacion_matricula = ' + conexion.dbConn.escape(nid_evaluacion_matricula),
                            (error, results, fields) =>
                            {
                                if(error) {console.log(error); conexion.dbConn.rollback(); reject(error);}
                                else {conexion.dbConn.commit(); resolve();}
                            }
                    )
                }
            )
        }
    )
}

function insertar_evaluacion_matricula(nid_evaluacion, nid_matricula_asignatura, nota, nid_tipo_progreso, comentario)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
                () =>
                {
                    conexion.dbConn.query('insert into ' + constantes.ESQUEMA_BD + '.evaluacion_matricula' +
                                          '(nid_evaluacion, nid_matricula_asignatura, nota, nid_tipo_progreso, comentario) ' +
                                          'values(' + conexion.dbConn.escape(nid_evaluacion) + ', ' + conexion.dbConn.escape(nid_matricula_asignatura) +
                                          ', ' + conexion.dbConn.escape(nota) + ', ' + conexion.dbConn.escape(nid_tipo_progreso) + ', ' +
                                          conexion.dbConn.escape(comentario) + ')',
                            (error, results, fields) =>
                            {
                                if (error) {console.log(error); conexion.dbConn.rollback(); reject(error);}
                                else {conexion.dbConn.commit(); resolve();}
                            }
                    )
                }
            )
        }
    )
}

function registrar_evaluacion_matricula(nid_evaluacion, nid_matricula_asignatura, nota, nid_tipo_progreso, comentario)
{
    return new Promise(
        async (resolve, reject) =>
        {

            bExiste_evaluacion_matricula = await existe_evaluacion_matricula(nid_evaluacion, nid_matricula_asignatura);

            if(bExiste_evaluacion_matricula)
            {
                let evaluacion_matricula = await obtener_evaluacion_matricula(nid_evaluacion, nid_matricula_asignatura);
                await actualizar_evaluacion_matricula(evaluacion_matricula['nid_evaluacion_matricula'], nota, nid_tipo_progreso, comentario);
                resolve();
            }
            else
            {
                await insertar_evaluacion_matricula(nid_evaluacion, nid_matricula_asignatura, nota, nid_tipo_progreso, comentario);
                resolve();
            }
        }
    )
}




module.exports.obtener_trimestres = obtener_trimestres;
module.exports.registrar_evaluacion = registrar_evaluacion;
module.exports.registrar_evaluacion_matricula = registrar_evaluacion_matricula;

module.exports.obtener_evaluacion = obtener_evaluacion;
module.exports.obtener_evaluacion_matricula = obtener_evaluacion_matricula;
module.exports.obtener_evaluaciones_matricula = obtener_evaluaciones_matricula;

module.exports.existe_evaluacion = existe_evaluacion;