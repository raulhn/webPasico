const pagos = require("../config/pagos.js");
const persona = require("./persona.js");
const remesa = require("./remesa.js");
const conexion = require("../conexion.js");
const constantes = require("../constantes.js");
const stripe = require("stripe");

//https://docs.stripe.com/api/

async function existe_usuario_pasarela_pago(nid_persona) {
  try {
    let v_persona = await persona.obtener_persona(nid_persona);
    v_nid_pasarela_pago = v_persona["nid_pasarela_pago"];
    return v_nid_pasarela_pago !== null || v_nid_pasarela_pago.length > 0;
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function crear_usuario(nid_persona) {
  try {
    let bExiste_persona = await existe_usuario_pasarela_pago(nid_persona);
    if (!bExiste_persona) {
      let servicio_stripe = stripe(pagos.KEY);
      let v_persona = await persona.obtener_persona(nid_persona);
      let data = {
        name: v_persona.etiqueta,
        email: v_persona.correo_electronico,
      };

      const cliente = await servicio_stripe.customers.create(data);

      await persona.actualizar_user_pasarela_pago(nid_persona, cliente.id);
      return;
    } else {
      console.log("Error: el usuario ya tiene un usuario de pasarela de pago");
      throw new Error("Error al crear el usuario");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error al crear el usuario");
  }
}

async function crear_metodo_pago_cuenta_bancaria(nid_forma_pago) {
  try {
    let v_forma_pago = await persona.obtener_forma_pago_nid(nid_forma_pago);

    let v_persona = await persona.obtener_persona(v_forma_pago.nid_titular);

    let bExiste_persona = await existe_usuario_pasarela_pago(v_persona.nid);

    if (bExiste_persona) {
      let v_iban = v_forma_pago.iban;

      var correo_electronico = v_persona.correo_electronico;
      let data;

      let servicio_stripe = stripe(pagos.KEY);
      if (
        correo_electronico === undefined ||
        correo_electronico === null ||
        correo_electronico.length == 0
      ) {
        data = {
          type: "sepa_debit",
          sepa_debit: { iban: v_iban },
          billing_details: {
            name:
              v_persona.nombre +
              " " +
              v_persona.primer_apellido +
              " " +
              v_persona.segundo_apellido,
            email: pagos.correo_defecto,
          },
        };
      } else {
        data = {
          type: "sepa_debit",
          sepa_debit: { iban: v_iban },
          billing_details: {
            name:
              v_persona.nombre +
              " " +
              v_persona.primer_apellido +
              " " +
              v_persona.segundo_apellido,
            email: v_persona.correo_electronico,
          },
        };
      }

      metodo_pago = await servicio_stripe.paymentMethods.create(data);

      let respuesta_metodo_pago = await servicio_stripe.paymentMethods.attach(
        metodo_pago.id,
        { customer: v_persona.nid_pasarela_pago }
      );

      await persona.actualizar_metodo_pasarela_pago(
        v_forma_pago.nid,
        respuesta_metodo_pago.id
      );

      return;
    } else {
      console.log("No existe el usuario en la pasarela de pago");
      throw new Error("No existe el usuario en la pasarela de pago");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error al crear el método de pago");
  }
}

async function cobrar_pago(
  nid_forma_pago,
  descripcion,
  cantidad,
  p_ip_address,
  p_user_agent
) {
  try {
    let bExisteFormaPago = await persona.existe_forma_pago(nid_forma_pago);

    if (bExisteFormaPago) {
      let v_forma_pago = await persona.obtener_forma_pago_nid(nid_forma_pago);

      if (
        v_forma_pago.nid_metodo_pasarela_pago !== null &&
        v_forma_pago.nid_metodo_pasarela_pago.length > 0
      ) {
        let v_persona = await persona.obtener_persona(v_forma_pago.nid_titular);

        let servicio_stripe = stripe(pagos.KEY);

        let conceptoDescripcion =
          descripcion + " - Asociación amigo de la Musica de Torre Pacheco";
        let data = {
          amount: cantidad,
          currency: "eur",
          payment_method: v_forma_pago.nid_metodo_pasarela_pago,
          payment_method_types: ["sepa_debit"],
          customer: v_persona.nid_pasarela_pago,
          description: conceptoDescripcion,
          statement_descriptor: conceptoDescripcion.slice(0, 22),
          confirm: true,
          mandate_data: {
            customer_acceptance: {
              type: "online",
              online: {
                ip_address: p_ip_address,
                user_agent: p_user_agent,
              },
            },
          },
        };

        let pago = await servicio_stripe.paymentIntents.create(data);
        return pago;
      } else {
        console.log(
          "pasarela_pago.js - cobrar_pago -> La forma de pago  " +
            nid_forma_pago +
            " no está registrada en la pasarela de pagos"
        );
        throw new Error("No está registrada en la pasarela de pagos");
      }
    } else {
      console.log(
        "pasarela_pago.js - cobrar_pago -> No se ha encontrado la forma de pago"
      );
      throw new Error("No se ha encontrado la forma de pago");
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error al realizar el pago");
  }
}

async function cobrar_remesa(nid_remesa, p_ip_address, p_user_agent) {
  try {
    let v_remesa = await remesa.obtener_remesa_nid(nid_remesa);

    let v_remesa_actual = v_remesa;

    if (v_remesa_actual.estado == constantes.ESTADO_REMESA_PENDIENTE) {
      // La cantidad es en centimos //
      let v_precio = Number(v_remesa_actual.precio) * 100;
      let v_nid_forma_pago = v_remesa_actual.nid_forma_pago;

      let concepto = await remesa.obtener_concepto(nid_remesa);
      let cobro = await cobrar_pago(
        v_nid_forma_pago,
        concepto,
        v_precio,
        p_ip_address,
        p_user_agent
      );

      await remesa.actualizar_id_cobro_pasarela_pago(nid_remesa, cobro.id);

      await remesa.aprobar_remesa(
        nid_remesa,
        "Cobro realizado desde la pasarela de pago"
      );

      return;
    } else {
      console.log(
        "pasarela_pagos.js - cobrar_remesa -> La remesa " +
          nid_remesa +
          " no está en estado pendiente"
      );
      await remesa.remesa_erronea(
        nid_remesa,
        "La remesa " + nid_remesa + " no está en estado pendiente"
      );
      throw new Error("Error al realizar el cobro");
    }
  } catch (error) {
    console.log("pasarela_pagos.js - cobrar_remesa -> " + error);
    try {
      await remesa.remesa_erronea(
        nid_remesa,
        "Error al cobrar la remesa " + error
      );
    } catch (error) {
      console.log("pasarela_pagos.js -cobrar_remesa -> " + error);
    }
    throw new Error("Error al realizar el cobro");
  }
}

async function recuperar_pago(nid_pasarela_pago) {
  let servicio_stripe = stripe(pagos.KEY);
  let pago_recuperado = await servicio_stripe.paymentIntents.retrieve(
    nid_pasarela_pago
  );

  console.log(pago_recuperado.status);
  return;
}

async function cobrar_lote(nid_lote, p_ip_address, p_user_agent) {
  try {
    let lista_remesas = await remesa.obtener_remesa(nid_lote);

    for (let i = 0; i < lista_remesas.length; i++) {
      try {
        await cobrar_remesa(
          lista_remesas[i]["nid_remesa"],
          p_ip_address,
          p_user_agent
        );
      } catch (error) {
        console.log(
          "pasarela_pagos.js - cobrar_lote -> Remesa " +
            lista_remesas[i]["nid_remesa"] +
            " " +
            error
        );
      }
    }

    return;
  } catch (error) {
    console.log("pasarela_pagos.js - cobrar_lote -> " + error);
    throw new Error(error);
  }
}

module.exports.crear_usuario = crear_usuario;
module.exports.crear_metodo_pago_cuenta_bancaria =
  crear_metodo_pago_cuenta_bancaria;
module.exports.cobrar_pago = cobrar_pago;
module.exports.cobrar_remesa = cobrar_remesa;
module.exports.cobrar_lote = cobrar_lote;
