const componente_card = require("../components/componente_card");
const servlet_comun = require("./servlet_comun");
const gestor_usuarios = require("../logica/usuario.js");

async function registrar_componente_card(req, res) {
  try {
    const esAdministrador = await gestor_usuarios.esAdministrador(
      req.session.nombre,
    );
    if (!esAdministrador) {
      res.status(404).send({ error: true, message: "No autorizado" });
      return;
    }

    let id_componente = req.body.id_componente;
    let texto = req.body.texto;
    let color = req.body.color;

    await componente_card.registrar_componente_card(
      id_componente,
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
module.exports.obtener_componente_card = obtener_componente_card;
