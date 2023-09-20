const conexion = require('../conexion.js')
const constantes = require('../constantes.js')

async function existe_nif(nif)
{
    return new Promise(
        (resolve, reject) =>
        {
            if (nif.length === 0)
            {
                resolve(false)
            }
            else{
                conexion.dbConn.query('select count(*) cont from ' + constantes.ESQUEMA_BD + '.persona where nif = ' + conexion.dbConn.escape(nif),
                  (error, results, fields) =>
                  {
                    if (error) {resolve(false)}
                    else{
                        resolve(results[0]['cont'] > 0)
                    }
                  }
                )
            }
        }
    )
}

async function existe_nid(nid_persona)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select count(*) cont from ' + constantes.ESQUEMA_BD + '.persona where nid = ' + conexion.dbConn.escape(nid_persona),
                (error, results, fields) =>
                {
                    if (error) {resolve(false)}
                    else{
                        resolve(results[0]['cont'] > 0)
                    }
                }
            )
        }
    )
}

function existe_persona(nombre, primer_apellido, segundo_apellido, fecha_nacimiento)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select count(*) cont from ' + constantes.ESQUEMA_BD + '.persona ' +
                    ' where ' +  constantes.ESQUEMA_BD + '.initcap(nombre) = ' + constantes.ESQUEMA_BD + '.initcap( ' +  conexion.dbConn.escape(nombre) + ') ' +
                    ' and ' +  constantes.ESQUEMA_BD + '.initcap(primer_apellido) = ' + constantes.ESQUEMA_BD + '.initcap( ' + conexion.dbConn.escape(primer_apellido) + ') ' +
                    ' and ' +  constantes.ESQUEMA_BD + '.initcap(segundo_apellido) = ' + constantes.ESQUEMA_BD + '.initcap( ' + conexion.dbConn.escape(segundo_apellido)  + ') ' +
                    ' and fecha_nacimiento = ' + 'str_to_date(nullif(' + conexion.dbConn.escape(fecha_nacimiento) + ', \'\') , \'%Y-%m-%d\')',
                (error, results, fields) =>
                {
                    if (error) {console.log(error); resolve(false)}
                    else{
                        resolve(results[0]['cont'] > 0)
                    }
                }
            )
        }
    )
}


function registrar_persona(nombre, primer_apellido, segundo_apellido, telefono, fecha_nacimiento, nif, correo_electronico)
{
    return new Promise(
        async (resolve, reject) =>
        {

            console.log('existe nif')
            let bExiste_nif = await existe_nif(nif);
            let bExiste_persona = await existe_persona(nombre, primer_apellido, segundo_apellido, fecha_nacimiento);
            if (!bExiste_nif && !bExiste_persona)
            {
                console.log('transaccion')
                conexion.dbConn.beginTransaction(
                    () =>
                    {  
                        conexion.dbConn.query('insert into ' +  constantes.ESQUEMA_BD + '.persona(nombre, primer_apellido, segundo_apellido, telefono, fecha_nacimiento, nif, correo_electronico) ' +
                                            ' values(' +  constantes.ESQUEMA_BD + '.initcap(' + conexion.dbConn.escape(nombre) + '), ' 
                                                       +  constantes.ESQUEMA_BD + '.initcap(' + conexion.dbConn.escape(primer_apellido) + '), ' 
                                                       +  constantes.ESQUEMA_BD + '.initcap(' + conexion.dbConn.escape(segundo_apellido) + '),'  +
                                            'cast(nullif(' + conexion.dbConn.escape(telefono) + ', \'\') as unsigned)'
                                            + ',' + 
                                            'str_to_date(nullif(' + conexion.dbConn.escape(fecha_nacimiento) + ', \'\') , \'%Y-%m-%d\')' + 
                                            ', ' + conexion.dbConn.escape(nif) + ', ' + conexion.dbConn.escape(correo_electronico) + ')',
                                            (error, results, fields) =>
                                            {
                                                if (error) {conexion.dbConn.rollback();  console.log(error); reject(error);}
                                                else {conexion.dbConn.commit(); console.log('Usuario registrado'); resolve(results.insertId); }
                                            }
                                            )
                    })
            }
            else
            {
                reject('La persona ya está registrada');
            }

        }
    )
}



function obtener_nid_persona(nif)
{
    return new Promise(
        async (resolve, reject) =>
        {
            bExiste = await existe_nif(nif)
            if(bExiste)
            {
                conexion.dbConn.query('select nid from ' + constantes.ESQUEMA_BD + '.persona where nif = ' + conexion.dbConn.escape(nif),
                    (error, results, fields) =>
                    {
                        if (error) {console.log(error); reject(error);}
                        else if(results.length < 1) {resolve('')}
                        else{
                            resolve(results[0]['nid']);
                        }
                    }
                )
            }
            else{
                resolve('')
            }
        }

    )
}

function obtener_padre(nid_persona)
{
    return new Promise(
        async (resolve, reject) =>
        {
            bExiste = await existe_nid(nid_persona);
            if(bExiste)
            {
                conexion.dbConn.query('select nid_padre from ' + constantes.ESQUEMA_BD + '.persona where nid = ' + conexion.dbConn.escape(nid_persona),
                    async (error, results, fields) =>
                    {
                        if (error) {console.log(error); reject(error);}
                        else if (results.length < 1) {reject('No encontrada_persona')}
                        else {
                            resolve(results[0]['nid_padre']);
                        }
                    }
                )
            }
            else
            {
                reject();
            }
        }
    )
}

function obtener_madre(nid_persona)
{
    return new Promise(
        async (resolve, reject) =>
        {
            bExiste = await existe_nid(nid_persona);
            if(bExiste)
            {
                conexion.dbConn.query('select nid_madre from ' + constantes.ESQUEMA_BD + '.persona where nid = ' + conexion.dbConn.escape(nid_persona),
                    async (error, results, fields) =>
                    {
                        if (error) {console.log(error); reject(error);}
                        else if (results.length < 1) {reject('No encontrada persona')}
                        else {
                            resolve(results[0]['nid_madre']);
                        }
                    }
                )
            }
            else
            {
                reject();
            }
        }
    )
}


function registrar_padre(nid_persona, nid_padre)
{
    return new Promise(
        async (resolve, reject) =>
        {
            bExiste = await existe_nid(nid_persona);

            if(bExiste)
            {
                conexion.dbConn.beginTransaction(
                    () =>
                    {
                        conexion.dbConn.query('update ' + constantes.ESQUEMA_BD + '.persona set nid_padre = nullif(' 
                            + conexion.dbConn.escape(nid_padre) + ', \'\')' +
                            ' where nid = ' + conexion.dbConn.escape(nid_persona),
                            (error, results, fields) =>
                            {
                                if(error) {console.log(error); conexion.dbConn.rollback(); reject(error)}
                                else{
                                    resolve();
                                }
                            }
                        )
                    }
                )
            }
            else
            {
                reject('Error al registrar el padre')
            }
        }
    )
}


function registrar_madre(nid_persona, nid_madre)
{
    return new Promise(
        async (resolve, reject) =>
        {
            bExiste = await existe_nid(nid_persona);

            if(bExiste)
            {
                conexion.dbConn.beginTransaction(
                    () =>
                    {
                        conexion.dbConn.query('update ' + constantes.ESQUEMA_BD + '.persona set nid_madre =  nullif(' +
                             conexion.dbConn.escape(nid_madre) + ', \'\')' +
                            ' where nid = ' + conexion.dbConn.escape(nid_persona),
                            (error, results, fields) =>
                            {
                                if(error) {console.log(error); conexion.dbConn.rollback(); reject(error)}
                                else{
                                    resolve();
                                }
                            }
                        )
                    }
                )
            }
            else
            {
                reject('Error al registrar la madre')
            }
        }
    )
}


function obtener_personas()
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select concat(p.nif, \' \',  p.nombre, \' \', p.primer_apellido, \' \' , p.segundo_apellido) etiqueta, p.* from ' + constantes.ESQUEMA_BD + '.persona p', 
              (error, results, fields) =>
              {
                if(error) {console.log(error);  reject();}
                else if (results.length < 1) {reject();}
                else {
                    resolve(results);
                }
              }
            )
        }
    )
}

function obtener_todas_personas()
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select p.* from ' + constantes.ESQUEMA_BD + '.persona p', 
              (error, results, fields) =>
              {
                if(error) {console.log(error);  reject();}
                else if (results.length < 1) {reject();}
                else {
                    resolve(results);
                }
              }
            )
        }
    )
}

function obtener_persona(nid)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select concat(p.nif, \' \',  p.nombre, \' \', p.primer_apellido, \' \' , p.segundo_apellido) etiqueta, p.* from ' 
                                        + constantes.ESQUEMA_BD + '.persona p where nid = ' + conexion.dbConn.escape(nid),
            (error, results, fields) =>
            {
                if(error) {console.log('Error'); console.log(error); reject(error);}
                else if (results.length < 1) {reject('No se ha encontrado la persona')}
                else {console.log('Obtenido'); console.log(results[0]); resolve(results[0])}
            }
            )
        }
    )
}

function actualizar_persona(nid, nif, nombre, primer_apellido, segundo_apellido, telefono, fecha_nacimiento, correo_electronico)
{
    return new Promise(
        (resolve, reject) =>
        {

            conexion.dbConn.beginTransaction(
                async () =>
                {
                    bExistePersona = await existe_nid(nid);
                    if(bExistePersona)
                    {
                        conexion.dbConn.query('update ' + constantes.ESQUEMA_BD + '.persona set' +
                            ' nif = ' + conexion.dbConn.escape(nif) +
                            ', nombre = ' +  constantes.ESQUEMA_BD + '.initcap(' + conexion.dbConn.escape(nombre) + ')' +
                            ', primer_apellido = ' +  constantes.ESQUEMA_BD + '.initcap(' + conexion.dbConn.escape(primer_apellido) + ')' +
                            ', segundo_apellido = ' +  constantes.ESQUEMA_BD + '.initcap(' + conexion.dbConn.escape(segundo_apellido) + ')' +
                            ', telefono = cast(nullif(' +  conexion.dbConn.escape(telefono) + ', \'\') as unsigned)' +
                            ', fecha_nacimiento = str_to_date(nullif(' + conexion.dbConn.escape(fecha_nacimiento) + ', \'\') , \'%Y-%m-%d\')'  +
                            ', correo_electronico = ' + conexion.dbConn.escape(correo_electronico) +
                            ' where nid = ' + conexion.dbConn.escape(nid),
                            (error, results, fields) => 
                            {
                                if(error){console.log(error); conexion.dbConn.rollback(); resolve(false)}
                                else{conexion.dbConn.commit(); resolve(true)}
                            }

                        )
                    }
                    else
                    {
                        resolve(false);
                    }
                }
            )
        }
    )
}

function registrar_forma_pago(nid_titular, iban)
{
    return new Promise(
        (resolve, reject)  =>
        {
            conexion.dbConn.beginTransaction(
                async () =>
                {
                    bExistePersona = await existe_nid(nid_titular);
                    if(bExistePersona)
                    {
                        conexion.dbConn.query('insert into ' + constantes.ESQUEMA_BD + '.forma_pago(nid_titular, iban) values(' +
                                conexion.dbConn.escape(nid_titular) + ', ' + conexion.dbConn.escape(iban) + ')',
                            (error, results, fields) =>
                            {
                                if (error) {console.log(error); conexion.dbConn.rollback(); reject()}
                                else {conexion.dbConn.commit(); resolve()}
                            }
                        )
                    }
                }
            )
        }
    )
}

function obtener_forma_pago(nid_titular)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select concat(p.nombre, \' \', p.primer_apellido, \' \', p.segundo_apellido, \' - \', iban) etiqueta, fp.nid from ' + 
                    constantes.ESQUEMA_BD + '.forma_pago fp, ' + constantes.ESQUEMA_BD + '.persona p where fp.nid_titular = p.nid and fp.nid_titular = ' + 
                    conexion.dbConn.escape(nid_titular),
                (error, results, fields) =>
                {
                    if(error) {console.log(error); reject();}
                    else {resolve(results);}
                }
            )
        }
    )
}

function obtener_pago_persona(nid_titular)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select nid_forma_pago from ' 
                    + constantes.ESQUEMA_BD + '.persona p where p.nid = ' + 
                    conexion.dbConn.escape(nid_titular),
                (error, results, fields) =>
                {
                    if(error) {console.log(error); reject();}
                    else {resolve(results[0]);}
                }
            )
        }
    )
}


function obtener_formas_pago()
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select concat(p.nombre, \' \', p.primer_apellido, \' \', p.segundo_apellido, \' - \', iban) etiqueta, fp.nid from ' 
                    + constantes.ESQUEMA_BD + '.forma_pago fp, ' + constantes.ESQUEMA_BD + '.persona p ' +
                    'where fp.nid_titular = p.nid'
                ,
                (error, results, fields) =>
                {
                    if(error) {console.log(error); reject();}
                    else {resolve(results);}
                }
            )
        }
    )
}

function asociar_pago_persona(nid_persona, nid_forma_pago)
{
    return new  Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
                () =>
                {
                    conexion.dbConn.query('update ' + constantes.ESQUEMA_BD + '.persona set nid_forma_pago = ' + conexion.dbConn.escape(nid_forma_pago) +
                            ' where nid = ' + conexion.dbConn.escape(nid_persona),
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

module.exports.registrar_persona = registrar_persona
module.exports.actualizar_persona = actualizar_persona

module.exports.existe_nif = existe_nif
module.exports.existe_nid = existe_nid
module.exports.obtener_nid_persona = obtener_nid_persona

module.exports.obtener_padre = obtener_padre;
module.exports.obtener_madre = obtener_madre;

module.exports.registrar_padre = registrar_padre;
module.exports.registrar_madre = registrar_madre;

module.exports.obtener_personas = obtener_personas
module.exports.obtener_todas_personas = obtener_todas_personas;
module.exports.obtener_persona = obtener_persona

module.exports.registrar_forma_pago = registrar_forma_pago;
module.exports.obtener_forma_pago = obtener_forma_pago;
module.exports.obtener_pago_persona = obtener_pago_persona;
module.exports.obtener_formas_pago = obtener_formas_pago;
module.exports.asociar_pago_persona = asociar_pago_persona;