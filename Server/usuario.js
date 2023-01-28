const constantes = require('./constantes.js');
const conexion = require('./conexion.js');

const bcrypt = require('bcryptjs');
const rondas = 10;


/*
function login(usuario, password)
{
    return new Promise(
        function(resolve)
        {
            console.log('select * from '+ constantes.ESQUEMA_BD + '.usuario where usuario = ' +  conexion.dbConn.escape(usuario) + 
            ' and pass = ' +  conexion.dbConn.escape(password) );
            conexion.dbConn.query('select * from '+ constantes.ESQUEMA_BD + '.usuario where usuario = ' +  conexion.dbConn.escape(usuario) + 
                ' and pass = ' +  conexion.dbConn.escape(password) , 
            function(error, results, fields)
            {
                if (error) throw resolve(false);
                console.log(results.length);
                if (results.length <= 0)
                {
                  resolve(false);
                }
                resolve(true);
            }
            );
        });
}*/

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



module.exports.login = login;
module.exports.obtener_usuarios = obtener_usuarios;