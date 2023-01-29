const constantes = require('./constantes.js');
const conexion = require('./conexion.js');

const bcrypt = require('bcryptjs');
const rondas = 10;


function obtener_usuarios()
{
    return new Promise(
        function(resolve, reject)
        {
            conexion.dbConn.query('select * from '+ constantes.ESQUEMA_BD + '.usuario', function(error, results, fields)
            {
                if (error)  {console.log(error); reject();}
                return resolve(results);
            }
            );
        }
    )
}


/**
 * Dado un usuario se recupera su contraseña de base de datos
 * @param {*} user 
 * @returns 
 */
function obtener_pass(user)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select password from '+ constantes.ESQUEMA_BD + '.usuario where usuario = ' + conexion.dbConn.escape(user) , 
            function(error, results, fields)
            {
                if (error)  {console.log(error); reject();}
                if (results.length < 1 || results.length > 1)
                {
                    reject();
                }
                else{
                    resolve(results[0].password);
                }
            }
            );
        }
    )
}

async function comparar_pass(pass, pass_hash)
{
    return new Promise(
        (resolve, reject) =>
        {
            bcrypt.compare(pass, pass_hash, (err, coinciden) => {
                if (err) {
                    console.log("Error comprobando:", err);
                    resolve(false);
                } else {
                    resolve(coinciden);
                }
            });
        }
    )
}
async function login(user, pass)
{
    try{
        pass_hash = await obtener_pass(user);
        return await comparar_pass(pass, pass_hash)
       
    }
    catch(err)
    {
        return false;
    }
}

function existe_login(user)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select count(*) nCont from '+ constantes.ESQUEMA_BD + '.usuario where usuario = ' + conexion.dbConn.escape(user) , 
            function(error, results, fields)
            {
                if (error)  {console.log(error); reject();}
                if (results.length < 1 || results.length > 1)
                {
                    reject();
                }
                else{
                    resolve(results[0].nCont > 0);
                }
    }
    );
    }
    );
}


function esAdministrador(user)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select count(*) ncont from ' + constantes.ESQUEMA_BD + '.usuario where usuario = ' + conexion.dbConn.escape(user),
            (error, results, fileds) =>
            {
                if (error) {console.log(error); resolve(false);}
                else{
                    resolve(results[0].nCont > 0);
                }
            } 
            )
        }
    )
}

async function registrar_usuario(user, pass)
{
    return new Promise(
        async (resolve, reject) =>
        {
            bExiste = await existe_login(user);
            if (!bExiste)
            {
                const saltRounds = 15;
                conexion.dbConn.beginTransaction(
                    () =>
                    {  
                        bcrypt.hash(pass, saltRounds,
                            (err, hash) =>
                            {
                                conexion.dbConn.query('insert into ' +  constantes.ESQUEMA_BD + '.usuario(usuario, password, nid_rol) values(' +
                                conexion.dbConn.escape(user) + ', ' + conexion.dbConn.escape(hash) + ', 2)',
                                (error, results, fields) =>
                                {
                                    if (error) {conexion.dbConn.rollback();  console.log(error); reject();}
                                    else {conexion.dbConn.commit(); console.log('Usuario registrado'); resolve(); }
                                })
                            }
                            )
                    }
                );
            }
        }
    )
}


module.exports.login = login;
module.exports.obtener_usuarios = obtener_usuarios;
module.exports.registrar_usuario = registrar_usuario;
module.exports.esAdministrador = esAdministrador;