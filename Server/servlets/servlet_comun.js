const gestionUsuarios = require('../logica/usuario.js')

async function comprobaciones (req, res, funcionEspecifica) {
  try {
    await funcionEspecifica()
  } catch (error) {
    console.log(error)
    res.status(400).send({ error: true, message: 'Se ha producido un error', info: error })
  }
}

async function comprobacionesLogin (req, res, funcionEspecifica) {
  if (await gestionUsuarios.esAdministrador(req.session.nombre)) {
    console.log(req.session.nombre)
    try {
      await funcionEspecifica()
    } catch (error) {
      console.log(error)
      res.status(400).send({ error: true, message: 'Se ha producido un error', info: error })
    }
  } else {
    res.status(404).send({ error: true, message: 'No autorizado' })
  }
}

function comprobacionesApi (req, res, funcionEspecifica) {
  try {
    const apiKeySolicitud = req.header('x-api-key')
    if (apiKeySolicitud === process.env.API_KEY) {
      funcionEspecifica()
    } else {
      res.status(404).send({ error: true, message: 'No autorizado' })
    }
  } catch (error) {
    console.log(error)
    res.status(400).send({ error: true, message: 'Se ha producido un error', info: error })
  }
}

module.exports.comprobaciones = comprobaciones
module.exports.comprobacionesLogin = comprobacionesLogin
module.exports.comprobacionesApi = comprobacionesApi
