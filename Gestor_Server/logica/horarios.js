const conexion = require('../conexion.js')
const constantes = require('../constantes.js')
const curso = require('./curso.js')


function registrar_horario_clase(hora_inicio, minutos_inicio, duracion_clase, num_clase, nid_horario, dia)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
                () =>
                {
                    var minutos_totales = Number(minutos_inicio) + (Number(hora_inicio) * 60);   
                    var minutos_comienzo_clase = Number(minutos_totales) + (Number(duracion_clase) * Number(num_clase));

                    var hora_comienzo_clase = Math.trunc(Number(minutos_comienzo_clase) / 60);
                    var minuto_comienzo_clase = Math.abs(Number(minutos_comienzo_clase)) % 60;



                    conexion.dbConn.query(
                        'insert into ' + constantes.ESQUEMA_BD + '.horario_clase(hora_inicio, minutos_inicio, duracion_clase, nid_horario, dia) ' +
                        ' values(' + conexion.dbConn.escape(hora_comienzo_clase) + ', ' + conexion.dbConn.escape(minuto_comienzo_clase) + ', ' +
                            conexion.dbConn.escape(duracion_clase) + ', ' + conexion.dbConn.escape(nid_horario) + ', ' + conexion.dbConn.escape(dia) + ')',
                        (error, results, fields) =>
                        {
                            if(error) {conexion.dbConn.rollback(); console.log(error); reject();}
                            else {conexion.dbConn.commit(); resolve();} 
                        }
                        
                    )
                }
            )
        }
    )
}


function eliminar_horario_clase(nid_horario_clase)
{
    return new Promise(
        (resolve, reject) =>
            {
                conexion.dbConn.beginTransaction(
                    () =>
                        {
                            conexion.dbConn.query("delete from " + constantes.ESQUEMA_BD + ".horario_clase where nid_horario_clase = " + 
                              conexion.dbConn.escape(nid_horario_clase),
                            (error, results, fields) =>
                            {
                                if(error) {console.log(error); conexion.dbConn.rollback(); reject()}
                                else {conexion.dbConn.commit(); resolve();}
                            })
                        }
                )
            }
    )
}

function obtener_horario(nid_horario)
{
    return new Promise(
        (resolve, reject) =>
            {
                conexion.dbConn.query("select * " +
                                      "from " + constantes.ESQUEMA_BD + ".horario_clases " +
                                      "where nid_horario = " + conexion.dbConn.escape(nid_horario),
                    (error, results, fields) =>
                        {
                            if(error) {console.log(error); reject();}
                            else {resolve(results)}
                        }
                )
            }
    )
}

function eliminar_horario_clase_no_commit(nid_horario_clase)
{
    return new Promise(
        (resolve, reject) =>
       {

            {
                conexion.dbConn.query("delete from " + constantes.ESQUEMA_BD + ".horario_clase where nid_horario_clase = " + 
                    conexion.dbConn.escape(nid_horario_clase),
                (error, results, fields) =>
                {
                    if(error) {console.log(error);  reject()}
                    else {resolve();}
                })
            }
        }
            
    )
}

function eliminar_horario(nid_horario)
{
    return new Promise(
        (resolve, reject) =>
            {
                conexion.dbConn.beginTransaction(
                    async () =>
                        {
                            let horario_clase = await obtener_horario(nid_horario);

                            for (i = 0; i < horario_clase.length; i++)
                            {
                                try
                                {
                                    eliminar_horario_clase_no_commit(horario_clase[i]['nid_horario_clase']);
                                } 
                                catch(error)
                                {
                                    console.log(error);
                                    reject();
                                }
                            }
                            
                            conexion.dbConn.query("delete from " + constantes.ESQUEMA_BD + "horario where nid_horario = " + conexion.dbConn.escape(nid_horario),
                            () =>
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

function registrar_horario(nid_profesor, nid_asignatura)
{
    return new Promise(
        async (resolve, reject) =>
        {
            let horario = await obtener_horarios(nid_profesor, nid_asignatura);

            if(horario.length > 0)
            {
                resolve(horario[0]['nid_horario']);
            }
            else
            {
                conexion.dbConn.beginTransaction(
                    async () =>
                    {
                        let nid_curso = await curso.obtener_ultimo_curso();

                        conexion.dbConn.query('insert into ' + constantes.ESQUEMA_BD + '.horario(nid_asignatura, nid_profesor, nid_curso)' +
                            ' values(' + conexion.dbConn.escape(nid_asignatura) + ', ' + conexion.dbConn.escape(nid_profesor) + ', ' + 
                            conexion.dbConn.escape(nid_curso) + ')',

                            (error, results, fields) =>
                            {
                                if(error) {conexion.dbConn.rollback(); console.log(error); reject();}
                                else {conexion.dbConn.commit(); results.insertId;}
                            }
                       )
                    });
            }
        }
        );

}

function crear_horario(dia, hora_inicio, minutos_inicio, hora_fin, minutos_fin, nid_asignatura, nid_profesor, duracion_clase)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
                async () =>
                {
                    let nid_horario = await registrar_horario(nid_profesor, nid_asignatura);

                    let total_minutos_inicio = Number(minutos_inicio) + (Number(hora_inicio) * 60);
                    let total_minutos_fin = Number(minutos_fin) + (Number(hora_fin) * 60);

                    total = Math.abs(total_minutos_fin - total_minutos_inicio);

                    num_clases = total / Number(duracion_clase);
                    
                    if (total % Number(duracion_clase) > 0)
                    {
                        conexion.dbConn.rollback();
                        reject('No coincide la duración de la clase con el rango de tiempo dado')
                    }
                    else
                    {
                        console.log('Número de clases ' + num_clases)
                        for (i = 0; i < num_clases; i++)
                        {
                            try
                            {
                                console.log(hora_inicio + ':' + minutos_inicio)
                                await registrar_horario_clase(hora_inicio, minutos_inicio, duracion_clase, i, nid_horario, dia);
                            }
                            catch(error)
                            {
                                conexion.dbConn.rollback();
                                console.log(error);
                                resolve();
                            }
                        }
                        conexion.dbConn.commit(); 
                        resolve(); 
                    }
                }
            )
        }
    )
}


function asignar_horario_clase(nid_horario_clase, nid_matricula_asignatura)
{
    return new Promise(
        (resolve, reject) =>
            {
                conexion.dbConn.beginTransaction(
                    () =>
                        {
                            conexion.dbConn.query("update " + constantes.ESQUEMA_BD + ".matricula_asignatura set nid_horario_clase = " +
                                conexion.dbConn.escape(nid_horario_clase) + " where nid = " + 
                                conexion.dbConn.escape(nid_matricula_asignatura),
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

function liberar_horario_clase(nid_matricula_asignatura)
{
    return new Promise(
        (resolve, reject) =>
            {
                conexion.dbConn.beginTransaction(
                    () =>
                        {
                            conexion.dbConn.query("update " + constantes.ESQUEMA_BD + ".matricula_asignatura set nid_horario_clase = null " +
                                "where nid = " + conexion.dbConn.escape(nid_matricula_asignatura),
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


function obtener_horarios(nid_profesor, nid_asignatura, nid_curso)
{
    return new Promise(
        async (resolve, reject) =>
            {
                let nid_ultimo_curso = await curso.obtener_ultimo_curso();

                conexion.dbConn.beginTransaction("select h.* from " + constantes.ESQUEMA_BD + ".horario h " +
                     "where (h.nid_profesor = " + conexion.dbConn.escape(nid_profesor) + " or nullif(" +  conexion.dbConn.escape(nid_profesor) + ", \'\') is null) " +
                      " and (h.nid_asignatura = " + conexion.dbConn.escape(nid_asignatura) + " or nullif(" + conexion.dbConn.escape(nid_asignatura) + ", \'\') is null) " +
                      " and (h.nid_curso = " + conexion.dbConn.escape(nid_curso) + " or nullif(" + conexion.dbConn.escape(nid_curso) + ", " + conexion.dbConn.escape(nid_ultimo_curso)
                        + ") is null) ",
                  (error, results, fields) =>
                    {
                        if(error) {console.log(error); reject();}
                        else {resolve(results)}
                    }
                )
            }
    )
}


function obtener_horarios_clase(nid_profesor, nid_asignatura, nid_curso)
{
    return new Promise(
        async (resolve, reject) =>
            {
                let nid_ultimo_curso = await curso.obtener_ultimo_curso();

                conexion.dbConn.beginTransaction("select hc.* from " + constantes.ESQUEMA_BD + ".horario h, " + constantes.ESQUEMA_BD +  ".horario_clase hc " +
                     "where h.nid_horario = hc.nid_horario " +
                      " and (h.nid_profesor = " + conexion.dbConn.escape(nid_profesor) + " or nullif(" +  conexion.dbConn.escape(nid_profesor) + ", \'\') is null) " +
                      " and (h.nid_asignatura = " + conexion.dbConn.escape(nid_asignatura) + " or nullif(" + conexion.dbConn.escape(nid_asignatura) + ", \'\') is null) " +
                      " and (h.nid_curso = " + conexion.dbConn.escape(nid_curso) + " or nullif(" + conexion.dbConn.escape(nid_curso) + ", " + conexion.dbConn.escape(nid_ultimo_curso)
                        + ") is null) ",
                  (error, results, fields) =>
                    {
                        if(error) {console.log(error); reject();}
                        else {resolve(results)}
                    }
                )
            }
    )
}

function obtener_horarios_asignados(nid_profesor, nid_asignatura, nid_curso)
{
    return new Promise(
        async (resolve, reject) =>
            {
                let nid_ultimo_curso = await curso.obtener_ultimo_curso();

                conexion.dbConn.beginTransaction("select ma.*, hc.hora_inicio, hc.minutos_inicio " +
                                                "from " + constantes.ESQUEMA_BD + ".horario h, " + constantes.ESQUEMA_BD +  ".horario_clase hc, " +
                                                        constantes.ESQUEMA_BD + ".matricula_asignatura ma " +
                                                "where h.nid_horario = hc.nid_horario " +
                                                 " and (h.nid_profesor = " + conexion.dbConn.escape(nid_profesor) + " or nullif(" +  conexion.dbConn.escape(nid_profesor) + ", \'\') is null) " +
                                                 " and (h.nid_asignatura = " + conexion.dbConn.escape(nid_asignatura) + " or nullif(" + conexion.dbConn.escape(nid_asignatura) + ", \'\') is null) " +
                                                 " and ma.nid_horario_clase = hc.nid_horario_clase" +
                                                 " and (h.nid_curso = " + conexion.dbConn.escape(nid_curso) + " or nullif(" + conexion.dbConn.escape(nid_curso) + ", " + conexion.dbConn.escape(nid_ultimo_curso)
                                                   + ") is null) ",
                  (error, results, fields) =>
                    {
                        if(error) {console.log(error); reject();}
                        else {resolve(results)}
                    }
                )
            }
    )
}

function obtener_horarios_profesor(nid_profesor)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query("select hc.* from " + constantes.ESQUEMA_BD + ".horario h, " + constantes.ESQUEMA_BD + ".horario_clase hc " +
                    "where h.nid_horario = hc.nid_horario " + 
                    " and h.nid_profesor = " + conexion.dbConn.escape(nid_profesor),
                (error, results, fields) =>
                {
                    if(error) {console.log(error); reject();}
                    else {resolve(results)}
                }
            )
        }
    )
}

function obtener_horario_clase_alumno(nid_alumno)
{
    return new Promise(
    (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction( "select hc.* " +
                                             " from " + constantes.ESQUEMA_BD +".horario_clase hc" +
                                             " where nid_horario_clase in ( " +
                                             "          select nid_horario_clase " +
                                             "          from " + constantes.ESQUEMA_BD +".matricula m, " + constantes.ESQUEMA_BD +".matricula_asignatura ma " +
                                             "          where m.nid_persona = " + conexion.dbConn.escape(nid_alumno) +
                                             "            and m.nid_curso = ( " +
                                             "                select nid   " +
                                             "                from " + constantes.ESQUEMA_BD +".curso c " +
                                             "                where c.ano = (select max(c2.ano) from " + constantes.ESQUEMA_BD +".curso c2)))",
              (error, results, fields) =>
                {
                    if(error) {console.log(error); reject();}
                    else {resolve(results)}
                }
            )
        }
)
}

function obtener_horario(nid_horario)
{
    return new Promise(
        (resolve, reject) =>
            {
                conexion.dbConn.beginTransaction("select h.* from " + constantes.ESQUEMA_BD + ".horario h " +
                     "where h.nid_horario = " + conexion.dbConn.escape(nid_horario) ,
                  (error, results, fields) =>
                    {
                        if(error) {console.log(error); reject();}
                        else {resolve(results)}
                    }
                )
            }
    )
}


function obtener_horario_clase(nid_horario)
{
    return new Promise(
        (resolve, reject) =>
            {
                conexion.dbConn.beginTransaction("select hc.* from " + constantes.ESQUEMA_BD + ".horario h, " + constantes.ESQUEMA_BD +  ".horario_clase hc " +
                     "where h.nid_horario = hc.nid_horario " +
                      " and h.nid_horario = " + conexion.dbConn.escape(nid_horario),
                  (error, results, fields) =>
                    {
                        if(error) {console.log(error); reject();}
                        else {resolve(results)}
                    }
                )
            }
    )
}

function obtener_horario_asignado(nid_horario)
{
    return new Promise(
        (resolve, reject) =>
            {
                conexion.dbConn.beginTransaction("select ma.* " +
                                                "from " + constantes.ESQUEMA_BD + ".horario h, " + constantes.ESQUEMA_BD +  ".horario_clase hc, " +
                                                        constantes.ESQUEMA_BD + ".matricula_asignatura ma " +
                                                "where h.nid_horario = hc.nid_horario " +
                                                 " and h.nid_profesor = " + conexion.dbConn.escape(nid_horario) + " and ma.nid_horario_clase = hc.nid_horario_clase",
                  (error, results, fields) =>
                    {
                        if(error) {console.log(error); reject();}
                        else {resolve(results)}
                    }
                )
            }
    )
}

function obtener_alumnos_horario_clase(nid_horario_clase)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction("select concat(ifnull(p.nif, ''), ' ', ifnull(p.nombre, ''), ' ', ifnull(p.primer_apellido, ''), ' ', ifnull(p.segundo_apellido, '')) etiqueta, p.*, " +
                                             " ma.nid nid_matricula_asignatura " + 
                                             " from " + constantes.ESQUEMA_BD +".persona p, " +
                                             "     " + constantes.ESQUEMA_BD +".matricula m, " +
                                             "     " + constantes.ESQUEMA_BD +".matricula_asignatura ma " +
                                             "where p.nid = m.nid_persona " +
                                             "  and m.nid = ma.nid_matricula " +
                                             "  and ma.nid_horario_clase = " + conexion.dbConn.escape(nid_horario_clase),
                (error, results, fields) =>
                {
                    if(error) {console.log(error); reject();}
                    else {resolve(results)}
                })
        }
    )
}


function obtener_alumnos_sin_asignar(nid_horario_clase)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query("select concat(ifnull(p.nif, ''), ' ', ifnull(p.nombre, ''), ' ', ifnull(p.primer_apellido, ''), ' ', ifnull(p.segundo_apellido, '')) etiqueta, " +
                                  " ma.nid nid_matricula_asignatura " +
                                  " from " + constantes.ESQUEMA_BD +".matricula m, " +
                                  "      " + constantes.ESQUEMA_BD +".persona p, " +
                                  "      " + constantes.ESQUEMA_BD +".matricula_asignatura ma, " +
                                  "      " + constantes.ESQUEMA_BD +".profesor_alumno_matricula pam " +
                                  " where ma.nid_matricula = m.nid " +
                                  "   and m.nid_persona = p.nid " +
                                  "   and pam.nid_matricula_asignatura = ma.nid " +
                                  "   and (ma.nid_asignatura, pam.nid_profesor, m.nid_curso) " +
                                  "       in (select h.nid_asignatura, h.nid_profesor, h.nid_curso " +
                                  "           from " + constantes.ESQUEMA_BD +".horario_clase hc, " +
                                  "                " + constantes.ESQUEMA_BD +".horario h " +
                                  "           where hc.nid_horario = h.nid_horario " +
                                  "             and hc.nid_horario_clase = " + conexion.dbConn.escape(nid_horario_clase)+ ") " +
                                  "   and ma.nid_horario_clase is null",
            (error, results, fields) =>
            {
                if(error) {console.log(error); reject();}
                else {resolve(results)}
            })
        }
    )
}

module.exports.registrar_horario_clase = registrar_horario_clase;
module.exports.crear_horario = crear_horario;

module.exports.asignar_horario_clase = asignar_horario_clase;
module.exports.liberar_horario_clase = liberar_horario_clase;
module.exports.eliminar_horario_clase = eliminar_horario_clase;
module.exports.eliminar_horario = eliminar_horario;

module.exports.obtener_horarios = obtener_horarios;
module.exports.obtener_horarios_clase = obtener_horarios_clase;
module.exports.obtener_horarios_asignados = obtener_horarios_asignados;

module.exports.obtener_horarios_profesor = obtener_horarios_profesor;
module.exports.obtener_horario_clase_alumno = obtener_horario_clase_alumno;
module.exports.obtener_horario = obtener_horario;
module.exports.obtener_horario_clase = obtener_horario_clase;
module.exports.obtener_horario_asignado = obtener_horario_asignado;

module.exports.obtener_alumnos_horario_clase = obtener_alumnos_horario_clase;
module.exports.obtener_alumnos_sin_asignar = obtener_alumnos_sin_asignar;