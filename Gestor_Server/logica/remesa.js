const conexion = require('../conexion.js')
const constantes = require('../constantes.js')



function existe_persona_sin_foma_pago()
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select count(*) num ' +
                                ' from pasico_gestor.matricula m, pasico_gestor.matricula_asignatura ma, pasico_gestor.persona p ' +
                                'where m.nid_persona = p.nid and m.nid = ma.nid_matricula and nid_forma_pago is null',
                (error, results, fields) =>
                {
                    if(error) {console.log(error); reject()}
                    else{
                        resolve(results[0]['num'] > 0);
                    }
                }
            )
        }
    )
}
function generar_remesa()
{
    return new Promise(
        async (resolve, reject) =>
        {
            bExisten_sin_forma_pago = await existe_persona_sin_foma_pago();
            
            if(bExisten_sin_forma_pago)
            {
                reject('Hay gente que no tiene asociada una forma de pago')
            }
            else
            {
                conexion.dbConn.query('select m.*, ma.*, p.nombre, p.primer_apellido, p.segundo_apellido, p.nid_forma_pago ' +
                                      ' from pasico_gestor.matricula m, pasico_gestor.matricula_asignatura ma, pasico_gestor.persona p, pasico_gestor.asignatura a ' +
                                      ' where m.nid_persona = p.nid and m.nid = ma.nid_matricula and ma.nid_asignatura = a.nid',
                    (error, results, fields) =>
                    {
                        if(error) {console.log(error); }
                        else{
                            for (let i=0; i<results.length; i++)
                            {
                                
                            }
                        }
                    }
                );
            }
        }
    )
}


function existe_socio(v_forma_pago)
{
	return new Promise(
	  (resolve, reject) =>
	  {
	     conexion.dbConn.query("select count(*) cont " +
		                       "from pasico_gestor.socios s, pasico_gestor.persona p "+
                               "where s.nid_persona = p.nid	" +
                                  "and p.nid_forma_pago = " + conexion.dbConn.escape(v_forma_pago),
			(error, results, fields) =>
			{
				if(error) {console.log(error); reject();}
				else {resolve(results[0]['cont'] > 0);}
			}
         );
	  })
}



function obtener_matricula_asignatura_activa(v_persona)
{
	return new Promise(
	  (resolve, reject) =>
	  {
		conexion.dbConn.query("select a.precio, m.precio_manual, a.nid " +
							  "from pasico_gestor.matricula_asignatura ma, pasico_gestor.matricula m, pasico_gestor.asignatura a " +
							  "where ma.nid_matricula = m.nid " +
							    "and ma.nid_asignatura = a.nid " +
								"and m.nid_persona = " + conexion.dbConn.escape(v_persona) + " " +
								"and m.nid_curso = (select max(nid) from pasico_gestor.curso) " +
								"and (ma.fecha_baja is null or ma.fecha_baja < sysdate())",
			(error, results, fields) =>
			{
				if(error) {console.log(error); reject();}
				else {resolve(results)}
			}		)	
	  });

}



function registrar_remesa(v_forma_pago, v_persona)
{
	return new Promise(
		(resolve, reject) =>
		{
			conexion.dbConn.beginTransaction(
				() =>
				{
					conexion.dbConn.query("insert into " + constantes.ESQUEMA_BD + ".remesa(nid_forma_pago, nid_persona, concepto) " +
							"values(" + conexion.dbConn.escape(v_forma_pago) + ", " + conexion.dbConn.escape(v_persona) + ", " +
							"'Pago Mensual')",
						(error, results, fields) =>
						{
							if(error) {conexion.dbConn.rollback(); console.log(error); reject();}
							else {conexion.dbConn.commit(); resolve(results.insertId);}
						})
				}
			);
		}
	);
}

function registrar_linea_remesa(v_remesa, v_precio, v_asignatura)
{
	return new Promise(
		(resolve, reject) =>
		{
			conexion.dbConn.beginTransaction(
				() =>
				{
					conexion.dbConn.query("insert into " + constantes.ESQUEMA_BD + ".linea_remesa(nid_remesa, concepto, precio) " +
							"values(" + conexion.dbConn.escape(v_remesa) + ", " + conexion.dbConn.escape(v_asignatura) + ", " + conexion.dbConn.escape(v_precio) + ")",
						(error, results, fields) =>
						{
							if(error) {console.log(error); conexion.dbConn.rollback(); reject();}
							else {conexion.dbConn.commit(); resolve(results.insertId);}
						})
					
				}
			);
		}
	);
}

function registrar_descuento(nid_linea_remesa, concepto)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query("insert into " + constantes.ESQUEMA_BD + ".linea_remesa_descuento(nid_line_remesa, concepto) values(" +
                    conexion.dbConn.escape(nid_linea_remesa) + ", " + conexion.dbConn.escape(concepto) + ")",
                (error, results, fields) =>
                {
                    if(error) {console.log(error); conexion.dbConn.rollback(); reject();}
                    else {conexion.dbConn.commit(); resolve();}
                }
            )
        }

    )
}

function obtener_personas_activas(v_forma_pago)
{
	return new Promise(
	  (resolve, reject) =>
	  {
		conexion.dbConn.query("select p.nid " +
		                      "from pasico_gestor.matricula m, pasico_gestor.persona p, pasico_gestor.matricula_asignatura ma " +
							  "where m.nid_persona = p.nid " +
							    "and m.nid = ma.nid_matricula " +
								"and m.nid_curso = (select max(nid) from pasico_gestor.curso) " +
								"and p.nid_forma_pago is not null " +
								"and nid_forma_pago = " + conexion.dbConn.escape(v_forma_pago) + " " +
								"and (ma.fecha_baja is null or ma.fecha_baja < sysdate()) " +
							  "group by p.nid",
			(error, results, fields) =>
			{
				if(error) {console.log(error); reject()}
				else {resolve(results);}
			}
        )
	  }
	);
}

function obtener_forma_pago()
{
	return new Promise(
		(resolve, reject) =>
		{
			let REBAJA_VIENTO_CUERDA = 15;
			let PORCENTAJE_FAMILIA = 20;
			let SUMA_PRECIO_NO_SOCIO = 10;
			
			conexion.dbConn.query("select * " +
							      "from pasico_gestor.forma_pago fp " +
								  "where fp.nid in (" +
								    "select nid_forma_pago " +
									"from pasico_gestor.matricula m, pasico_gestor.persona p " +
									"where m.nid_persona = p.nid " +
									  "and m.nid_curso = (select max(nid) from pasico_gestor.curso) " +
									  "and p.nid_forma_pago is not null " +
									"group by nid_forma_pago)",
				async (error, results, fields) =>
				{
					let formas_pago = results;
					
					for (let i = 0; i < formas_pago.length; i++)
					{
						let forma_pago = formas_pago[i];
						let personas_pago = await obtener_personas_activas(forma_pago.nid_forma_pago);
						
						let v_precio_persona = 0;
						
						let instrumento_banda = 0;
						let instrumento_cuerda = 0;
						
                        
						for(let j = 0; j < personas_pago.length; j++)
						{
                            let nid_remesa = await registrar_remesa(forma_pago, personas_pago[j]['nid']);

							let matriculas_precios = await obtener_matricula_asignatura_activa(personas_pago[j]['nid']);
							
							for(let z = 0; z < matriculas_precios.length; z++)
							{
                                let descuentos;
								if (matriculas_precios[z]['precio_manual'] != null )
								{
									v_precio_persona = matriculas_precios[z]['precio_manual'];
								}
								else
								{
									if (matriculas_precios[z]['instrumento_banda'] == 1)
									{
										instrumento_banda = 1;
									}
									else if(matriculas_precios[z]['instrumento_banda'] == 2)
									{
										instrumento_cuerda = 1;
                                        descuentos.push('Precio estándar para instrumentos que no son de banda')
									}
									
									v_precio_persona = v_precio_persona  + matriculas_precios[z]['precio'];
									
									// Descuento por instrumento de banda y cuerda //
									if (instrumento_banda && instrumento_cuerda)
									{
										v_precio_persona = v_precio_persona - REBAJA_VIENTO_CUERDA;
                                        descuentos.push('Descuento por instrumento de banda y cuerda -' +  REBAJA_VIENTO_CUERDA)
									}
									
									// Descuento por familia //
									v_precio_persona = v_precio_persona * (1 - (PORCENTAJE_FAMILIA * z / 100))
									
									// No hay un socio //
									if (!existe_socio(formas_pago[i]))
									{
										v_precio_persona = v_precio_persona + SUMA_PRECIO_NO_SOCIO;
                                        descuentos.push('Pago extra por no tener ningún miembro como socio ' || SUMA_PRECIO_NO_SOCIO)
									}
								}
                                let nid_linea_remesa = await registrar_linea_remesa(nid_remesa, v_precio_persona, matriculas_precios[z]['nid']);

                                for (let k=0; k<descuentos.lengt; k++)
                                {
                                    await registrar_descuento(nid_linea_remesa, descuentos[k]);
                                }
							}
						}
					}
				}
            )
		}
	);
}