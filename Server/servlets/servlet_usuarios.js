const gestion_usuarios = require('../usuario.js')
const comun = require('../servlets/servlet_comun.js')

function actualizar_password(req, res)
{
  comun.comprobaciones_login(req, res,
    async () =>
    {
      let usuario = req.session.nombre;
      if(await gestion_usuarios.existe_login(usuario))
      {
        let password = req.body.password;
        await gestion_usuarios.actualizar_password(usuario, password);
        res.status(200).send({error:false, message: 'Actualización realizada'});
      }
      else{
        res.status(400).send({error:true, message: 'No existe el usuario'})
      }
    }
  )
}

module.exports.actualizar_password = actualizar_password;