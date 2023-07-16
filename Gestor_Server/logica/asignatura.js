const conexion = require('../conexion.js')
const constantes = require('../constantes.js')

function registrar_asignatura(descripcion)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
                () =>
                {
                    conexion.dbConn.query("insert into " + constantes.ESQUEMA_BD + ".asignatura(descripcion) values(" + conexion.dbConn.escape(descripcion) + ')',
                        (error, results, fields) =>
                        {
                            if(error) {console.log(error); conexion.dbConn.rollback(); reject();}
                            else
                            {
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

function actualizar_asignatura(nid_asignatura, descripcion)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
                () =>
                {
                    conexion.dbConn.query("update " + constantes.ESQUEMA_BD + ".asignatura set descripcion = " + conexion.dbConn.escape(descripcion) +
                        " where nid = " + conexion.dbConn.escape(nid_asignatura),
                        (error, results, fields) =>
                        {
                            if(error) {console.log(error); conexion.dbConn.rollback(); reject()}
                            else{conexion.dbConn.commit(); resolve()}
                        }
                    )
                }
            )
        }
    );
}

function eliminar_asignatura(nid_asignatura)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
                () =>
                {
                    conexion.dbConn.query("delete from " + constantes.ESQUEMA_BD + ".asignatura where nid = " + conexion.dbConn.escape(nid_asignatura) ,
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

function obtener_asignaturas()
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query("select * from " + constantes.ESQUEMA_BD + '.asignatura',
                (error, results, fields) =>
                {
                    if(error) {console.log(error); reject();}
                    else {resolve(results);}
                }
            )
        }
    )
}

function add_profesor(nid_asignatura, nid_persona)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
                () =>
                {
                    conexion.dbConn.query("insert into " + constantes.ESQUEMA_BD + ".profesor(nid_asignatura, nid_persona) values(" +
                            conexion.dbConn.escape(nid_asignatura) + ", " + conexion.dbConn.escape(nid_persona) + ")",
                        (error, results, fields) =>
                        {
                            if (error) {console.log(error); conexion.dbConn.rollback(); reject()}
                            else {conexion.dbConn.commit(); resolve();}
                        }
                    )
                }
            )
        }
    )
}

function eliminar_profesor(nid_asignatura, nid_persona)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
                () =>
                {
                    conexion.dbConn.query("delete from " + constantes.ESQUEMA_BD + ".profesor where nid_asignatura = " + conexion.dbConn.escape(nid_asignatura) + 
                            " and nid_persona = " +  conexion.dbConn.escape(nid_persona), 
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


function obtener_profesores()
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query("select p.*, a.nid nid_asignatura, a.* from " + constantes.ESQUEMA_BD + ".persona p, " + 
                    constantes.ESQUEMA_BD + ".asignatura a, " + constantes.ESQUEMA_BD + ".profesor pr where p.nid = pr.nid_persona and pr.nid_asignatura = a.nid",
                (error, results, fields) =>
                {
                    if(error) {console.log(error); reject()}
                    else{resolve(results)}
                }        
            )
        }
    )
}

function obtener_profesores_asignatura(nid_asignatura)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query("select p.*, a.nid nid_asignatura, a.* from " + constantes.ESQUEMA_BD + ".persona p, " + 
                    constantes.ESQUEMA_BD + ".asignatura a, " + constantes.ESQUEMA_BD + ".profesor pr where p.nid = pr.nid_persona and pr.nid_asignatura = a.nid and " +
                    "a.nid = " + conexion.dbConn.escape(nid_asignatura),
                (error, results, fields) =>
                    {
                        if(error) {console.log(error); reject()}
                        else{resolve(results)}
                    }        
                )   
        }
    )
}

module.exports.registrar_asignatura = registrar_asignatura;
module.exports.actualizar_asignatura = actualizar_asignatura;
module.exports.eliminar_asignatura = eliminar_asignatura;
module.exports.obtener_asignaturas = obtener_asignaturas;

module.exports.add_profesor = add_profesor;
module.exports.eliminar_profesor = eliminar_profesor;

module.exports.obtener_profesores = obtener_profesores;
module.exports.obtener_profesores_asignatura = obtener_profesores_asignatura;