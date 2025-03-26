const conexion = require('../conexion.js')
const constantes = require('../constantes.js')
const logicaAsignatura = require('./asignatura.js')
const curso = require('./curso.js')

function existeMatricula (nidPersona, nidCurso) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.query('select count(*) cont from ' + constantes.ESQUEMA_BD + '.matricula where nid_persona = ' +
        conexion.dbConn.escape(nidPersona) + ' and nid_curso = ' + conexion.dbConn.escape(nidCurso),
      (error, results, fields) => {
        if (error) { console.log(error); reject(new Error('Error no existe la matricula')) } else { resolve(results[0].cont > 0) }
      }
      )
    }
  )
}

function obtenerNidMatricula (nidPersona, nidCurso) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.query('select nid from ' + constantes.ESQUEMA_BD + '.matricula where nid_persona = ' +
        conexion.dbConn.escape(nidPersona) + ' and nid_curso = ' + conexion.dbConn.escape(nidCurso),
      (error, results, fields) => {
        if (error) { console.log(error); reject(new Error('Error al obtener matricula')) } else if (results.length < 1) {
          console.log('Matricula no encontrada')
          reject(new Error('Matricula no encontrada'))
        } else { resolve(results[0].nid) }
      }
      )
    }
  )
}

async function asyncRegistrarMatricula (nidPersona, nidCurso, resolve, reject) {
  const existe = await existeMatricula(nidPersona, nidCurso)
  if (!existe) {
    conexion.dbConn.beginTransaction(
      () => {
        conexion.dbConn.query('insert into ' + constantes.ESQUEMA_BD + '.matricula(nid_persona, nid_curso) values(' +
            conexion.dbConn.escape(nidPersona) + ', ' + conexion.dbConn.escape(nidCurso) + ')',
        (error, results, fields) => {
          if (error) { console.log(error); conexion.dbConn.rollback(); reject(new Error('Error al registrar la matricula')) } else { conexion.dbConn.commit(); resolve() }
        }
        )
      }
    )
  }
}

function registrarMatricula (nidPersona, nidCurso) {
  return new Promise(
    (resolve, reject) => {
      asyncRegistrarMatricula(nidPersona, nidCurso, resolve, reject)
    })
}

function actualizarMatricula (nidMatricula, nidPersona, nidCurso) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.beginTransaction(
        () => {
          conexion.dbConn.query('update ' + constantes.ESQUEMA_BD + '.matricula set nid_curso = ' + conexion.dbConn.escape(nidCurso) +
            ' where nid = ' + conexion.dbConn.escape(nidMatricula),
          (error, results, fields) => {
            if (error) { console.log(error); conexion.dbConn.rollback(); reject(new Error('Error al actualizar la matricula')) } else { conexion.dbConn.commit(); resolve() }
          }
          )
        }
      )
    }
  )
}

function obtenerMatriculas (nidPersona) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.query('select * from ' + constantes.ESQUEMA_BD + '.matricula where nid_persona = ' + conexion.dbConn.escape(nidPersona),
        (error, results, fields) => {
          if (error) { console.log(error); reject(new Error('Error al obtener las matriculas')) } else { resolve(results) }
        }
      )
    }
  )
}

function obtenerMatriculasAlumno (nidAlumno) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.query('select c.descripcion descripcion_curso, m.* from ' + constantes.ESQUEMA_BD + '.matricula m, ' +
        constantes.ESQUEMA_BD + '.curso c where m.nid_curso = c.nid and m.nid_persona = ' + conexion.dbConn.escape(nidAlumno) + ' order by ano desc',
      (error, results, fields) => {
        if (error) { console.log(error); reject(new Error('Error al obtener las matriculas')) } else { resolve(results) }
      }
      )
    }
  )
}

function obtenerMatricula (nidMatricula) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.query('select c.descripcion descripcion_curso, m.*, concat(nombre,  \' \', primer_apellido, \' \', segundo_apellido) nombre_alumno ' +
        ' from ' + constantes.ESQUEMA_BD + '.matricula m, ' +
        constantes.ESQUEMA_BD + '.persona p, ' + constantes.ESQUEMA_BD + '.curso c ' +
        'where m.nid_curso = c.nid and m.nid = ' + conexion.dbConn.escape(nidMatricula) +
        ' and p.nid = m.nid_persona',
      (error, results, fields) => {
        if (error) { console.log(error); reject(new Error('Error al obtener la matricula')) } else if (results.length < 1) {
          console.log('No se ha encontrado la matricula')
          reject(new Error('No se ha encontrado la matricula'))
        } else { resolve(results[0]) }
      }
      )
    }
  )
}

function obtenerAsignaturasMatricula (nidMatricula) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.query('select a.*, m.nid_persona nid_alumno, date_format(ma.fecha_alta, \'%Y-%m-%d\') fecha_alta, ' +
        ' date_format(ma.fecha_alta, \'%d-%m-%Y\') fecha_alta_local, date_format(ma.fecha_baja, \'%d-%m-%Y\') fecha_baja_local, ' +
        ' date_format(ma.fecha_baja, \'%Y-%m-%d\') fecha_baja, ma.nid nid_matricula_asignatura, a.descripcion nombre_asignatura, p.*, p.nid nid_profesor, ' +
        'concat(p.nombre, \' \', p.primer_apellido, \' \', p.segundo_apellido) nombre_profesor ' +
        'from ' + constantes.ESQUEMA_BD + '.matricula_asignatura ma, ' +
        constantes.ESQUEMA_BD + '.matricula m, ' +
        constantes.ESQUEMA_BD + '.asignatura a, ' +
        constantes.ESQUEMA_BD + '.persona p, ' +
        constantes.ESQUEMA_BD + '.profesor_alumno_matricula pam ' +
        'where ma.nid_asignatura = a.nid and ' + 'm.nid = ma.nid_matricula and ' + 'nid_matricula = ' +
        conexion.dbConn.escape(nidMatricula) + ' and ma.nid = pam.nid_matricula_asignatura and pam.nid_profesor = p.nid',
      (error, results, fields) => {
        if (error) { console.log('matricula.js - obtenerAsignaturasMatricula ->' + error); reject(new Error('Se ha producido un error al recuperar las matriculas')) } else { resolve(results) }
      }
      )
    }
  )
}

function obtenerAsignaturasMatriculaActivas (nidMatricula) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.query('select a.*, m.nid_persona nid_alumno, ma.*, a.descripcion nombre_asignatura, p.*, p.nid nid_profesor ' +
          'from ' + constantes.ESQUEMA_BD + '.matricula_asignatura ma, ' +
          constantes.ESQUEMA_BD + '.matricula m, ' +
          constantes.ESQUEMA_BD + '.asignatura a, ' +
          constantes.ESQUEMA_BD + '.persona p, ' +
          constantes.ESQUEMA_BD + '.profesor_alumno_matricula pam ' +
          'where ma.nid_asignatura = a.nid and ' + 'm.nid = ma.nid_matricula and ' + 'nid_matricula = ' +
          conexion.dbConn.escape(nidMatricula) + ' and ma.nid = pam.nid_matricula_asignatura and pam.nid_profesor = p.nid and ' +
          ' (ma.fecha_baja is null or ma.fecha_baja > sysdate()) ',
      (error, results, fields) => {
        if (error) { console.log(error); reject(new Error('Error al obtener las matriculas')) } else { resolve(results) }
      }
      )
    }
  )
}

function obtenerAsignaturasMatriculaActivasFecha (nidMatricula, fechaDesde, fechaHasta) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.query('select a.*, m.nid_persona nid_alumno, date_format(ma.fecha_alta, \'%Y-%m-%d\') fecha_alta, ' +
          ' date_format(ma.fecha_baja, \'%Y-%m-%d\') fecha_baja, ma.nid nid_matricula_asignatura, a.descripcion nombre_asignatura, p.*, p.nid nid_profesor ' +
          'from ' + constantes.ESQUEMA_BD + '.matricula_asignatura ma, ' +
          constantes.ESQUEMA_BD + '.matricula m, ' +
          constantes.ESQUEMA_BD + '.asignatura a, ' +
          constantes.ESQUEMA_BD + '.persona p, ' +
          constantes.ESQUEMA_BD + '.profesor_alumno_matricula pam ' +
          'where ma.nid_asignatura = a.nid and ' + 'm.nid = ma.nid_matricula and ' + 'nid_matricula = ' +
          conexion.dbConn.escape(nidMatricula) + ' and ma.nid = pam.nid_matricula_asignatura and pam.nid_profesor = p.nid and ' +
          ' (ma.fecha_baja is null or ma.fecha_baja >= ' +
          'str_to_date(nullif(' + conexion.dbConn.escape(fechaDesde) + ', \'\') , \'%Y-%m-%d\')) ' + ' and ' +
          ' ma.fecha_alta <= ' + 'str_to_date(nullif(' + conexion.dbConn.escape(fechaHasta) + ', \'\') , \'%Y-%m-%d\')',
      (error, results, fields) => {
        if (error) { console.log(error); reject(new Error('Error al obtener las asignaturas')) } else { resolve(results) }
      }
      )
    }
  )
}

function altaProfesorMatricula (nidMatriculaAsignatura, nidProfesor) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.query('insert into ' + constantes.ESQUEMA_BD + '.profesor_alumno_matricula(nid_profesor, nid_matricula_asignatura, fecha_alta) values(' +
          conexion.dbConn.escape(nidProfesor) + ', ' + conexion.dbConn.escape(nidMatriculaAsignatura) + ', sysdate())',
      (error, results, fields) => {
        if (error) { console.log(error); conexion.dbConn.rollback(); reject(new Error('Error al dar de alta al profesor')) } else { resolve() }
      }
      )
    }
  )
}

function addAsignatura (nidMatricula, nidAsignatura, nidProfesor) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.beginTransaction(
        () => {
          conexion.dbConn.query('insert into ' + constantes.ESQUEMA_BD + '.matricula_asignatura(nid_matricula, nid_asignatura, fecha_alta) values(' +
              conexion.dbConn.escape(nidMatricula) + ', ' + conexion.dbConn.escape(nidAsignatura) + ', sysdate())',
          async (error, results, fields) => {
            if (error) { console.log(error); conexion.dbConn.rollback(); reject(new Error('Error al añadir la asignatura')) } else {
              await altaProfesorMatricula(results.insertId, nidProfesor)
              conexion.dbConn.commit(); resolve()
            }
          }
          )
        }
      )
    }
  )
}

function eliminarAsignatura (nidMatricula, nidAsignatura) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.beginTransaction(
        () => {
          conexion.dbConn.query('delete from ' + constantes.ESQUEMA_BD + '.matricula_asignatura where nid_matricula = ' +
              conexion.dbConn.escape(nidMatricula) + ', ' + conexion.dbConn.escape(nidAsignatura),
          (error, results, fields) => {
            if (error) { console.log(error); conexion.dbConn.rollback(); reject(new Error('Error al eliminar la asignatura')) } else { conexion.dbConn.commit(); resolve() }
          }
          )
        }
      )
    }
  )
}

function darBajaAsignatura (nid, nidMatricula, nidAsignatura, fechaBaja) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.beginTransaction(
        () => {
          conexion.dbConn.query('update ' + constantes.ESQUEMA_BD + '.matricula_asignatura set fecha_baja = ' +
              'str_to_date(nullif(' + conexion.dbConn.escape(fechaBaja) + ', \'\') , \'%Y-%m-%d\') where nid_matricula = ' +
              conexion.dbConn.escape(nidMatricula) + ' and nid_asignatura = ' + conexion.dbConn.escape(nidAsignatura) +
              ' and nid = ' + conexion.dbConn.escape(nid),
          (error, results, fields) => {
            if (error) { console.log(error); conexion.dbConn.rollback(); reject(new Error('Error al dar de baja la asignatura')) } else { conexion.dbConn.commit(); resolve() }
          }
          )
        }
      )
    }
  )
}

function obtenerCursosProfesor (nidProfesor) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.query(
        'select distinct c.* ' +
          'from ' + constantes.ESQUEMA_BD + '.matricula_asignatura ma, ' +
          constantes.ESQUEMA_BD + '.profesor_alumno_matricula pam, ' +
          constantes.ESQUEMA_BD + '.matricula m, ' +
          constantes.ESQUEMA_BD + '.curso c ' +
          'where ma.nid = pam.nid_matricula_asignatura ' +
          ' and m.nid = ma.nid_matricula ' +
          ' and m.nid_curso = c.nid ' +
          ' and pam.nid_profesor = ' + conexion.dbConn.escape(nidProfesor),
        (error, results, fields) => {
          if (error) { console.log(error); reject(new Error('Error al obtener los cursos')) } else { resolve(results) }
        }
      )
    }
  )
}

function registrarPrecioManual (nidMatricula, precio, comentarioPrecio) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.query('update ' + constantes.ESQUEMA_BD + '.matricula set precio_manual = ' + conexion.dbConn.escape(precio) +
          ', comentario_precio_manual = ' + conexion.dbConn.escape(comentarioPrecio) +
          ' where nid = ' + conexion.dbConn.escape(nidMatricula),
      (error, results, fields) => {
        if (error) { console.log(error); reject(new Error('Error al registrar el precio')) } else { resolve() }
      }
      )
    }
  )
}

function obtenerMatriculasActivasProfesor (nidProfesor, nidAsignatura) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.query(' select pam.* from ' + constantes.ESQUEMA_BD + '.profesor_alumno_matricula pam, ' +
          constantes.ESQUEMA_BD + '.matricula_asignatura ma, ' +
          constantes.ESQUEMA_BD + '.matricula m ' +
          'where pam.nid_matricula_asignatura = ma.nid and ' +
          'ma.nid_matricula = m.nid and ' +
          ' m.nid_curso = (select max(nid_curso) from pasico_gestor.curso) and ' +
          ' pam.nid_profesor = ' + conexion.dbConn.escape(nidProfesor) + ' and ' +
          ' ma.nid_asignatura = ' + conexion.dbConn.escape(nidAsignatura),
      (error, results, fields) => {
        if (error) { console.log(error); reject(new Error('Error al obtener matriculas')) } else { resolve(results) }
      }
      )
    }
  )
}

async function asyncObtenerMatriculasActivas (resolve, reject) {
  const nidUltimoCurso = await curso.obtenerUltimoCurso()
  conexion.dbConn.query(' select pam.nid_matricula_asignatura, p.* from ' +
        constantes.ESQUEMA_BD + '.profesor_alumno_matricula pam, ' +
        constantes.ESQUEMA_BD + '.matricula_asignatura ma, ' +
        constantes.ESQUEMA_BD + '.matricula m, ' +
        constantes.ESQUEMA_BD + '.persona p ' +
        'where pam.nid_matricula_asignatura = ma.nid and ' +
        'm.nid_persona = p.nid and ' +
        'ma.nid_matricula = m.nid and ' +
        ' m.nid_curso = (select max(nid_curso) from pasico_gestor.curso) and ' +
        ' (ma.fecha_baja is null or ma.fecha_baja > sysdate()) ' + ' and ' +
        ' m.nid_curso = ' + conexion.dbConn.escape(nidUltimoCurso),
  (error, results, fields) => {
    if (error) { console.log(error); reject(new Error('Error al obtener matriculas')) } else { resolve(results) }
  })
}

function obtenerMatriculasActivas () {
  return new Promise(
    (resolve, reject) => {
      asyncObtenerMatriculasActivas(resolve, reject)
    }
  )
}

async function asyncObtenerPersonasConMatriculaActiva (resolve, reject) {
  const nidUltimoCurso = await curso.obtenerUltimoCurso()
  conexion.dbConn.query(' select p.nid, ma.nid_matricula from ' +
        constantes.ESQUEMA_BD + '.profesor_alumno_matricula pam, ' +
        constantes.ESQUEMA_BD + '.matricula_asignatura ma, ' +
        constantes.ESQUEMA_BD + '.matricula m, ' +
        constantes.ESQUEMA_BD + '.persona p ' +
        'where pam.nid_matricula_asignatura = ma.nid and ' +
        'm.nid_persona = p.nid and ' +
        'ma.nid_matricula = m.nid and ' +
        ' m.nid_curso = (select max(nid_curso) from pasico_gestor.curso) and ' +
        ' (ma.fecha_baja is null or ma.fecha_baja > sysdate()) ' + ' and ' +
        ' m.nid_curso = ' + conexion.dbConn.escape(nidUltimoCurso) + ' ' +
        'group by p.nid, ma.nid_matricula ',
  (error, results, fields) => {
    if (error) { console.log(error); reject(new Error('Error al obtener personas con matriculas activas')) } else { resolve(results) }
  })
}

function obtenerPersonasConMatriculaActiva () {
  return new Promise(
    (resolve, reject) => {
      asyncObtenerPersonasConMatriculaActiva(resolve, reject)
    }
  )
}

async function asyncObtenerPersonasMatriculaActivaFecha (fechaDesde, fechaHasta, resolve, reject) {
  const nidUltimoCurso = await curso.obtenerUltimoCurso()
  conexion.dbConn.query('select p.nid, ma.nid_matricula from ' +
        constantes.ESQUEMA_BD + '.profesor_alumno_matricula pam, ' +
        constantes.ESQUEMA_BD + '.matricula_asignatura ma, ' +
        constantes.ESQUEMA_BD + '.matricula m, ' +
        constantes.ESQUEMA_BD + '.persona p ' +
        'where pam.nid_matricula_asignatura = ma.nid and ' +
        'm.nid_persona = p.nid and ' +
        'ma.nid_matricula = m.nid and ' +
        ' m.nid_curso = (select max(nid_curso) from pasico_gestor.curso) and ' +
        ' (ma.fecha_baja is null or ma.fecha_baja >= ' +
        'str_to_date(nullif(' + conexion.dbConn.escape(fechaDesde) + ', \'\') , \'%Y-%m-%d\')) ' + ' and ' +
        ' ma.fecha_alta <= ' + 'str_to_date(nullif(' + conexion.dbConn.escape(fechaHasta) + ', \'\') , \'%Y-%m-%d\') and ' +
        ' m.nid_curso = ' + conexion.dbConn.escape(nidUltimoCurso) + ' ' +
        'group by p.nid, ma.nid_matricula ',
  (error, results, fields) => {
    if (error) { console.log(error); reject(new Error('Error al obtener personas con matriculas activas')) } else { resolve(results) }
  })
}

function obtenerPersonasMatriculaActivaFecha (fechaDesde, fechaHasta) {
  return new Promise(
    (resolve, reject) => {
      asyncObtenerPersonasMatriculaActivaFecha(fechaDesde, fechaHasta, resolve, reject)
    }
  )
}

function bajaProfesorAlumnoMatricula (nidProfesorAlumnoMatricula) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.query('update ' + constantes.ESQUEMA_BD + '.profesor_alumno_matricula set fecha_baja = sysdate() where nid = ' +
          conexion.dbConn.escape(nidProfesorAlumnoMatricula),
      (error, results, fields) => {
        if (error) { console.log(error); reject(new Error('Error al darr de baja al profesor')) } else { resolve() }
      }
      )
    }
  )
}

function altaProfesorAlumnoMatriculaBaja (nidProfesorSustituto, nidProfesorAlumnoMatricula) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.query('insert into ' + constantes.ESQUEMA_BD + '.profesor_alumno_matricula(nid_profesor, nid_matricula_asignatura, fecha_alta)' +
          ' select ' + conexion.dbConn.escape(nidProfesorSustituto) +
          ', nid_matricula_asignatura, sysdate() from pasico_gestor.profesor_alumno_matricula where nid = ' +
          conexion.dbConn.escape(nidProfesorAlumnoMatricula),
      (error, results, fields) => {
        if (error) { console.log(error); reject(new Error('EError al dar de alta al profesor')) } else { resolve() }
      }
      )
    }
  )
}

function obtenerProfesorAlumnoMatricula (nidMatriculaAsignatura) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.query('select * from ' + constantes.ESQUEMA_BD + '.profesor_alumno_matricula where nid_matricula_asignatura = ' +
          conexion.dbConn.escape(nidMatriculaAsignatura) +
          ' and fecha_baja is null',
      (error, results, fields) => {
        if (error) {
          console.log(error); reject(new Error('Error al obtener  el pofesor'))
        } else if (results.length < 1) { reject(new Error('Error al obtener el profesor')) } else { resolve(results[0]) }
      }
      )
    }
  )
}

function sustituirProfesorCursoActual (nidProfesor, nidProfesorSustituto, nidAsignatura) {
  return new Promise(
    (resolve, reject) => {
      conexion.dbConn.beginTransaction(
        async () => {
          try {
            const matriculasASustituir = await obtenerMatriculasActivasProfesor(nidProfesor, nidAsignatura)

            for (let i = 0; i < matriculasASustituir.length; i++) {
              await altaProfesorAlumnoMatriculaBaja(nidProfesorSustituto, matriculasASustituir[i].nid)
              await bajaProfesorAlumnoMatricula(matriculasASustituir[i].nid)
            }

            await logicaAsignatura.eliminarProfesor(nidAsignatura, nidProfesor)

            conexion.dbConn.commit()
            resolve()
          } catch (e) {
            console.log(e)
            conexion.dbConn.rollback()
            reject(new Error('Error al susituir al profesor'))
          }
        }
      )
    }
  )
}

async function asyncObtenerMatriculasActivasAsignatura (nidProfesor, nidAsignatura, resolve, reject) {
  const nidUltimoCurso = await curso.obtenerUltimoCurso()
  conexion.dbConn.query(' select pam.nid_matricula_asignatura, p.* from ' +
        constantes.ESQUEMA_BD + '.profesor_alumno_matricula pam, ' +
        constantes.ESQUEMA_BD + '.matricula_asignatura ma, ' +
        constantes.ESQUEMA_BD + '.matricula m, ' +
        constantes.ESQUEMA_BD + '.persona p ' +
        'where pam.nid_matricula_asignatura = ma.nid and ' +
        'm.nid_persona = p.nid and ' +
        'ma.nid_matricula = m.nid and ' +
        ' m.nid_curso = (select max(nid_curso) from pasico_gestor.curso) and ' +
        ' pam.nid_profesor = ' + conexion.dbConn.escape(nidProfesor) + ' and ' +
        ' ma.nid_asignatura = ' + conexion.dbConn.escape(nidAsignatura) + ' and ' +
        ' (ma.fecha_baja is null or ma.fecha_baja > sysdate()) ' + ' and ' +
        ' m.nid_curso = ' + conexion.dbConn.escape(nidUltimoCurso),
  (error, results, fields) => {
    if (error) {
      console.log(error)
      reject(new Error('Error la obtener las matriculas'))
    } else {
      resolve(results)
    }
  }
  )
}

function obtenerMatriculasActivasAsignatura (nidProfesor, nidAsignatura) {
  return new Promise(
    (resolve, reject) => {
      asyncObtenerMatriculasActivasAsignatura(nidProfesor, nidAsignatura, resolve, reject)
    }
  )
}

function sustituirProfesorAlumno (nidProfesor, nidMatriculaAsignatura, nidAsignatura) {
  return new Promise(
    (resolve, reject) => {
      try {
        conexion.dbConn.beginTransaction(
          async () => {
            try {
              const profesorAlumnoMatricula = await obtenerProfesorAlumnoMatricula(nidMatriculaAsignatura)
              await bajaProfesorAlumnoMatricula(profesorAlumnoMatricula.nid)
              await altaProfesorAlumnoMatriculaBaja(nidProfesor, profesorAlumnoMatricula.nid)

              conexion.dbConn.commit()
              resolve()
            } catch (error) {
              console.log(error)
              conexion.dbConn.rollback()
              reject(new Error('Error al sustituir al profesor'))
            }
          }
        )
      } catch (error) {
        console.log(error)
        reject(new Error('Error al sustitur al profesor'))
      }
    }
  )
}

function actualizarFechaAltaMatriculaAsignatura (nidMatriculaAsignatura, fechaAlta) {
  return new Promise(
    (resolve, reject) => {
      try {
        conexion.dbConn.beginTransaction(
          'update ' + constantes.ESQUEMA_BD + '.matricula_asignatura set fecha_alta = ' +
            'str_to_date(nullif(' + conexion.dbConn.escape(fechaAlta) + ', \'\') , \'%Y-%m-%d\') ' +
            ' where nid = ' + conexion.dbConn.escape(nidMatriculaAsignatura),
          (error, results, fields) => {
            if (error) {
              console.log(error); conexion.dbConn.rollback()
              reject(new Error('Error al actualizar la fecha de alta'))
            } else { conexion.dbConn.commit(); resolve() }
          }
        )
      } catch (error) {
        console.log(error)
        reject(new Error('Error al actualizar la fecha de alta'))
      }
    }
  )
}

function actualizarFechaBajaMatriculaAsignatura (nidMatriculaAsignatura, fechaBaja) {
  return new Promise(
    (resolve, reject) => {
      try {
        conexion.dbConn.beginTransaction(
          'update ' + constantes.ESQUEMA_BD + '.matricula_asignatura set fecha_baja = ' +
            'str_to_date(nullif(' + conexion.dbConn.escape(fechaBaja) + ', \'\') , \'%Y-%m-%d\') ' +
            ' where nid = ' + conexion.dbConn.escape(nidMatriculaAsignatura),
          (error, results, fields) => {
            if (error) {
              console.log(error); conexion.dbConn.rollback()
              reject(new Error('Error al actualizar la fecha de baja'))
            } else { conexion.dbConn.commit(); resolve() }
          }
        )
      } catch (error) {
        console.log(error)
        reject(new Error('Error al actualizar la fecha de baja'))
      }
    }
  )
}

module.exports.existeMatricula = existeMatricula
module.exports.obtenerNidMatricula = obtenerNidMatricula

module.exports.registrarMatricula = registrarMatricula
module.exports.actualizarMatricula = actualizarMatricula
module.exports.obtenerMatriculas = obtenerMatriculas

module.exports.obtenerMatriculasAlumno = obtenerMatriculasAlumno
module.exports.obtenerMatricula = obtenerMatricula
module.exports.obtenerAsignaturasMatricula = obtenerAsignaturasMatricula

module.exports.addAsignatura = addAsignatura
module.exports.eliminarAsignatura = eliminarAsignatura
module.exports.darBajaAsignatura = darBajaAsignatura

module.exports.obtenerCursosProfesor = obtenerCursosProfesor

module.exports.registrarPrecioManual = registrarPrecioManual

module.exports.sustituirProfesorCursoActual = sustituirProfesorCursoActual

module.exports.obtenerMatriculasActivasAsignatura = obtenerMatriculasActivasAsignatura

module.exports.obtenerMatriculasActivas = obtenerMatriculasActivas
module.exports.obtenerPersonasConMatriculaActiva = obtenerPersonasConMatriculaActiva
module.exports.obtenerPersonasMatriculaActivaFecha = obtenerPersonasMatriculaActivaFecha

module.exports.obtenerAsignaturasMatriculaActivas = obtenerAsignaturasMatriculaActivas
module.exports.obtenerAsignaturasMatriculaActivasFecha = obtenerAsignaturasMatriculaActivasFecha

module.exports.sustituirProfesorAlumno = sustituirProfesorAlumno

module.exports.actualizarFechaAltaMatriculaAsignatura = actualizarFechaAltaMatriculaAsignatura
module.exports.actualizarFechaBajaMatriculaAsignatura = actualizarFechaBajaMatriculaAsignatura
