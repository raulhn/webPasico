const componente_card = require("../componentes/componente_card.js");
const servlet_comun = require("./servlet_comun");
const gestor_usuarios = require("../logica/usuario.js");
const gestor_componente = require("../componentes/componente.js");
const constantes = require("../constantes.js");

async function registrar_componente_card(
  nid_componente_card,
  texto,
  color,
  tipo_asociacion,
  nid_padre,
  orden,
) {
  try {
    let orden_componente = orden;
    if (
      !orden_componente &&
      tipo_asociacion == constantes.TIPO_ASOCIACION_PAGINA
    ) {
      orden_componente =
        await gestor_componente.obtener_ultimo_orden(nid_padre);
    }
    let nid_componente = nid_componente_card;
    if (!nid_componente) {
      nid_componente = await gestor_componente.registrar_componente_comun(
        constantes.TIPO_COMPONENTE_CARD,
        nid_padre,
        tipo_asociacion,
        orden_componente,
      );
    }

    await componente_card.insertar_componente_card(
      nid_componente,
      texto,
      color,
    );

    return;
  } catch (error) {
    console.log("Error en registrar_componente_card: ", error);
    throw new Error("Error al registrar el componente card");
  }
}

async function actualizar_componente_card(req, res) {
  try {
    let id_componente = req.body.id;
    let texto = req.body.texto;
    let color = req.body.color;

    const bEsAdministrador = await gestor_usuarios.esAdministrador(
      req.session.nombre,
    );
    if (!bEsAdministrador) {
      res.status(403).send({ error: true, message: "Acceso denegado" });
      return;
    }
    await componente_card.actualizar_componente_card(
      id_componente,
      texto,
      color,
    );

    res.status(200).send({ error: false, message: "Componente actualizado" });
    return;
  } catch (error) {
    console.log("Error en actualizar_componente_card: ", error);
    res.status(400).send({ error: true, message: "Error" });
    return;
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

async function eliminar_componente_card(nid_componente_card) {
  try {
  } catch {
    throw new Error("Error al eliminar el componente card");
  }
}

module.exports.registrar_componente_card = registrar_componente_card;
module.exports.actualizar_componente_card = actualizar_componente_card;
module.exports.obtener_componente_card = obtener_componente_card;
