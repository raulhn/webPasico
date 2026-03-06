const componente_card = require("../componentes/componente_card.js");
const servlet_comun = require("./servlet_comun");
const gestor_usuarios = require("../logica/usuario.js");
const gestor_componente = require("../componentes/componente.js");

async function registrar_componente_card(
  nid_componente_card,
  texto,
  color,
  tipo_componente,
  nid_padre,
  orden,
) {
  try {
    let orden_componente = orden;
    if (!orden_componente) {
      orden_componente = await servlet_comun.obtener_orden_siguiente(nid_padre);
    }
    let nid_componente = nid_componente_card;
    if (!nid_componente) {
      nid_componente = await gestor_componente.registrar_componente_comun(
        tipo_componente,
        nid_padre,
        tipo_asociacion,
        orden_componente,
      );
    }

    await componente_card.registrar_componente_card(
      nid_componente,
      texto,
      color,
    );

    return res
      .status(200)
      .send({ error: false, message: "Componente registrado" });
  } catch (error) {
    console.log("Error en registrar_componente_card: ", error);
    return res.status(400).send({ error: true, message: "Error" });
  }
}

async function actualizar_componente_card(req, res) {
  try {
    let id_componente = req.params.id;
    let texto = req.body.texto;
    let color = req.body.color;

    const bEsAdministrador = await gestor_usuarios.esAdministrador(
      req.session.usuario_id,
    );
    if (!bEsAdministrador) {
      return res.status(403).send({ error: true, message: "Acceso denegado" });
    }
    await componente_card.actualizar_componente_card(
      id_componente,
      texto,
      color,
    );

    return res
      .status(200)
      .send({ error: false, message: "Componente actualizado" });
  } catch (error) {
    console.log("Error en actualizar_componente_card: ", error);
    return res.status(400).send({ error: true, message: "Error" });
  }
}
async function obtener_componente_card(req, res) {
  try {
    let id_componente = req.params.id;
    const resultado =
      await componente_card.obtener_componente_card(id_componente);
    res.status(200).send({
      error: false,
      componente: resultado,
      message: "Componente card",
    });
    return;
  } catch (error) {
    console.log("Error en obtener_componente_card: ", error);
    res.status(400).send({ error: true, message: "No existe el componente" });
    return;
  }
}

module.exports.registrar_componente_card = registrar_componente_card;
module.exports.actualizar_componente_card = actualizar_componente_card;
module.exports.obtener_componente_card = obtener_componente_card;
