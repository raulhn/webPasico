const constantes = require('../constantes.js');
const conexion = require('../conexion.js');

function registrar_preinscripcion(
    nombre,
    primer_apellido,
    segundo_apellido,
    dni,
    fecha_nacimiento,
    nombre_padre,
    primer_apellido_padre,
    segundo_apellido_padre,
    dni_padre,
    correo_electronico,
    telefono,
    municipio,
    provincia,
    direccion,
    numero,
    puerta,
    escalera,
    codigo_postal,
    instrumento,
    familia_instrumento,
    sucursal,
    curso, 
    horario, 
    tipo_inscripcion,
    instrumento2,
    familia_instrumento2,
    instrumento3,
    familia_instrumento3
)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
                () =>
                {
                    conexion.dbConn.query('insert into ' + constantes.ESQUEMA_BD + 
                            '.preinscripcion(nombre, primer_apellido, segundo_apellido, dni, fecha_nacimiento, nombre_padre, primer_apellido_padre, ' + 
                            'segundo_apellido_padre, dni_padre, correo_electronico, telefono, municipio, provincia, direccion, ' + 
                            'numero, puerta, escalera, codigo_postal, instrumento, familia_instrumento, sucursal, curso, horario, tipo_inscripcion' +
                            ', instrumento2, familia_instrumento2, instrumento3, familia_instrumento3) values(' + conexion.dbConn.escape(nombre) + ', ' + conexion.dbConn.escape(primer_apellido) + ', ' +
                            conexion.dbConn.escape(segundo_apellido) + ', ' + conexion.dbConn.escape(dni) + 
                            ', str_to_date(nullif(' + conexion.dbConn.escape(fecha_nacimiento) + ', \'\') , \'%Y-%m-%d\'), ' + conexion.dbConn.escape(nombre_padre) +
                            ', ' + conexion.dbConn.escape(primer_apellido_padre) + ', ' + conexion.dbConn.escape(segundo_apellido_padre) + ', ' +
                            conexion.dbConn.escape(dni_padre) + ', ' + conexion.dbConn.escape(correo_electronico) + ', ' + conexion.dbConn.escape(telefono) + 
                            ', ' + conexion.dbConn.escape(municipio) + ', ' + conexion.dbConn.escape(provincia) + ', ' + conexion.dbConn.escape(direccion) + ', '  +
                            conexion.dbConn.escape(numero) + ', ' + conexion.dbConn.escape(puerta) + ', ' + conexion.dbConn.escape(escalera) + 
                            ', ' + conexion.dbConn.escape(codigo_postal) + ', ' + conexion.dbConn.escape(instrumento) + ', ' 
                            + 'nullif(' +conexion.dbConn.escape(familia_instrumento) + ',\'\'), ' + conexion.dbConn.escape(sucursal) + 
                            ','+ conexion.dbConn.escape(curso) + ', ' + conexion.dbConn.escape(horario) + ',' + conexion.dbConn.escape(tipo_inscripcion) + 
                             ', ' + conexion.dbConn.escape(instrumento2) + ', '  + 'nullif(' +conexion.dbConn.escape(familia_instrumento2) + ',\'\'), ' +
                              conexion.dbConn.escape(instrumento3) + ', ' 
                            + 'nullif(' +conexion.dbConn.escape(familia_instrumento3) + ',\'\') '  + ')',
                        (error, results, fields) =>
                        {
                            if(error) {console.log(error); conexion.dbConn.rollback(); reject()}
                            else {conexion.dbConn.commit(); resolve();}
                        }
                    );

                }
            )
        }
    )
}

function obtener_preinscripciones()
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select * from ' + constantes.ESQUEMA_BD + '.preinscripcion',
                (error, results, fields) =>
                {
                    if(error) {console.log(error); reject();}
                    else {resolve(results)}
                });
        }
    )
}

function obtener_preincripciones_detalle(nid_preinscripcion)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select p.*, case p.sucursal ' +
                   ' when 1 then \'Torre Pacheco\' when 2 then \'Roldán\' when 3 then \'Balsicas\' when 4 then \'Dolores de Pacheco\' else \'\' end as nombre_sucursal ' +
                ' from ' + constantes.ESQUEMA_BD + '.preinscripcion p where nid_preinscripcion = ' +
                    conexion.dbConn.escape(nid_preinscripcion),
               (error, results, fields) =>
                {
                    if(error) {console.log(error); reject();}
                    else {resolve(results)}
                }
            )
        }
    )
}


module.exports.obtener_preinscripciones = obtener_preinscripciones;
module.exports.registrar_preinscripcion = registrar_preinscripcion;
module.exports.obtener_preincripciones_detalle = obtener_preincripciones_detalle;