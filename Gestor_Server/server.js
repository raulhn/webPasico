var express = require('express');
const session = require('express-session');
var cors = require('cors');
var app = express();
const https = require('https');
const PORT = 8080;

var bodyParser = require('body-parser');
var constantes = require('./constantes.js');

var servlet_usuario = require('./servlets/servlet_usuario');
var servlet_persona = require('./servlets/servlet_persona.js');
var servlet_musico = require('./servlets/servlet_musico.js');
var servlet_socio = require('./servlets/servlet_socios.js');
var servlet_asignatura = require('./servlets/servlet_asignatura.js');
var servlet_curso = require('./servlets/servlet_curso.js');
var servlet_matricula = require('./servlets/servlet_matricula.js');
var servlet_preinscripciones = require('./servlets/servlet_preinscripcion.js')
var servlet_direcciones = require('./servlets/servlet_direccion.js');
var servlet_remesa = require('./servlets/servlet_remesa.js');
var servlet_parametros = require('./servlets/servlet_parametros.js');
var servlet_horarios = require('./servlets/servlet_horarios.js');
var servlet_asistencia = require('./servlets/servlet_asistencia.js');
var servlet_evaluacion = require('./servlets/servlet_evaluacion.js')

var fs = require('fs');

var conexion = require('./conexion.js');
var sesion_config = require('./config/sesion.json');

app.use(cors({origin: ["https://localhost", "https://pasico.ddns.net"], credentials: true}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session(sesion_config));

app.get('/', 
(req, res) =>
{
    return res.status(200).send({error: true, message: 'Hola mundo'})
}
);

/** Usuarios **/
app.post('/login', servlet_usuario.login);
app.get('/logueado', servlet_usuario.logueado);
app.get('/logout', servlet_usuario.logout);
app.post('/registrar', servlet_usuario.registrar_usuario);
app.get('/obtener_usuarios', servlet_usuario.obtener_usuarios);
app.post('/actualiza_password', servlet_usuario.actualizar_password);

/** Personas **/
app.get('/obtener_personas', servlet_persona.obtener_personas);
app.post('/actualizar_persona', servlet_persona.actualizar_persona);
app.get('/obtener_persona/:nid', servlet_persona.obtener_persona);
app.post('/registrar_persona', servlet_persona.registrar_persona);
app.get('/obtener_ficha_persona/:nid_persona', servlet_persona.obtener_ficha_persona);
app.get('/obtener_personas/:tipo', servlet_persona.obtener_personas_tipo);

app.get('/obtener_personas_apellidos/:primer_apellido/:segundo_apellido', servlet_persona.obtener_persona_apellidos);
app.get('/obtener_personas_apellidos/:primer_apellido', servlet_persona.obtener_persona_apellido);
app.get('/valida_nif/:nif', servlet_persona.valida_nif);

/** Direcciones **/
app.post('/registrar_direccion', servlet_direcciones.registrar_direccion);
app.get('/obtener_direccion/:nid_persona', servlet_direcciones.obtener_direccion);

/** Padres **/
app.get('/obtener_padre/:nid_persona', servlet_persona.obtener_padre);
app.get('/obtener_madre/:nid_persona', servlet_persona.obtener_madre);
app.get('/obtener_hijos/:nid_persona', servlet_persona.obtener_hijos);
app.post('/registrar_padre', servlet_persona.registrar_padre);
app.post('/registrar_madre', servlet_persona.registrar_madre)

/** Instrumentos **/
app.get('/obtener_instrumentos', servlet_musico.obtener_instrumentos);

app.post('/registrar_musico', servlet_musico.registrar_musico);
app.post('/eliminar_instrumento_musico', servlet_musico.eliminar_instrumento_musico);
app.get('/obtener_personas_instrumento/:nid_instrumento', servlet_musico.obtener_personas_instrumento);
app.get('/obtener_musicos', servlet_musico.obtener_musicos);
app.get('/obtener_instrumentos_filtro', servlet_musico.obtener_instrumentos_filtro);

app.get('/obtener_tipo_musico', servlet_musico.obtener_tipo_musicos);

/** Socios **/
app.post('/registrar_socio', servlet_socio.registrar_socio);
app.post('/actualizar_socio', servlet_socio.actualizar_socio);
app.get('/obtener_socios', servlet_socio.obtener_socios);
app.get('/obtener_socios_alta', servlet_socio.obtener_socios_alta);
app.get('/obtener_socios_baja', servlet_socio.obtener_socios_baja);
app.get('/obtener_socio/:nid_persona', servlet_socio.obtener_socio);

/** Asignaturas **/
app.post('/registrar_asignatura', servlet_asignatura.registrar_asignatura);
app.post('/actualizar_asignatura', servlet_asignatura.actualizar_asignatura);
app.post('/eliminar_asignatura', servlet_asignatura.eliminar_asignatura);
app.get('/obtener_asignaturas', servlet_asignatura.obtener_asignaturas);
app.get('/obtener_asignatura/:nid_asignatura', servlet_asignatura.obtener_asignatura);
app.get('/obtener_asignaturas_profesor/:nid_profesor', servlet_asignatura.obtener_asignaturas_profesor);

app.post('/add_profesor', servlet_asignatura.add_profesor);
app.post('/eliminar_profesor', servlet_asignatura.eliminar_profesor);
app.get('/obtener_profesores', servlet_asignatura.obtener_profesores);
app.get('/obtener_profesores_asignatura/:nid_asignatura', servlet_asignatura.obtener_profesores_asignatura);

/** Cursos **/
app.post('/registrar_curso', servlet_curso.registrar_curso);
app.get('/obtener_cursos', servlet_curso.obtener_cursos);
app.post('/eliminar_curso', servlet_curso.eliminar_curso);
app.get('/obtener_cursos_profesor/:nid_profesor', servlet_matricula.obtener_cursos_profesor);
app.get('/obtener_nid_ultimo_curso', servlet_curso.obtener_nid_ultimo_curso);

/** Matriculas **/
app.post('/registrar_matricula', servlet_matricula.registrar_matricula);
app.get('/obtener_alumnos_asignaturas/:nid_curso/:nid_asignatura/:activo', servlet_matricula.obtener_alumnos_asignaturas);
app.get('/obtener_alumnos_curso/:nid_curso/:activo', servlet_matricula.obtener_alumnos_curso)
app.get('/obtener_alumnos_profesor/:nid_profesor/:nid_curso/:nid_asignatura/:activo', servlet_matricula.obtener_alumnos_profesor)

app.get('/obtener_matriculas_alumno/:nid_alumno', servlet_matricula.obtener_matriculas_alumno);
app.get('/obtener_asignaturas_matriculas/:nid_matricula', servlet_matricula.obtener_asignaturas_matricula);
app.post('/eliminar_asignatura', servlet_matricula.eliminar_asignatura);
app.post('/dar_baja_asignatura', servlet_matricula.dar_baja_asignatura);

app.post('/actualizar_precio_manual', servlet_matricula.registrar_precio_manual);
app.get('/obtener_matricula/:nid_matricula', servlet_matricula.obtener_matricula);

app.post('/sustituir_profesor', servlet_matricula.sustituir_profesor);

app.get('/obtener_matriculas_activas_profesor/:nid_asignatura/:nid_profesor', servlet_matricula.obtener_matriculas_activas_profesor);

/** Forma de pago **/
app.post('/registrar_forma_pago', servlet_persona.registrar_forma_pago);
app.get('/obtener_forma_pago/:nid_titular', servlet_persona.obtener_forma_pago);
app.get('/obtener_formas_pago', servlet_persona.obtener_formas_pago);
app.post('/asociar_forma_pago', servlet_persona.asociar_forma_pago);
app.get('/obtener_pago_persona/:nid_titular', servlet_persona.obtener_pago_persona);

/** Preinscripciones **/
app.get('/obtener_preinscripciones', servlet_preinscripciones.obtener_preinscripciones);

/** Remesas **/
app.post('/registrar_remesa_persona', servlet_remesa.registrar_remesa_persona);
app.get('/obtener_mensualidad/:nid_matricula', servlet_remesa.obtener_mensualidad);
app.get('/obtener_remesa/:lote', servlet_remesa.obtener_remesa);
app.get('/obtener_remesa_estado/:lote/:estado', servlet_remesa.obtener_remesa_estado);
app.get('/obtener_remesa_nid/:nid_remesa', servlet_remesa.obtener_remesa_nid)
app.get('/obtener_lineas_remesa/:nid_remesa', servlet_remesa.obtener_lineas_remesa);
app.get('/obtener_descuentos_remesa/:nid_remesa', servlet_remesa.obtener_descuentos_remesa);

app.get('/obtener_ultimo_lote', servlet_remesa.obtener_ultimo_lote);

app.post('/aprobar_remesa', servlet_remesa.aprobar_remesa);
app.post('/rechazar_remesa', servlet_remesa.rechazar_remesa);
app.post('/aprobar_remesas', servlet_remesa.aprobar_remesas);

/** Parámetros **/
app.get('/obtener_valor/:nombre', servlet_parametros.obtener_valor);
app.post('/actualizar_valor', servlet_parametros.actualizar_valor);

/** Horarios **/
app.get('/obtener_horarios/:nid_profesor/:nid_asignatura', servlet_horarios.obtener_horarios);
app.get('/obtener_horario/:nid_horario', servlet_horarios.obtener_horario);
app.get('/obtener_horario_profesor/:nid_profesor', servlet_horarios.obtener_horario_profesor);
app.get('/obtener_horario_clase_alumno/:nid_matricula', servlet_horarios.obtener_horario_clase_alumno);
app.post('/registrar_horario', servlet_horarios.registrar_horario);
app.post('/registrar_horario_clase', servlet_horarios.registrar_horario_clase);

app.get('/obtener_alumnos_horario_clase/:nid_horario_clase', servlet_horarios.obtener_alumnos_horario_clase);
app.get('/obtener_alumnos_sin_asignar/:nid_horario_clase', servlet_horarios.obtener_alumnos_sin_asignar);

app.post('/eliminar_horario_clase', servlet_horarios.eliminar_horario_clase);
app.post('/eliminar_horario', servlet_horarios.eliminar_horario);

app.post('/asignar_horario', servlet_horarios.asignar_horario_clase);
app.post('/liberar_horario', servlet_horarios.liberar_horario_clase);

/** Asistencia **/
app.post('/registrar_evento', servlet_asistencia.registrar_evento);


/** Evaluación **/
app.post('/registrar_evaluacion', servlet_evaluacion.registrar_evaluacion);
app.get('/obtener_trimestres', servlet_evaluacion.obtener_trimestres);
app.get('/obtener_evaluacion/:nid_trimestre/:nid_asignatura/:nid_profesor', servlet_evaluacion.obtener_evaluacion);
app.get('/obtener_evaluacion_matricula_asignatura/:nid_matricula', servlet_evaluacion.obtener_evaluacion_matricula_asignatura);


/** Boletin **/
app.get('/generar_boletin/:nid_matricula/:nid_trimestre', servlet_evaluacion.generar_boletin);


https.createServer({
    key: fs.readFileSync('apache.key'),
    cert: fs.readFileSync('apache-certificate.crt')
  }, app).listen(PORT, function(){
    console.log("My HTTPS server listening on port " + PORT + "...");
  });


