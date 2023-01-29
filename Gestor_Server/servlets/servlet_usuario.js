const gestion_usuarios = require('../usuario.js');

/**
*/
async function login(req, res)
{
  let usu = req.body.usuario;
  let pass = req.body.password;

  bresultado = await gestion_usuarios.login(usu, pass);
  if (bresultado)
  {
    req.session.nombre= usu;
    res.status(200).send({error: false, message: 'logueado'})
  }
  else{
     res.status(200).send({error: true, message: 'fallo'})
  }
}

function logueado(req, res)
{
    if(!req.session.nombre)
    {
       bEsLogueado = false;
       usu = undefined;
    }
    else
    {
        bEsLogueado = true;
        usu = req.session.nombre;
    }
    res.status(200).send({logueado: bEsLogueado, login: usu});
}

function logout(req, res)
{
    if(req.session.nombre)
    {
        req.session.destroy();
    }
    res.status(200).send({error:false, message: 'Logout relizado'});
}

async function registrar_usuario(req, res)
{

  if(req.session.nombre)
  {

    let usu = req.body.usuario;
    let pass = req.body.password;
    
    try{
      await gestion_usuarios.registrar_usuario(usu, pass);
      res.status(200).send({error:false, message: 'Registro realizado'});
    }
    catch(err)
    {
        console.log(err);
        res.status(200).send({error:true, message: err});
    }
  
  }
  else
  {
    return false;
  }
}

async function esAdministrador(user)
{
  return await gestion_usuarios.esAdministrador(user);
}

async function obtener_usuarios(req, res)
{
  if(req.session.nombre)
  {
    let usuario = req.session.nombre;
    bEsAdministrador = await esAdministrador(usuario);
    if (bEsAdministrador)
    {
      try{
        resultados = await gestion_usuarios.obtener_usuarios();
      }
      catch(error)
      {
         res.status(500).send({error: true, message: error});
      }
    }
    else{
      res.status(401).send({error: true, message: 'No está autorizado'});
    }
  }
  else{
    res.status(401).send({error: true, message: 'No está autorizado'});
  }
}

module.exports.login = login; 
module.exports.logueado = logueado;
module.exports.logout = logout;
module.exports.registrar_usuario = registrar_usuario;
module.exports.obtener_usuarios = obtener_usuarios;