const constantes = require('../constantes.js');
const conexion = require('../conexion.js');
const componente = require('../componente.js')


function obtener_elementos_carusel(id_componente)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select * from ' + constantes.ESQUEMA_BD + '.elemento_carusel where nid_componente = ' + 
                                  conexion.dbConn.escape(id_componente),
                (error, results, fields) =>
                {
                    if(error) {console.log(error); reject();}
                    else {resolve(results);}
                }
            )
        }
    )
}

function obtener_componente_carusel(id_componente)
{
    return new Promise(
        async (resolve, reject) =>
        {
          bExiste = await componente.existe_componente(id_componente);
          if(!bExiste)
          {
            reject();
          }
          else{
            conexion.dbConn.query('select nid_componente, elementos_simultaneos from ' + constantes.ESQUEMA_BD + '.componente_carusel where nid_componente = ' +
                                 conexion.dbConn.escape(id_componente),
                (error, results, fields) =>
                {
                    if(error) {console.log('error'); console.log(error); reject();}
                    else{console.log('resolve'); resolve(results);}
                }              
                )
          }
        }
    )
}

module.exports.obtener_elementos_carusel = obtener_elementos_carusel;
module.exports.obtener_componente_carusel = obtener_componente_carusel;