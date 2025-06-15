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

/** Llamadas por API KEY **/
// Personas //
app.post("/registrar_persona", servletPersona.registrarPersona);
app.get("/obtener_persona/:nid_persona", servletPersona.obtenerPersona);
app.get("/obtener_personas_sucias", servletPersona.obtenerPersonasSucias);
app.post("/limpiar_persona", servletPersona.limpiarPersona);

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
app.post("/registrar_matricula", servletMatricula.registrarMatricula);

// Matricula Asignatura //
app.post(
  "/registrar_matricula_asignatura",
  servletMatriculaAsignatura.registrarMatriculaAsignatura
);

// Profesor Alumno Matricula //
app.post(
  "/registrar_profesor_alumno_matricula",
  servletProfesorAlumnoMatricula.registrarProfesorAlumnoMatricula
);

///////////////////////////////////////////////
// Peticiones que requieren inicio de sesión //
///////////////////////////////////////////////
app.use((req, res, next) => {
  servletComun.comprobacionLogin;
  next();
});

app.get("/usuario", servletUsuario.obtenerUsuario);
app.post("/cambiar_password", servletUsuario.cambiarPassword);
app.get("/obtener_socio", servletSocios.obtenerSocio);

// Eventos //
app.post(
  "/registrar_evento_concierto",
  servletEventoConcierto.insertarEventoConcierto
);
app.post(
  "/actualizar_evento_concierto",
  servletEventoConcierto.actualizarEventoConcierto
);
app.get(
  "/obtener_eventos_concierto",
  servletEventoConcierto.obtenerEventosConcierto
);

app.post(
  "/registrar_partitura_evento",
  servletEventoConcierto.registrar_partitura_evento
);
app.post(
  "/eliminar_partitura_evento",
  servletEventoConcierto.eliminar_partitura_evento
);
app.get(
  "/obtener_evento_concierto/:nid_evento_concierto",
  servletEventoConcierto.obtenerPartiturasEvento
);

// Partituras //
app.post("/registrar_partitura", servletPartituras.insertarPartitura);
app.post("/actualizar_partitura", servletPartituras.actualizarPartitura);
app.get("/obtener_partituras", servletPartituras.obtenerPartituras);
app.get(
  "/obtener_partitura/:nid_partitura",
  servletPartituras.obtenerPartitura
);

// Categorias Partituras //
app.post(
  "/registrar_categoria_partitura",
  servlet_categoria_partituras.insertarCategoriaPartitura
);
app.post(
  "/actualizar_categoria_partitura",
  servlet_categoria_partituras.actualizarCategoriaPartitura
);

app.get(
  "/obtener_categorias_partitura",
  servlet_categoria_partituras.obtenerCategoriasPartitura
);

// Obtener Personas //
app.get("/obtener_personas", servletPersona.obtenerPersonas);
app.get("/obtener_personas_musicos", servletPersona.obtenerPersonasMusicos);

// Notificaciones //
app.post(
  "/registrar_notificacion",
  servletNotificaciones.registrarNotificacion
);

// Tipo Musico //
app.get("/obtener_tipos_musico", servletTipoMusico.obtenerTipoMusico);

https
  .createServer(
    {
      key: fs.readFileSync("apache.key"),
      cert: fs.readFileSync("apache-certificate.crt"),
    },
    app
  )
  .listen(config.puerto, () => {
    console.log("Escuchando en el puerto " + config.puerto);
  });
