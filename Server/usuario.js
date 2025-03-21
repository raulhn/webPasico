const constantes = require('./constantes.js');
const conexion = require('./conexion.js');

const bcrypt = require('bcryptjs');
const rondas = 10;



function esLogueado(usuario)
{
    if(!usuario)
    {
       return false;
    }
    else
    {
        return true;
    }
}

function esAdministrador(usuario)
{
    return new Promise(function (resolve, reject)
    {
        if(!esLogueado(usuario)){resolve(false);}
        else{

            conexion.dbConn.query('select * from '+ constantes.ESQUEMA_BD + '.usuario where usuario = ' + conexion.dbConn.escape(usuario) + ' and rol = ' + constantes.ROL_ADMINISTRADOR ,  function(error, results, fields)
            {
                if (error)  return resolve(false);
                if (results.length <= 0)
                {
                    resolve(false);
                }
                resolve(true);
            });
        }
    });
}


function login(usuario, password)
{
    return new Promise(
        function(resolve)
        {
            conexion.dbConn.query('select pass from '+ constantes.ESQUEMA_BD + '.usuario where usuario = ' +  conexion.dbConn.escape(usuario) 
               , 
            function(error, results, fields)
            {
                if (error) throw resolve(false);
                console.log(results.length);
                if (results.length <= 0)
                {
                  resolve(false);
                }
                else{
                    let passHash = results[0].pass;
                    bcrypt.compare(password, passHash, (err, coinciden) => {
                        if (err) {
                            console.log("Error comprobando:", err);
                        } else {
                           resolve(coinciden);
                        }
                    });
                }

            }
            );
        });
}
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

async function actualizar_password(user, pass)
{
    return new Promise(
        async (resolve, reject) =>
        {
            bExiste = await existe_login(user);
            if (bExiste)
            {

                const saltRounds = 9;
                conexion.dbConn.beginTransaction(
                    () =>
                    {  
                        bcrypt.hash(pass, saltRounds,
                            (err, hash) =>
                            {
                                conexion.dbConn.query('update ' +  constantes.ESQUEMA_BD + '.usuario set pass = ' +
                                conexion.dbConn.escape(hash) + ' where usuario = ' + conexion.dbConn.escape(user),
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
            else {reject()}
        }
    )
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
                    resolve(false)
                }
                else{
                    resolve(results[0].nCont > 0);
                }
            }
            );
        }
    );
}

module.exports.esAdministrador = esAdministrador;
module.exports.login = login;
module.exports.obtener_usuarios = obtener_usuarios;
module.exports.esLogueado = esLogueado;
module.exports.actualizar_password = actualizar_password;
module.exports.existe_login = existe_login;