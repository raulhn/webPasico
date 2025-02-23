const pagos = require('../config/pagos.js');
const persona = require('./persona.js');
const stripe = require('stripe');


//https://docs.stripe.com/api/

function existe_usuario_pasarela_pago(nid_persona)
{
    return new Promise(
        async (resolve, reject) =>
        {
            try
            {
                let v_persona = await persona.obtener_persona(nid_persona);
                v_nid_pasarela_pago = v_persona['nid_pasarela_pago'];
                resolve(v_nid_pasarela_pago !== null || v_nid_pasarela_pago.length > 0);
           }
           catch(error)
           {
                console.log(error);
                resolve(false);
           }
        }
    )
}

function crear_usuario(nid_persona)
{
    return new Promise(
        async (resolve, reject) =>
        {
            try
            {
                let bExiste_persona = await existe_usuario_pasarela_pago(nid_persona);
                if (!bExiste_persona)
                {
                    let servicio_stripe = stripe(pagos.KEY);
                    let v_persona = await persona.obtener_persona(nid_persona);
                    let data = {
                                name: v_persona.etiqueta,
                                email: v_persona.correo_electronico
                                };

                    const cliente = await servicio_stripe.customers.create(data);

                    await persona.actualizar_user_pasarela_pago(nid_persona, cliente.id);
                    resolve();
                }
                else {
                      console.log('Error: el usuario ya tiene un usuario de pasarela de pago');
                      reject('Error al crear el usuario');
                }
            }
            catch(error)
            {
                console.log(error);
                reject('Error al crear el usuario');
            }
        }
    );
}

function crear_metodo_pago_cuenta_bancaria(nid_forma_pago)
{
    return new Promise(
        async(resolve, reject) =>
        {

            try
            {

                let v_forma_pago = await persona.obtener_forma_pago_nid(nid_forma_pago);

                let v_persona = await persona.obtener_persona(v_forma_pago.nid_titular);


                let bExiste_persona = await existe_usuario_pasarela_pago(v_persona.nid);
                
                if(bExiste_persona)
                {
                    let v_iban = v_forma_pago.iban;

                    let servicio_stripe = stripe(pagos.KEY);
                    let data = {
                        type: 'sepa_debit',
                        sepa_debit: {iban: v_iban},
                        billing_details:{
                            name: v_persona.nombre + ' ' + v_persona.primer_apellido + ' ' + v_persona.segundo_apellido,
                            email: v_persona.correo_electronico
                        }
                    }

                    metodo_pago = await servicio_stripe.paymentMethods.create(data)

                    let respuesta_metodo_pago = await servicio_stripe.paymentMethods.attach(
                        metodo_pago.id,
                        {customer: v_persona.nid_pasarela_pago}
                    );

                    await persona.actualizar_metodo_pasarela_pago(v_forma_pago.nid, respuesta_metodo_pago.id);

                    resolve();
                }
                else
                {
                    console.log('No existe el usuario en la pasarela de pago');
                    reject('Error al crear el método de pago');
                }
            }
            catch(error)
            {
                console.log(error);
                reject('Error al crear el método de pago');
            }
        }
    );
}

function cobrar_pago(nid_forma_pago, cantidad, p_ip_address, p_user_agent)
{
    return new Promise(
        async (resolve, reject) =>
        { 
            try
            {
                let v_forma_pago = await persona.obtener_forma_pago_nid(nid_forma_pago);

                let v_persona = await persona.obtener_persona(v_forma_pago.nid_titular);

                let servicio_stripe = stripe(pagos.KEY);

                let data =  { amount: cantidad,
                            currency: 'eur',
                            payment_method: v_forma_pago.nid_metodo_pasarela_pago,
                            payment_method_types: ['sepa_debit'],
                            customer: v_persona.nid_pasarela_pago,
                            confirm: true,
                            mandate_data: {
                                customer_acceptance:{
                                    type: 'online',
                                    online: {
                                        ip_address: p_ip_address,
                                        user_agent: p_user_agent
                                    }
                                }
                            }
                }
                
                console.log(data)
                let pago = await servicio_stripe.paymentIntents.create(data);

                console.log(pago);
                resolve();
            }
            catch(error)
            {
                console.log(error);
                reject('Error al realizar el pago');
            }

        }
    )
}



module.exports.crear_usuario = crear_usuario;
module.exports.crear_metodo_pago_cuenta_bancaria = crear_metodo_pago_cuenta_bancaria;
module.exports.cobrar_pago = cobrar_pago;