const conexion = require('../conexion.js')
const constantes = require('../constantes.js')


function existe_matricula(nid_persona, nid_curso)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select count(*) cont from ' + constantes.ESQUEMA_BD + '.matricula where nid_persona = ' +
                    conexion.dbConn.escape(nid_persona) + ' and nid_curso = ' + conexion.dbConn.escape(nid_curso),
                (error, results, fields) =>
                {
                    if(error) {console.log(error); reject()}
                    else {resolve(results[0]['cont'] > 0)}
                }
            )
        }
    )
}

function obtener_nid_matricula(nid_persona, nid_curso)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select nid from ' + constantes.ESQUEMA_BD + '.matricula where nid_persona = ' + 
                    conexion.dbConn.escape(nid_persona) + ' and nid_curso = ' + conexion.dbConn.escape(nid_curso),
                (error, results, fields) =>
                {
                    if(error) {console.log(error); reject();}
                    else if(results.length < 1) {console.log('Matricula no encontrada'); reject('Matricula no encontrada')}
                    else {resolve(results[0]['nid'])}
                }        
            ) 
        }
    )
}


function registrar_matricula(nid_persona, nid_curso)
{
    return new Promise(
        async (resolve, reject) =>
        {
            bExiste = await existe_matricula(nid_persona, nid_curso);
            if (!bExiste)
            {
                conexion.dbConn.beginTransaction(
                    () =>
                    {
                        conexion.dbConn.query('insert into ' + constantes.ESQUEMA_BD + '.matricula(nid_persona, nid_curso) values('
                                + conexion.dbConn.escape(nid_persona) + ', ' + conexion.dbConn.escape(nid_curso) + ')',
                            (error, results, fields) =>
                            {
                                if(error) {console.log(error); conexion.dbConn.rollback(); reject()}
                                else {conexion.dbConn.commit(); resolve()}
                            }
                        );
                    }
                )
            }
        }
    );
}

function actualizar_matricula(nid_matricula, nid_persona, nid_curso)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
                () =>
                {
                    conexion.dbConn.query('update ' + constantes.ESQUEMA_BD + '.matricula set nid_curso = ' + conexion.dbConn.escape(nid_curso) +
                            ' where nid = ' + conexion.dbConn.escape(nid_matricula),
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

function obtener_matriculas(nid_persona)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select * from ' + constantes.ESQUEMA_BD + '.matricula where nid_persona = ' + conexion.dbConn.escape(nid_persona),
                (error, results, fields) =>
                {
                    if(error) {console.log(error); reject();}
                    else {resolve(results);}
                }
            )
        }
    )
}

function obtener_alumnos_asignaturas(nid_curso, nid_asignatura)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select  p.*, ma.nid_matricula from ' + constantes.ESQUEMA_BD + '.matricula_asignatura ma, '+ constantes.ESQUEMA_BD +
                   '.persona p, ' + constantes.ESQUEMA_BD +'.matricula m where p.nid = m.nid_persona and ma.nid_matricula = m.nid and m.nid_curso = ' + 
                    conexion.dbConn.escape(nid_curso) + ' and ma.nid_asignatura = ' + conexion.dbConn.escape(nid_asignatura),
                (error, results, fields) =>
                {
                    if(error) {console.log(error); reject();}
                    else {console.log('select  p.*, ma.nid_matricula from ' + constantes.ESQUEMA_BD + '.matricula_asignatura ma, '+ constantes.ESQUEMA_BD +
                    '.persona p, ' + constantes.ESQUEMA_BD +'.matricula m where p.nid = m.nid_persona and ma.nid_matricula = m.nid and m.nid_curso = ' + 
                     conexion.dbConn.escape(nid_curso) + ' and ma.nid_asignatura = ' + conexion.dbConn.escape(nid_asignatura)); console.log(results); resolve(results)}
                }   
            )
        }
    )
}

function obtener_alumnos_asignaturas_alta(nid_curso, nid_asignatura)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select  p.*, ma.nid_matricula from ' + constantes.ESQUEMA_BD + '.matricula_asignatura ma, '+ constantes.ESQUEMA_BD +
                   '.persona p, ' + constantes.ESQUEMA_BD +'.matricula m where p.nid = m.nid_persona and ma.nid_matricula = m.nid and m.nid_curso = ' + 
                    conexion.dbConn.escape(nid_curso) + ' and ma.nid_asignatura = ' + conexion.dbConn.escape(nid_asignatura) + 
                    ' and (fecha_baja is null or fecha_baja >= sysdate())',
                (error, results, fields) =>
                {
                    if(error) {console.log(error); reject();}
                    else {resolve(results)}
                }   
            )
        }
    )
}

function obtener_alumnos_asignaturas_baja(nid_curso, nid_asignatura)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select  p.*, ma.nid_matricula from ' + constantes.ESQUEMA_BD + '.matricula_asignatura ma, '+ constantes.ESQUEMA_BD +
                    '.persona p, ' + constantes.ESQUEMA_BD +'.matricula m where p.nid = m.nid_persona and ma.nid_matricula = m.nid and m.nid_curso = ' + 
                    conexion.dbConn.escape(nid_curso) + ' and ma.nid_asignatura = ' + conexion.dbConn.escape(nid_asignatura) + 
                    ' and  fecha_baja < sysdate()',
                (error, results, fields) =>
                {
                    if(error) {console.log(error); reject();}
                    else {resolve(results)}
                }   
            )
        }
    )
}

function obtener_alumnos_cursos_alta(nid_curso)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query(
                'select p.* ' +
                'from ' + constantes.ESQUEMA_BD + '.persona p, ' + constantes.ESQUEMA_BD + '.matricula m ' +
                'where p.nid = m.nid_persona ' + 
                'and m.nid_curso = ' + conexion.dbConn.escape(nid_curso) +
                ' and exists (select ma.* ' +
                                'from ' + constantes.ESQUEMA_BD + '.matricula_asignatura ma ' +
                                'where ma.nid_matricula = m.nid ' +
                                    'and (ma.fecha_baja is null or ma.fecha_baja > sysdate()))',
            (error, results, fields) =>
            {
                if(error) {console.log(error), reject();}
                else {resolve(results)}
            }
            )
        }
    )
}

function obtener_alumnos_cursos_baja(nid_curso)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query(
                'select p.* ' +
                'from ' + constantes.ESQUEMA_BD + '.persona p, ' + constantes.ESQUEMA_BD + '.matricula m ' +
                'where p.nid = m.nid_persona ' + 
                'and m.nid_curso = ' + conexion.dbConn.escape(nid_curso) +
                ' and not exists (select ma.* ' +
                                'from ' + constantes.ESQUEMA_BD + '.matricula_asignatura ma ' +
                                'where ma.nid_matricula = m.nid ' +
                                    'and (ma.fecha_baja is null or ma.fecha_baja > sysdate()))',
            (error, results, fields) =>
            {
                if(error) {console.log(error), reject();}
                else {resolve(results)}
            }
            )
        }
    )
}

function obtener_alumnos_cursos(nid_curso)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select distinct p.*from ' + constantes.ESQUEMA_BD + '.matricula_asignatura ma, ' + constantes.ESQUEMA_BD +
            '.persona p, ' + constantes.ESQUEMA_BD + '.matricula m where p.nid = m.nid_persona and ma.nid_matricula = m.nid and m.nid_curso = ' +
            conexion.dbConn.escape(nid_curso) ,
            (error, results, fields) =>
            {
                if(error) {console.log(error), reject();}
                else {resolve(results)}
            }
            )
        }
    )
}

function obtener_alumnos_curso_actual()
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select distinct p.* from ' + constantes.ESQUEMA_BD + '.matricula_asignatura ma, ' + constantes.ESQUEMA_BD +
            '.persona p, ' + constantes.ESQUEMA_BD + '.matricula m where p.nid = m.nid_persona and ma.nid_matricula = m.nid and m.nid_curso = ' +
            '(select nid from ' + constantes.ESQUEMA_BD + '.curso where ano = (select max(ano) from ' + constantes.ESQUEMA_BD + '.curso))' 
             + ' and (fecha_baja is null or fecha_baja >= sysdate())',
            (error, results, fields) =>
            {
                if(error) {console.log(error), reject();}
                else {resolve(results)}
            }
            )
        }
    )
}

function obtener_matriculas_alumno(nid_alumno)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select c.* from ' + constantes.ESQUEMA_BD + '.matricula m, ' +
                    constantes.ESQUEMA_BD + '.curso c where m.nid_curso = c.nid and m.nid_persona = ' + conexion.dbConn.escape(nid_alumno) + ' order by ano desc',
                (error, results, fields) =>
                {
                    if (error) {console.log(error); reject();}
                    else {resolve(results)}
                }        
            )
        }
    )
}

function obtener_asignaturas_matricula(nid_matricula)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select a.* from ' + constantes.ESQUEMA_BD + '.matricula_asignatura ma, ' + 
                    constantes.ESQUEMA_BD + '.asignatura a where ma.nid_asignatura = a.nid and nid_matricula = ' + 
                    conexion.dbConn.escape(nid_matricula) ,
                (error, results, fields) =>
                {
                    if(error) {console.log(error); reject();}
                    else {resolve(results)}
                }
            )
        }
    )
}

function add_asignatura(nid_matricula, nid_asignatura, nid_profesor)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
                () =>
                {
                    conexion.dbConn.query('insert into ' + constantes.ESQUEMA_BD + '.matricula_asignatura(nid_matricula, nid_asignatura, fecha_alta, nid_profesor) values(' + 
                            conexion.dbConn.escape(nid_matricula) + ', ' + conexion.dbConn.escape(nid_asignatura) + ', sysdate(), '
                             +  conexion.dbConn.escape(nid_profesor) + ')',
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

function eliminar_asignatura(nid_matricula, nid_asignatura)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
                () =>
                {
                    conexion.dbConn.query('delete from ' + constantes.ESQUEMA_BD + '.matricula_asignatura where nid_matricula = ' +
                            conexion.dbConn.escape(nid_matricula) + ', ' + conexion.dbConn.escape(nid_asignatura),
                        (error, results, fields) =>
                        {
                            if(error) {console.log(error); conexion.dbConn.rollback(); reject()}
                            else {conexion.dbConn.commit(); resolve();}
                        }
                    )
                }
            )
        }
    )
}

function dar_baja_asignatura(nid_matricula, nid_asignatura, fecha_baja)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.beginTransaction(
                () =>
                {
                    conexion.dbConn.query('update ' + constantes.ESQUEMA_BD + '.matricula_asignatura set fecha_baja = ' +
                            'str_to_date(nullif(' + conexion.dbConn.escape(fecha_baja) + ', \'\') , \'%Y-%m-%d\') where nid_matricula = ' +
                            conexion.dbConn.escape(nid_matricula) + ' and nid_asignatura = ' + conexion.dbConn.escape(nid_asignatura),
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


module.exports.existe_matricula = existe_matricula;
module.exports.obtener_nid_matricula = obtener_nid_matricula;

module.exports.registrar_matricula = registrar_matricula;
module.exports.actualizar_matricula = actualizar_matricula;
module.exports.obtener_matriculas = obtener_matriculas;

module.exports.obtener_alumnos_asignaturas = obtener_alumnos_asignaturas;
module.exports.obtener_alumnos_asignaturas_alta = obtener_alumnos_asignaturas_alta;
module.exports.obtener_alumnos_asignaturas_baja = obtener_alumnos_asignaturas_baja;

module.exports.obtener_alumnos_cursos = obtener_alumnos_cursos;
module.exports.obtener_alumnos_cursos_alta = obtener_alumnos_cursos_alta;
module.exports.obtener_alumnos_cursos_baja = obtener_alumnos_cursos_baja;

module.exports.obtener_alumnos_curso_actual = obtener_alumnos_curso_actual;

module.exports.obtener_matriculas_alumno = obtener_matriculas_alumno;
module.exports.obtener_asignaturas_matricula = obtener_asignaturas_matricula;

module.exports.add_asignatura = add_asignatura;
module.exports.eliminar_asignatura = eliminar_asignatura;
module.exports.dar_baja_asignatura = dar_baja_asignatura;