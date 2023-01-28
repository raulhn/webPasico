const constantes = require('./constantes.js');
const conexion = require('./conexion.js');

const bcrypt = require('bcryptjs');
const rondas = 10;


function login(usuario, password)
{
    return new Promise(
        function(resolve)
        {
            console.log('select * from '+ constantes.ESQUEMA_BD + '.usuario where usuario = ' +  conexion.dbConn.escape(usuario) + 
            ' and pass = ' +  conexion.dbConn.escape(password) );
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

async function nuevo_login(user, pass)
{
    try{
        pass_original = await obtener_pass(user);
        if (pass === pass_original)
        {
            console.log(pass);
            console.log(pass_original);
            return true;
        }
        return false;
    }
    catch(err)
    {
        return false;
    }
}

module.exports.login = login;
module.exports.obtener_usuarios = obtener_usuarios;
module.exports.nuevo_login = nuevo_login;