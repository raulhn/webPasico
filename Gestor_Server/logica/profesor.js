const conexion = require('../conexion');
const constantes = require('../constantes');

function esAlumnoProfesor(nid_alumno, nid_profesor, nid_curso) {
    return new Promise((resolve, reject) => {
        conexion.dbConn.query('select count(*) as num ' +
                              ' from ' + constantes.ESQUEMA_BD + '.matricula m, ' +
                                         constantes.ESQUEMA_BD + '.matricula_asignatura ma, ' +   
                                         constantes.ESQUEMA_BD + '.profesor_alumno_matricula pam ' +
                              ' where m.nid = ma.nid_matricula ' +
                              '   and ma.nid = pam.nid_matricula_asignatura ' +
                              '   and m.nid_curso = ' + conexion.dbConn.escape(nid_curso) +
                              '   and pam.nid_profesor = ' + conexion.dbConn.escape(nid_profesor) +
                              '   and m.nid_persona = ' + conexion.dbConn.escape(nid_alumno),
            (error, results, fields) =>
            {
                if(error) {console.log('profesor.js - esAlumnoProfesor - Error en la consulta: ' + error); reject(error);}
                else {
                    if(results[0].num > 0) resolve(true);
                    else resolve(false);
                }
            }
        )
    }
    )
}

module.exports.esAlumnoProfesor = esAlumnoProfesor;