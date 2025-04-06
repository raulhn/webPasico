const constantes = require('../constantes');
const conexion = require('../conexion');

function obtener_matriculas_asignaturas_alumno(nid_alumno, nid_curso) {
    return new Promise((resolve, reject) => {
        conexion.dbConn.query('select m.nid as nid_matricula, ' +
                              '       ma.nid as nid_matricula_asignatura, ' +
                              '       ma.nid_asignatura, ' +
                              '       m.nid_curso, ' +
                              '       ma.nid_matricula, ' +
                              '       concat(p.nombr, \' \', p.apellido1, \' \', p.apellido2) as nombre_profesor ' +
                              '       a.descripcion as nombre_asignatura ' +
                              '       ma.fecha_alta, ' +
                              '       ma.fecha_baja, ' +
                              ' from ' + constantes.ESQUEMA_BD + '.matricula m, ' +
                                         constantes.ESQUEMA_BD + '.matricula_asignatura ma, ' +
                                         constantes.ESQUEMA_BD + '.profesor_alumno_matricula pam, ' +
                                         constantes.ESQUEMA_BD + '.persona p, ' +
                                         constantes.ESQUEMA_BD + '.asignatura a ' +
                              ' where m.nid = ma.nid_matricula ' +
                              '   and ma.nid_asignatura = a.nid ' +
                              '   and m.nid_curso = ' + conexion.dbConn.escape(nid_curso) +
                              '   and m.nid_persona = ' + conexion.dbConn.escape(nid_alumno) +
                              '   and ma.nid = pam.nid_matricula_asignatura ',
            (error, results, fields) =>
            {
                if(error) {console.log('matricula_asignatura.js - obtener_matriculas_asignaturas_alumno - Error en la consulta: ' + error); reject(error);}
                else {
                    resolve(results);
                }
            }
        )
    }
    )
}



module.exports.obtener_matriculas_asignaturas_alumno = obtener_matriculas_asignaturas_alumno;

