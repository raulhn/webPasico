const pagos = require("../config/pagos.js");
const persona = require("./persona.js");
const remesa = require("./remesa.js");
const constantes = require("../constantes.js");
const stripe = require("stripe");

// https://docs.stripe.com/api/

async function asyncExisteUsuarioPasarelaPago(nidPersona, resolve, reject) {
  try {
    const personaData = await persona.obtenerPersona(nidPersona);
    const nidPasarelaPago = personaData.nid_pasarela_pago;
    resolve(nidPasarelaPago !== null || nidPasarelaPago.length > 0);
  } catch (error) {
    console.log(error);
    resolve(false);
  }
}

function existeUsuarioPasarelaPago(nidPersona) {
  return new Promise((resolve, reject) => {
    asyncExisteUsuarioPasarelaPago(nidPersona, resolve, reject);
  });
}

async function asyncCrearUsuario(nidPersona, resolve, reject) {
  try {
    const existePersona = await existeUsuarioPasarelaPago(nidPersona);
    if (!existePersona) {
      const servicioStripe = stripe(pagos.KEY);
      const personaData = await persona.obtenerPersona(nidPersona);
      const data = {
        name: personaData.etiqueta,
        email: personaData.correo_electronico,
      };

      const cliente = await servicioStripe.customers.create(data);

      await persona.actualizarUserPasarelaPago(nidPersona, cliente.id);
      resolve();
    } else {
      console.log("Error: el usuario ya tiene un usuario de pasarela de pago");
      reject("Error al crear el usuario");
    }
  } catch (error) {
    console.log(error);
    reject("Error al crear el usuario");
  }
}

function crearUsuario(nidPersona) {
  return new Promise((resolve, reject) => {
    asyncCrearUsuario(nidPersona, resolve, reject);
  });
}

async function asyncCrearMetodoPagoCuentaBancaria(
  nidFormaPago,
  resolve,
  reject
) {
  try {
    const formaPago = await persona.obtenerFormaPagoNid(nidFormaPago);
    const personaData = await persona.obtenerPersona(formaPago.nid_titular);
    const existePersona = await existeUsuarioPasarelaPago(personaData.nid);

    if (existePersona) {
      const iban = formaPago.iban;
      const correoElectronico = personaData.correo_electronico;
      let data;

      const servicioStripe = stripe(pagos.KEY);
      if (!correoElectronico || correoElectronico.length === 0) {
        data = {
          type: "sepa_debit",
          sepa_debit: { iban },
          billing_details: {
            name: `${personaData.nombre} ${personaData.primer_apellido} ${personaData.segundo_apellido}`,
            email: pagos.correo_defecto,
          },
        };
      } else {
        data = {
          type: "sepa_debit",
          sepa_debit: { iban },
          billing_details: {
            name: `${personaData.nombre} ${personaData.primer_apellido} ${personaData.segundo_apellido}`,
            email: correoElectronico,
          },
        };
      }

      const metodoPago = await servicioStripe.paymentMethods.create(data);

      const respuestaMetodoPago = await servicioStripe.paymentMethods.attach(
        metodoPago.id,
        { customer: personaData.nid_pasarela_pago }
      );

      await persona.actualizarMetodoPasarelaPago(
        formaPago.nid,
        respuestaMetodoPago.id
      );

      resolve();
    } else {
      console.log("No existe el usuario en la pasarela de pago");
      reject("No existe el usuario en la pasarela de pago");
    }
  } catch (error) {
    console.log(error);
    reject("Error al crear el método de pago");
  }
}

function crearMetodoPagoCuentaBancaria(nidFormaPago) {
  return new Promise((resolve, reject) => {
    asyncCrearMetodoPagoCuentaBancaria(nidFormaPago, resolve, reject);
  });
}

async function asyncCobrarPago(
  nidFormaPago,
  descripcion,
  cantidad,
  ipAddress,
  userAgent,
  resolve,
  reject
) {
  try {
    const existeFormaPago = await persona.existeFormaPago(nidFormaPago);

    if (existeFormaPago) {
      const formaPago = await persona.obtenerFormaPagoNid(nidFormaPago);

      if (
        formaPago.nid_metodo_pasarela_pago !== null &&
        formaPago.nid_metodo_pasarela_pago.length > 0
      ) {
        const personaData = await persona.obtenerPersona(formaPago.nid_titular);

        const servicioStripe = stripe(pagos.KEY);

        const data = {
          amount: cantidad,
          currency: "eur",
          payment_method: formaPago.nid_metodo_pasarela_pago,
          payment_method_types: ["sepa_debit"],
          customer: personaData.nid_pasarela_pago,
          description: descripcion,
          confirm: true,
          mandate_data: {
            customer_acceptance: {
              type: "online",
              online: {
                ip_address: ipAddress,
                user_agent: userAgent,
              },
            },
          },
        };

        const pago = await servicioStripe.paymentIntents.create(data);
        resolve(pago);
      } else {
        console.log(
          "pasarelaPago.js - cobrarPago -> La forma de pago " +
            nidFormaPago +
            " no está registrada en la pasarela de pagos"
        );
        reject("No está registrada en la pasarela de pagos");
      }
    } else {
      console.log(
        "pasarelaPago.js - cobrarPago -> No se ha encontrado la forma de pago"
      );
      reject("No se ha encontrado la forma de pago");
    }
  } catch (error) {
    console.log(error);
    reject("Error al realizar el pago");
  }
}

function cobrarPago(nidFormaPago, descripcion, cantidad, ipAddress, userAgent) {
  return new Promise((resolve, reject) => {
    asyncCobrarPago(
      nidFormaPago,
      descripcion,
      cantidad,
      ipAddress,
      userAgent,
      resolve,
      reject
    );
  });
}

async function asyncCobrarRemesa(
  nidRemesa,
  ipAddress,
  userAgent,
  resolve,
  reject
) {
  try {
    const remesaData = await remesa.obtenerRemesaNid(nidRemesa);

    if (remesaData.length > 0) {
      const remesaActual = remesaData[0];

      if (remesaActual.estado === constantes.ESTADO_REMESA_PENDIENTE) {
        const precio = Number(remesaActual.precio) * 100;
        const nidFormaPago = remesaActual.nid_forma_pago;

        const concepto = await remesa.obtenerConcepto(nidRemesa);
        const cobro = await cobrarPago(
          nidFormaPago,
          concepto,
          precio,
          ipAddress,
          userAgent
        );

        await remesa.actualizarIdCobroPasarelaPago(nidRemesa, cobro.id);
        await remesa.aprobarRemesa(
          nidRemesa,
          "Cobro realizado desde la pasarela de pago"
        );

        resolve();
      } else {
        console.log(
          "pasarelaPagos.js - cobrarRemesa -> La remesa " +
            nidRemesa +
            " no está en estado pendiente"
        );
        await remesa.remesaErronea(
          nidRemesa,
          "La remesa " + nidRemesa + " no está en estado pendiente"
        );
        reject("Error al realizar el cobro");
      }
    } else {
      console.log(
        "pasarelaPagos.js - cobrarRemesa -> No se ha encontrado la remesa"
      );
      await remesa.remesaErronea(nidRemesa, "No se ha encontrado la remesa");
      reject("Error al realizar el cobro");
    }
  } catch (error) {
    console.log("pasarelaPagos.js - cobrarRemesa -> " + error);
    try {
      await remesa.remesaErronea(
        nidRemesa,
        "Error al cobrar la remesa " + error
      );
    } catch (error) {
      console.log("pasarelaPagos.js - cobrarRemesa -> " + error);
    }
    reject("Error al realizar el cobro");
  }
}

function cobrarRemesa(nidRemesa, ipAddress, userAgent) {
  return new Promise((resolve, reject) => {
    asyncCobrarRemesa(nidRemesa, ipAddress, userAgent, resolve, reject);
  });
}

async function asyncRecuperarPago(nidPasarelaPago, resolve, reject) {
  const servicioStripe = stripe(pagos.KEY);
  const pagoRecuperado = await servicioStripe.paymentIntents.retrieve(
    nidPasarelaPago
  );

  console.log(pagoRecuperado.status);
}

function recuperarPago(nidPasarelaPago) {
  return new Promise((resolve, reject) => {
    asyncRecuperarPago(nidPasarelaPago, resolve, reject);
  });
}

async function asyncCobrarLote(nidLote, ipAddress, userAgent, resolve, reject) {
  try {
    const listaRemesas = await remesa.obtenerRemesa(nidLote);

    for (let i = 0; i < listaRemesas.length; i++) {
      try {
        await cobrarRemesa(listaRemesas[i].nid_remesa, ipAddress, userAgent);
      } catch (error) {
        console.log(
          "pasarelaPagos.js - cobrarLote -> Remesa " +
            listaRemesas[i].nid_remesa +
            " " +
            error
        );
      }
    }

    resolve();
  } catch (error) {
    console.log("pasarelaPagos.js - cobrarLote -> " + error);
    reject(error);
  }
}
function cobrarLote(nidLote, ipAddress, userAgent) {
  return new Promise((resolve, reject) => {
    asyncCobrarLote(nidLote, ipAddress, userAgent, resolve, reject);
  });
}

module.exports.crearUsuario = crearUsuario;
module.exports.crearMetodoPagoCuentaBancaria = crearMetodoPagoCuentaBancaria;
module.exports.cobrarPago = cobrarPago;
module.exports.cobrarRemesa = cobrarRemesa;
module.exports.recuperarPago = recuperarPago;
module.exports.cobrarLote = cobrarLote;
