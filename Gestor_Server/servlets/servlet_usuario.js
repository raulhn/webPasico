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


    console.log(usu);
    console.log(pass);
    
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

module.exports.login = login; 
module.exports.logueado = logueado;
module.exports.logout = logout;
module.exports.registrar_usuario = registrar_usuario;