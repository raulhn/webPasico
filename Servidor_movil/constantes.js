const ESQUEMA = "pasico_movil";
const MAX_CONEXIONES = 50000;
const TIEMPO_ACCESS_TOKEN = 60 * 60 * 24; // 1 día
const TIEMPO_REFRESH_TOKEN = 60 * 60 * 24 * 7; // 7 días

const ACCESS_TOKEN = "access_token";
const REFRESH_TOKEN = "refresh_token";

const SALT_ROUNDS = 10; // Número de rondas para el hash de la contraseña

const BANDA = 1;
const ESCUELA = 2;
const ASOCIACION = 3;
const INDIVIDUAL = 4;

module.exports.ESQUEMA = ESQUEMA;
module.exports.MAX_CONEXIONES = MAX_CONEXIONES;
module.exports.TIEMPO_ACCESS_TOKEN = TIEMPO_ACCESS_TOKEN;
module.exports.TIEMPO_REFRESH_TOKEN = TIEMPO_REFRESH_TOKEN;
module.exports.ACCESS_TOKEN = ACCESS_TOKEN;
module.exports.REFRESH_TOKEN = REFRESH_TOKEN;
module.exports.SALT_ROUNDS = SALT_ROUNDS;
module.exports.BANDA = BANDA;
module.exports.ESCUELA = ESCUELA;
module.exports.ASOCIACION = ASOCIACION;
module.exports.INDIVIDUAL = INDIVIDUAL;
