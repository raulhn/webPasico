const app = require("express")();
const https = require("https");
const fs = require("fs");
const bodyParser = require("body-parser");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");

const config = require("./config/config.js");
require("dotenv").config();

const servletComun = require("./servlets/servlet_comun.js");
const servletUsuario = require("./servlets/servlet_usuario.js");
const servletConexion = require("./servlets/servlet_conexiones.js");
const servletPersona = require("./servlets/servlet_persona.js");
const servletSocios = require("./servlets/servlet_socios.js");
const servletMusicos = require("./servlets/servlet_musicos.js");
const servletTipoMusico = require("./servlets/servlet_tipo_musico.js");
const servletInstrumentos = require("./servlets/servlet_instrumentos.js");
const servletAsignaturas = require("./servlets/servlet_asignatura.js");
const servletCurso = require("./servlets/servletCurso.js");
const servletProfesores = require("./servlets/servlet_profesores.js");
const servletMatricula = require("./servlets/servlet_matricula.js");
const servletMatriculaAsignatura = require("./servlets/servlet_matricula_asignatura.js");
const servletProfesorAlumnoMatricula = require("./servlets/servlet_profesor_alumno_matricula.js");
const servletEventoConcierto = require("./servlets/servletEventoConcierto.js");
const servletPartituras = require("./servlets/servlet_partituras.js");
const servlet_categoria_partituras = require("./servlets/servlet_categoria_partituras.js");
const servletNotificaciones = require("./servlets/servlet_notificaciones.js");
const gestorNotificaciones = require("./logica/notificaciones.js");
const servlet_tipo_evento_musico = require("./servlets/servlet_tipo_evento_musico.js");
const servletTrimestre = require("./servlets/servlet_trimestre.js");
const servletTipoProgreso = require("./servlets/servlet_tipo_progreso.js");
const servletEvaluacion = require("./servlets/servlet_evaluacion.js");
const servletEvaluacionMatricula = require("./servlets/servlet_evaluacion_matricula.js");
const servletAgendaEvento = require("./servlets/servlet_agenda_evento.js");

// Tablon Anuncios //
const servletTablonAnuncios = require("./servlets/servlet_tablon_anuncios.js");
const servletTipoTablon = require("./servlets/servlet_tipo_tablon.js");

const validacionEmail = require("./logica/validacionEmail.js");

const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutos
  max: 300, // LÃ­mite de 300 solicitudes por IP
  message:
    "Demasiadas solicitudes desde esta IP, por favor intente mÃ¡s tarde.",
  standardHeaders: true, // Devuelve información de límite en los encabezados `RateLimit-*`
  legacyHeaders: false, // Desactiva los encabezados `X-RateLimit-*`
  validate: { trustProxy: false },
});

validacionEmail.enviarCorreos();
gestorNotificaciones.procesoEnviarNotificaciones();

app.set("trust proxy", true);
app.use(limiter);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("El servidor está funcionando correctamente.");
});

app.put("/registrar_usuario", servletUsuario.registrarUsuario);

/**  Conexiones **/
app.put("/registrar_conexion", servletConexion.registrarConexion);
app.get("/verificar_correo/:token", servletUsuario.verificarCorreo);
app.post("/login", servletUsuario.login);
app.post("/refresh_token", servletUsuario.refreshToken);

app.post("/logout", servletUsuario.logout);
app.post("/recuperar_password", servletUsuario.recuperarPassword);

// Tipo evento Musico //
app.get(
  "/obtener_tipos_evento/:nid_evento_concierto",
  servlet_tipo_evento_musico.obtener_tipos_evento,
);

/** Llamadas por API KEY **/
// Personas //
app.post("/registrar_persona", servletPersona.registrarPersona);
app.get("/obtener_persona/:nid_persona", servletPersona.obtenerPersona);
app.get("/obtener_personas_sucias", servletPersona.obtenerPersonasSucias);
app.post("/limpiar_persona", servletPersona.limpiarPersona);

// Trimestres //
app.post("/registrar_trimestre", servletTrimestre.registrarTrimestre);
app.get("/obtener_trimestres_sucios", servletTrimestre.obtenerTrimestresSucios);

// Tipo Progreso //
app.post("/registrar_tipo_progreso", servletTipoProgreso.registrarTipoProgreso);
app.get(
  "/obtener_tipos_progreso_sucios",
  servletTipoProgreso.obtenerTipoProgresoSucios,
);

// Evaluaciones //
app.post(
  "/registrar_evaluacion",
  servletEvaluacion.registrarEvaluacionServicio,
);
app.get(
  "/obtener_evaluaciones_sucias",
  servletEvaluacion.obtenerEvaluacionesSucias,
);
app.post(
  "/actualizar_evaluacion_sucia",
  servletEvaluacion.actualizarEvaluacionSucia,
);
app.post(
  "/actualizar_evaluacion_matricula_sucia",
  servletEvaluacionMatricula.actualizarEvaluacionMatriculaSucia,
);

// Evaluacion Matricula //
app.post(
  "/registrar_evaluacion_matricula",
  servletEvaluacionMatricula.registrarEvaluacionMatriculaServicio,
);
app.get(
  "/obtener_evaluaciones_matriculas_sucias",
  servletEvaluacionMatricula.obtenerEvaluacionesMatriculaSucias,
);

// Socios //
app.post("/registrar_socio", servletSocios.registrarSocio);

// Musicos //
app.post("/registrar_musico", servletMusicos.registrarMusico);

// Tipo Musico //
app.post("/registrar_tipo_musico", servletTipoMusico.registrarTipoMusico);

// Instrumentos //
app.post("/registrar_instrumento", servletInstrumentos.registrarInstrumento);

// Asignaturas //
app.post("/registrar_asignatura", servletAsignaturas.registrarAsignatura);

// Cursos //
app.post("/registrar_curso", servletCurso.registrarCurso);

// Profesores //
app.post("/registrar_profesor", servletProfesores.registrarProfesor);
app.post("/eliminar_profesor", servletProfesores.eliminarProfesor);

// Matriculas //
//
app.post("/registrar_matricula", servletMatricula.registrarMatricula);

// Matricula Asignatura //
app.post(
  "/registrar_matricula_asignatura",
  servletMatriculaAsignatura.registrarMatriculaAsignatura,
);

// Profesor Alumno Matricula //
app.post(
  "/registrar_profesor_alumno_matricula",
  servletProfesorAlumnoMatricula.registrarProfesorAlumnoMatricula,
);

// Tipo Musico //
app.get("/obtener_tipos_musico", servletTipoMusico.obtenerTipoMusico);

// Generar boletin //
app.get("/generar_boletin/:token", servletEvaluacion.generar_boletin);

// Tablon Anuncios //
app.get("/obtener_tipos_tablon", servletTipoTablon.obtenerTiposTablon);
app.get(
  "/obtener_tipo_tablon/:nid_tipo_tablon",
  servletTipoTablon.obtenerTipoTablon,
);

app.get("/obtener_tablon_anuncios", servletTablonAnuncios.obtenerAnuncios);
app.get(
  "/obtener_anuncio/:nid_tablon_anuncio",
  servletTablonAnuncios.obtenerAnuncio,
);

app.get("/obtener_asignaturas", servletAsignaturas.obtenerAsignaturas);

// Agenda Eventos //
app.get("/obtener_agenda_eventos", servletAgendaEvento.obtenerEventos);
app.get(
  "/obtener_agenda_eventos_fecha/:fecha",
  servletAgendaEvento.obtenerEventosFecha,
);
app.get(
  "/obtener_agenda_eventos_mes/:mes/:anio",
  servletAgendaEvento.obtenerEventosMes,
);
///////////////////////////////////////////////
// Peticiones que requieren inicio de sesión //
///////////////////////////////////////////////
app.use((req, res, next) => {
  try {
    servletComun
      .comprobacionLogin(req, res)
      .then(() => {
        next();
      })
      .catch((error) => {
        res.status(401).send({ error: true, mensaje: "No autenticado" });
      });
  } catch (error) {
    res.status(401).send({ error: true, mensaje: "No autenticado" });
  }
});
//
// Profesores //
app.get("/obtener_profesores", servletProfesores.obtenerProfesores);
app.get(
  "/obtener_profesores_asignatura/:nid_asignatura",
  servletProfesores.obtenerProfesoresAsignatura,
);

app.get("/usuario", servletUsuario.obtenerUsuario);
app.post("/cambiar_password", servletUsuario.cambiarPassword);
app.get("/obtener_socio", servletSocios.obtenerSocio);

// Trimestres //
app.get("/obtener_trimestres", servletTrimestre.obtenerTrimestres);

// Cursos //
app.get("/obtener_cursos", servletCurso.obtenerCursos);

// Eventos //
app.post(
  "/registrar_evento_concierto",
  servletEventoConcierto.insertarEventoConcierto,
);
app.post(
  "/actualizar_evento_concierto",
  servletEventoConcierto.actualizarEventoConcierto,
);
app.get(
  "/obtener_eventos_concierto",
  servletEventoConcierto.obtenerEventosConcierto,
);

app.post(
  "/registrar_partitura_evento",
  servletEventoConcierto.registrar_partitura_evento,
);
app.post(
  "/eliminar_partitura_evento",
  servletEventoConcierto.eliminar_partitura_evento,
);
app.get(
  "/obtener_evento_concierto/:nid_evento_concierto",
  servletEventoConcierto.obtenerPartiturasEvento,
);

app.post("/eliminar_evento_concierto", servletEventoConcierto.eliminar_evento);

// Tipo evento musico //
app.post(
  "/registrar_tipo_evento_musico",
  servlet_tipo_evento_musico.registrar_tipo_evento_musico,
);
app.post(
  "/eliminar_tipo_evento_musico",
  servlet_tipo_evento_musico.eliminar_tipo_evento_musico,
);

// Partituras //
app.post("/registrar_partitura", servletPartituras.insertarPartitura);
app.post("/actualizar_partitura", servletPartituras.actualizarPartitura);
app.get("/obtener_partituras", servletPartituras.obtenerPartituras);
app.get(
  "/obtener_partitura/:nid_partitura",
  servletPartituras.obtenerPartitura,
);

// Agenda Eventos //
app.post("/registrar_agenda_evento", servletAgendaEvento.registrarEvento);
app.post("/actualizar_agenda_evento", servletAgendaEvento.actualizarEvento);
app.post("/eliminar_agenda_evento", servletAgendaEvento.eliminarEvento);
// Evaluaciones //
app.get(
  "/obtener_evaluaciones_asignaturas/:nid_asignatura/:nid_curso/:nid_trimestre",
  servletEvaluacion.obtenerEvaluacionesAsignaturas,
);

// Categorias Partituras //
app.post(
  "/registrar_categoria_partitura",
  servlet_categoria_partituras.insertarCategoriaPartitura,
);
app.post(
  "/actualizar_categoria_partitura",
  servlet_categoria_partituras.actualizarCategoriaPartitura,
);

app.get(
  "/obtener_categorias_partitura",
  servlet_categoria_partituras.obtenerCategoriasPartitura,
);

// Obtener Personas //
app.get("/obtener_personas", servletPersona.obtenerPersonas);
app.get("/obtener_personas_musicos", servletPersona.obtenerPersonasMusicos);
app.get("/obtener_personas_alumnos", servletPersona.obtenerPersonasAlumnos);
app.get("/obtener_personas_socios", servletPersona.obtenerPersonasSocios);
app.get(
  "/obtener_alumnos_profesor",
  servletProfesorAlumnoMatricula.obtenerAlumnosProfesor,
);
app.get(
  "/obtener_info_persona/:nid_persona",
  servletPersona.obtenerInfoPersona,
);
app.get(
  "/obtener_alumno_profesor/:nid_alumno/:nid_curso",
  servletPersona.obtenerAlumnoProfesor,
);
app.get(
  "/obtener_personas_alumnos_asignatura/:nid_curso/:nid_asignatura/:activo",
  servletPersona.obtenerPersonasAlumnosAsignatura,
);

app.get(
  "/obtener_personas_listado/:tipo/:activo",
  servletPersona.obtenerListadoPersona,
);

app.get(
  "/obtener_alumnos_asignatura_profesor/:nid_asignatura/:nid_curso",
  servletMatriculaAsignatura.obtenerAlumnosAsignaturaProfesor,
);

app.get(
  "/obtener_alumnos_asignatura/:nid_asignatura",
  servletMatriculaAsignatura.obtenerAlumnosAsignatura,
);

app.get(
  "/obtener_alumnos_curso_activo",
  servletMatriculaAsignatura.obtenerAlumnosCursoActivo,
);

app.get(
  "/obtener_alumnos_curso/:nid_curso/:activo",
  servletMatriculaAsignatura.obtenerAlumnosCurso,
);
app.get(
  "/obtener_alumnos_curso_activo_asignatura/:nid_asignatura",
  servletMatriculaAsignatura.obtenerAlumnosCursoActivoAsignatura,
);

// Asignaturas //
app.get(
  "/obtener_asignaturas_profesor",
  servletAsignaturas.obtenerAsignaturasProfesor,
);

// Matriculas //
app.get(
  "/obtener_matriculas_persona",
  servletMatricula.obtenerMatriculasPersona,
);

app.get(
  "/obtener_matriculas_asignatura_persona/:nid_matricula",
  servletMatriculaAsignatura.obtenerMatriculasAsignaturaPersona,
);

// Notificaciones //
app.post(
  "/registrar_notificacion",
  servletNotificaciones.registrarNotificacion,
);
app.post(
  "/registrar_notificacion_grupo",
  servletNotificaciones.registrarNotificacionGrupo,
);

//Evaluaciones //
app.get(
  "/obtener_evaluaciones/:nid_matricula",
  servletEvaluacion.obtenerEvaluaciones,
);
app.get(
  "/obtener_evaluaciones_asignatura/:nid_curso/:nid_asignatura/:nid_trimestre",
  servletEvaluacion.obtenerEvaluacionesAsignaturas,
);

app.get(
  "/obtener_evaluaciones_asignatura_profesor/:nid_curso/:nid_asignatura/:nid_profesor/:nid_trimestre",
  servletEvaluacion.obtenerEvaluacionesAsignaturasProfesor,
);

app.get(
  "/solicitar_generar_boletin/:nid_matricula/:nid_trimestre",
  servletEvaluacion.solicitar_generar_boletin,
);

app.get(
  "/generar_boletin_web/:nid_matricula/:nid_trimestre",
  servletEvaluacion.generarBoletinWeb,
);

app.post("/registrar_evaluaciones", servletEvaluacion.registrarEvaluaciones);

//Tablon Anuncios //
app.post(
  "/registrar_tablon_anuncio",
  servletTablonAnuncios.insertarTablonAnuncio,
);

app.post(
  "/actualizar_tablon_anuncio",
  servletTablonAnuncios.actualizarTablonAnuncio,
);

app.post(
  "/eliminar_tablon_anuncio",
  servletTablonAnuncios.eliminarTablonAnuncio,
);

https
  .createServer(
    {
      key: fs.readFileSync("apache.key"),
      cert: fs.readFileSync("apache-certificate.crt"),
    },
    app,
  )
  .listen(config.puerto, () => {
    console.log("Escuchando en el puerto " + config.puerto);
  });
