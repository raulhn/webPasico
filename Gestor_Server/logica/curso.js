const conexion = require('../conexion.js')
const constantes = require('../constantes.js')

function registrar_curso(descripcion)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
                () =>
                {
                    conexion.dbConn.query('insert into ' + constantes.ESQUEMA_BD + '.curso(descripcion) values(' +
                            conexion.dbConn.escape(descripcion) + ')',
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

function actualizar_curso(nid_curso, descripcion)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
                () =>
                {
                    conexion.dbConn.query('update ' + constantes.ESQUEMA_BD + '.curso set descripcion = ' + 
                            conexion.dbConn.escape(descripcion) + ' where nid = ' + conexion.dbConn.escape(nid_curso) ,
                        (error, results, fields) =>
                        {   
                            if(error) {console.log(error); conexion.dbConn.rollback(); reject();}
                            else {conexion.dbConn.commit(); resolve()}
                        }
                    )
                }
            )
        }
    )
}

function obtener_cursos()
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select * from ' + constantes.ESQUEMA_BD + '.curso order by descripcion desc',
                (error, results, fields) =>
                {
                    if(error) {console.log(error); reject()}
                    else {resolve(results)}
                }
            )
        }

    )
}

function eliminar_curso(nid_curso)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
                () =>
                {
                    conexion.dbConn.query('delete from ' +  constantes.ESQUEMA_BD + '.curso where nid = ' + conexion.dbConn.escape(nid_curso),
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


function obtener_ultimo_curso()
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select nid from ' + constantes.ESQUEMA_BD + '.curso where ano = (select max(ano) from ' + constantes.ESQUEMA_BD + '.curso)',
                (error, results, fields) =>
                {
                    if(error) {console.log(error); reject();}
                    else {resolve(results[0]['nid'])}
                }
            )
        }
    )
}




module.exports.registrar_curso = registrar_curso;
module.exports.actualizar_curso = actualizar_curso;
module.exports.obtener_cursos = obtener_cursos;
module.exports.eliminar_curso = eliminar_curso;

module.exports.obtener_ultimo_curso = obtener_ultimo_curso;