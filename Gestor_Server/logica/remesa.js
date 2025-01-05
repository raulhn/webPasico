const conexion = require('../conexion.js')
const constantes = require('../constantes.js')
const persona = require('./persona.js')
const gestor_matricula = require('./matricula.js')
const parametros = require('./parametros.js')

const { obtener_instrumentos, registrar_instrumento_persona } = require('./musico.js')


function existe_persona_sin_foma_pago()
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query('select count(*) num ' +
                                ' from ' + constantes.ESQUEMA_BD + '.matricula m, ' + constantes.ESQUEMA_BD + '.matricula_asignatura ma, ' + constantes.ESQUEMA_BD + '.persona p ' +
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

function existe_socio(nid_forma_pago)
{
	return new Promise(
	  (resolve, reject) =>
	  {

	    conexion.dbConn.query("select count(*) cont " +
		                       "from " + constantes.ESQUEMA_BD + ".socios s, " + constantes.ESQUEMA_BD + ".persona p "+
                               "where s.nid_persona = p.nid " +
                                  "and p.nid_forma_pago = " + conexion.dbConn.escape(nid_forma_pago),
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
							  "from " + constantes.ESQUEMA_BD + ".matricula_asignatura ma, " + constantes.ESQUEMA_BD + ".matricula m, " + constantes.ESQUEMA_BD + ".asignatura a " +
							  "where ma.nid_matricula = m.nid " +
							    "and ma.nid_asignatura = a.nid " +
								"and m.nid_persona = " + conexion.dbConn.escape(v_persona) + " " +
								"and m.nid_curso = (select max(nid) from " + constantes.ESQUEMA_BD + ".curso) " +
								"and (ma.fecha_baja is null or ma.fecha_baja < sysdate())",
			(error, results, fields) =>
			{
				if(error) {console.log(error); reject();}
				else {resolve(results)}
			}		)	
	  });

}

function obtener_matricula_asignatura(nid_matricula)
{
	return new Promise(
		(resolve, reject) =>
		{
			conexion.dbConn.query("select a.precio, m.precio_manual, a.nid " +
			"from " + constantes.ESQUEMA_BD + ".matricula_asignatura ma, " + constantes.ESQUEMA_BD + ".matricula m, " + constantes.ESQUEMA_BD + ".asignatura a " +
			"where ma.nid_matricula = m.nid " +
			  "and ma.nid_asignatura = a.nid " +
			  "and m.nid = " + conexion.dbConn.escape(nid_matricula),
			(error, results, fields) =>
			{
			if(error) {console.log(error); reject();}
			else {resolve(results)}
			}		)	
		}
	)
}

function obtener_siguiente_lote()
{
	return new Promise(
		(resolve, reject) =>
		{
			conexion.dbConn.query(" select ifnull(max(lote), 0) + 1 lote from pasico_gestor.remesa",
				(error, results, fields) =>
				{
					if(error) {console.log(error); reject();}
					else {resolve(results[0]['lote'])}
				})
		}
	)
}

function registrar_remesa(v_persona, v_siguiente_lote, v_precio, v_nid_forma_pago)
{
	return new Promise(
		(resolve, reject) =>
		{
			conexion.dbConn.beginTransaction(
				async () =>
				{
					let persona_recuperada = await persona.obtener_persona(v_persona);
				
					conexion.dbConn.query("insert into " + constantes.ESQUEMA_BD + ".remesa(nid_forma_pago, nid_persona, concepto, fecha, lote, precio, estado) " +
							"values(" + conexion.dbConn.escape(v_nid_forma_pago) + ", " + conexion.dbConn.escape(v_persona) + ", " +
							"'Pago Mensual  " + persona_recuperada['etiqueta'] + "' , sysdate(), " + conexion.dbConn.escape(v_siguiente_lote) +
							", " + conexion.dbConn.escape(v_precio) +", 'Pendiente')",
						(error, results, fields) =>
						{
							if(error) {conexion.dbConn.rollback(); console.log(error); reject();}
							else {conexion.dbConn.commit();  resolve(results.insertId);}
						})
				}
			);
		}
	);
}

function registrar_linea_remesa(v_remesa, v_precio, v_concepto)
{
	return new Promise(
		(resolve, reject) =>
		{
			conexion.dbConn.beginTransaction(
				() =>
				{
					conexion.dbConn.query("insert into " + constantes.ESQUEMA_BD + ".linea_remesa(nid_remesa, concepto, precio) " +
							"values(" + conexion.dbConn.escape(v_remesa) + ", " + conexion.dbConn.escape(v_concepto) + ", " + conexion.dbConn.escape(v_precio) + ")",
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

function registrar_descuento(nid_remesa, concepto)
{
    return new Promise(
        (resolve, reject) =>
        {
            conexion.dbConn.query("insert into " + constantes.ESQUEMA_BD + ".remesa_descuento(nid_remesa, concepto) values(" +
                    conexion.dbConn.escape(nid_remesa) + ", " + conexion.dbConn.escape(concepto) + ")",
                (error, results, fields) =>
                {
                    if(error) {console.log(error); conexion.dbConn.rollback(); reject();}
                    else {conexion.dbConn.commit(); resolve();}
                }
            )
        }

    )
}


function obtener_matriculas_activas(nid_socio)
{
	return new Promise(
	  (resolve, reject) =>
	  {
		conexion.dbConn.query("select  p.nid nid_persona, m.nid nid_matricula, p.nid_forma_pago " +
		                      "from " + constantes.ESQUEMA_BD + ".matricula m, " + constantes.ESQUEMA_BD + ".persona p, " + constantes.ESQUEMA_BD + ".matricula_asignatura ma " +
							  "where m.nid_persona = p.nid " +
							    "and m.nid = ma.nid_matricula " +
								"and m.nid_curso = (select max(nid) from " + constantes.ESQUEMA_BD + ".curso) " +
								"and (nid_persona = " + conexion.dbConn.escape(nid_socio) + " or nid_socio = " + conexion.dbConn.escape(nid_socio) + ") " +
								"and (ma.fecha_baja is null or ma.fecha_baja < sysdate()) " +
							  "group by p.nid, m.nid, p.nid_forma_pago " +
							  "order by p.fecha_nacimiento, p.nid",
			(error, results, fields) =>
			{
				if(error) {console.log(error); reject()}
				else {resolve(results);}
			}
        )
	  }
	);
}

function comprueba_es_socio(nid_persona)
{
	return new Promise(
		(resolve, reject) =>
		{
			conexion.dbConn.query(" select 'S' " + 
				                  "from " + constantes.ESQUEMA_BD + ".persona p " +
								  " where nid = " + conexion.dbConn.escape(nid_persona) + 
								     " and (exists (select '1' " +
								                 " from " + constantes.ESQUEMA_BD + ".socios s where s.nid_persona = p.nid) " +
									" or exists (select '1' from " + constantes.ESQUEMA_BD + ".socios s where s.nid_persona = p.nid_socio))",
				(error, results, fields) =>
				{
					if(error) {console.log(error); reject(error)}
					else {resolve(results.length > 0)}
				} )
		}
	)
}

function obtener_nid_socio(nid_persona)
{
	return new Promise(
		(resolve, reject) =>
		{
			conexion.dbConn.query('select nid_persona from ' + constantes.ESQUEMA_BD + '.socios where nid_persona = ' + conexion.dbConn.escape(nid_persona),
				(error, results, fields) =>
				{
					if(error) {console.log(error); reject(error);}
					else
					{
						if(results.length > 0)
						{
							resolve(results[0]['nid_persona'])
						}
						else
						{
							conexion.dbConn.query('select nid_socio from ' + constantes.ESQUEMA_BD + '.persona where nid = ' + conexion.dbConn.escape(nid_persona),
							  (error, results, fields) =>
							  {
								if(error) {console.log(error); reject(error);}
								else {resolve(results[0]['nid_socio'])}
							  });
						}
					}
				})
		}
	)
}

async function precio_matricula(nid_matricula, num_familiar)
{
	return new Promise(
	  async (resolve, reject) =>
	  {
		var valor_recuperado = await parametros.obtener_valor('REBAJA_VIENTO_CUERDA');
		const REBAJA_VIENTO_CUERDA = valor_recuperado['valor'];

		valor_recuperado = await parametros.obtener_valor('SUMA_PRECIO_NO_SOCIO');
		const SUMA_PRECIO_NO_SOCIO = valor_recuperado['valor'];

		valor_recuperado = await parametros.obtener_valor('PRECIO_INSTRUMENTO_BANDA');
		const PRECIO_INSTRUMENTO_BANDA = valor_recuperado['valor'];

		valor_recuperado = await parametros.obtener_valor('PRECIO_INSTRUMENTO_NO_BANDA');
		const PRECIO_INSTRUMENTO_NO_BANDA = valor_recuperado['valor'];

		valor_recuperado = await parametros.obtener_valor('PRECIO_LENGUAJE');
		const PRECIO_LENGUAJE = valor_recuperado['valor'];

		
		valor_recuperado = await parametros.obtener_valor('PORCENTAJE_DESCUENTO_FAMILIA');
		const PORCENTAJE_FAMILIA = valor_recuperado['valor'];


		const ASIGNATURA_INSTRUMENTO_BANDA = 1;
		const ASIGNATURA_INSTRUMENTO_NO_BANDA = 2;
		const ASIGNATURA_LENGUAJE = 0;
		const ASIGNATURA_BANDA = 3;

		let v_precio_persona = 0;
							
		let instrumento_banda = 0;
		let instrumento_cuerda = 0;

		let asignaturas_precio = await gestor_matricula.obtener_asignaturas_matricula(nid_matricula);
		let datos_matricula = await gestor_matricula.obtener_matricula(nid_matricula);

		var resumen_matricula = new Object();
		resumen_matricula.precio = 0;
		resumen_matricula.nid_matricula = nid_matricula;

		var info = "";

		let descuentos = [];
		let linea_remesas = [];

		// Obtiene si es socio //
		var es_socio = await comprueba_es_socio(datos_matricula['nid_persona']);


		if (datos_matricula['precio_manual'] != null && datos_matricula['precio_manual'] != "")
		{
			var linea_remesa = new Object();

			linea_remesa.precio = datos_matricula['precio_manual'];
			linea_remesa.concepto = 'Precio manual para el alumno ' + datos_matricula['nombre_alumno'];

			linea_remesas.push(linea_remesa);

			resumen_matricula.precio = linea_remesa.precio
		}
		else
		{
			for(let z = 0; z < asignaturas_precio.length; z++)
			{
				v_precio_persona = 0;
				var linea_remesa = new Object();

				v_tipo_asignatura = asignaturas_precio[z]['tipo_asignatura'];

				if (v_tipo_asignatura == ASIGNATURA_INSTRUMENTO_BANDA && es_socio)
				{
					instrumento_banda = 1;
					v_precio_persona = PRECIO_INSTRUMENTO_BANDA;	
					info = 'Precio Instrumento de Banda';
				}
				else if(v_tipo_asignatura == ASIGNATURA_INSTRUMENTO_BANDA && !es_socio)
				{
					v_precio_persona = PRECIO_INSTRUMENTO_NO_BANDA;
					info = 'Precio Instrumento no de Banda al no estar asociado a un Socio';
				}
				else if(v_tipo_asignatura == ASIGNATURA_INSTRUMENTO_NO_BANDA)
				{
					instrumento_cuerda = 1;
					v_precio_persona = PRECIO_INSTRUMENTO_NO_BANDA;
					info = 'Precio Instrumento no de Banda';
				}
				else if(v_tipo_asignatura == ASIGNATURA_LENGUAJE)
				{
					v_precio_persona = PRECIO_LENGUAJE;
					info = 'Precio Lenguaje Musical';
				}
				else if(v_tipo_asignatura = ASIGNATURA_BANDA)
				{
					v_precio_persona = 0;
					info = 'Precio Banda / Conjunto';
				}

				linea_remesa.precio = v_precio_persona;
				linea_remesa.concepto = 'Precio para el alumno ' + datos_matricula['nombre_alumno'] + ' en la asignatura ' + asignaturas_precio[z]['nombre_asignatura'] + ' ('+ info +')';
				linea_remesas.push(linea_remesa);

				resumen_matricula.precio = parseFloat(v_precio_persona) + parseFloat(resumen_matricula.precio);
			}

			// Descuento por familia //
			if (num_familiar > 0 && es_socio)
			{
				let descuento_familiar =  (parseFloat(PORCENTAJE_FAMILIA) * num_familiar);
				let num_miembro = num_familiar + 1;
				resumen_matricula.precio =  parseFloat(resumen_matricula.precio) * (1 - (descuento_familiar/ 100));

				descuentos.push('Descuento por familiar ' + descuento_familiar + '% ' + num_miembro + 'º miembro');
			}

			// Se comprueba si se añade el extra por no ser socio //
			if (!es_socio)
			{
				resumen_matricula.precio = parseFloat(resumen_matricula.precio)+ parseFloat(SUMA_PRECIO_NO_SOCIO);
				descuentos.push(SUMA_PRECIO_NO_SOCIO + '€ - Precio extra por no ser socio ');
			}

			// Descuento por instrumento de banda y cuerda //
			if (instrumento_banda && instrumento_cuerda && es_socio)
			{
				resumen_matricula.precio =  parseFloat(resumen_matricula.precio) -  parseFloat(REBAJA_VIENTO_CUERDA);
				descuentos.push('-' + REBAJA_VIENTO_CUERDA + '€ - Descuento por instrumento de banda y cuerda')
			}
		}

		resumen_matricula.descuentos = descuentos;
		resumen_matricula.linea_remesas = linea_remesas;

		resolve(resumen_matricula);
	});
}


function eliminar_descuento_lote(v_lote)
{
	return new Promise(
		(resolve, reject) =>
		{
			conexion.dbConn.query('delete from ' + constantes.ESQUEMA_BD + '.remesa_descuento ' +
			                      ' where nid_remesa in (select nid_remesa from ' + constantes.ESQUEMA_BD + 
								  '.remesa where lote = ' + conexion.dbConn.escape(v_lote) + ')',
				(error, results, fields) =>
				{
					if(error) {console.log(error); reject()}
					else {resolve();}
				}
			)
		}
	)
}

function eliminar_linea_remesa_lote(v_lote)
{
	return new Promise(
		(resolve, reject) =>
		{
			conexion.dbConn.query('delete from ' + constantes.ESQUEMA_BD + '.linea_remesa ' +
			                      ' where nid_remesa in (select nid_remesa from ' + constantes.ESQUEMA_BD + 
								  '.remesa where lote = ' + conexion.dbConn.escape(v_lote) + ')',
				(error, results, fields) =>
				{
					if(error) {console.log(error); reject()}
					else {resolve();}
				}
			)
		}
	)
}

function limpiar_lote(v_lote)
{
	return new Promise (
		(resolve, reject) =>
		{
			conexion.dbConn.beginTransaction(
				async () =>
				{
					try
					{
						await eliminar_descuento_lote(v_lote);
						await eliminar_linea_remesa_lote(v_lote);
						conexion.dbConn.query('delete from ' + constantes.ESQUEMA_BD + '.remesa ' +
										' where lote = ' + conexion.dbConn.escape(v_lote),
							(error, results, fields) =>
							{
								if(error) {console.log(error); reject(); conexion.dbConn.rollback();}
								else {conexion.dbConn.commit(); resolve();}
							}		
						)
					}
					catch(error)
					{
						conexion.dbConn.rollback();
						reject();
					}
				}
			)
		}
	);
}

function registrar_remesa_matriculas()
{
	return new Promise(
		async (resolve, reject) =>
		{
			let personas_matricula_activa = await gestor_matricula.obtener_personas_con_matricula_activa();
			var v_siguiente_lote = await obtener_siguiente_lote();
			for (let i=0; i < personas_matricula_activa.length; i++)
			{
				let nid_persona = personas_matricula_activa[i]['nid'];
				let nid_matricula = personas_matricula_activa[i]['nid_matricula'];

				await registrar_remesa_persona(nid_matricula, v_siguiente_lote);
			}

			resolve();
		}
	)
}

function registrar_remesa_persona(nid_matricula, lote)
{
	return new Promise(
		async (resolve, reject) =>
		{
			let v_matricula = await gestor_matricula.obtener_matricula(nid_matricula);
			let nid_persona = v_matricula['nid_persona'];

			let bEs_socio = await comprueba_es_socio(nid_persona);
			let persona_recuperada = await persona.obtener_persona(nid_persona);

			if (bEs_socio)
			{
				let nid_socio = await obtener_nid_socio(nid_persona);
				let v_personas_activas = await obtener_matriculas_activas(nid_socio);

				var v_resumen_matricula = null;

				if (v_personas_activas !== undefined)
				{
					for(let i = 0; i < v_personas_activas.length; i++)
					{
						if (v_personas_activas[i]['nid_matricula'] == nid_matricula)
						{
							v_resumen_matricula = await precio_matricula(nid_matricula, i);
							let v_precio_remesa = v_resumen_matricula.precio;
							let nid_remesa = await registrar_remesa(persona_recuperada['nid'], lote, v_precio_remesa, persona_recuperada['nid_forma_pago']);

							for (let z = 0; z < v_resumen_matricula.linea_remesas.length; z++)
							{
								await registrar_linea_remesa(nid_remesa, v_resumen_matricula.linea_remesas[z].precio, v_resumen_matricula.linea_remesas[z].concepto)
							}

							for (let z = 0; z < v_resumen_matricula.descuentos.length; z++)
							{
								await registrar_descuento(nid_remesa, v_resumen_matricula.descuentos[z]);
							}
							resolve();
						}
					}
				}
			}
			else
			{
				v_resumen_matricula = await precio_matricula(nid_matricula, 0);
				let v_precio_remesa = v_resumen_matricula.precio;
				let nid_remesa = await registrar_remesa(persona_recuperada['nid'], lote, v_precio_remesa, persona_recuperada['nid_forma_pago']);

				for (let z = 0; z < v_resumen_matricula.linea_remesas.length; z++)
				{
					await registrar_linea_remesa(nid_remesa, v_resumen_matricula.linea_remesas[z].precio, v_resumen_matricula.linea_remesas[z].concepto)
				}

				for (let z = 0; z < v_resumen_matricula.descuentos.length; z++)
				{
					await registrar_descuento(nid_remesa, v_resumen_matricula.descuentos[z]);
				}
				resolve();
			}	
		}
	);
}


function obtener_remesas(fecha_desde, fecha_hasta)
{
	return new Promise(
		(resolve, reject) =>
		{
			conexion.dbConn.query("select r.*, p.* " +
								  "from " + constantes.ESQUEMA_BD + ".remesa r, " + constantes.ESQUEMA_BD + ".persona p " +
								  'where r.fecha >= str_to_date(nullif(' + conexion.dbConn.escape(fecha_desde) + ', \'\') , \'%Y-%m-%d\') ' +
								    'and r.fecha <= str_to_date(nullif(' + conexion.dbConn.escape(fecha_hasta) + ', \'\') , \'%Y-%m-%d\') ' +
									'and p.nid = r.nid_persona',
				(error, results, fields) =>
				{
					if (error) {console.log(error); reject()}
					else  {resolve(results)}
				}
			)
		}
	)
}

function obtener_remesa(lote)
{
	return new Promise(
		(resolve, reject) =>
		{
			conexion.dbConn.query('select * from ' + constantes.ESQUEMA_BD +
			   		".remesa where lote = " + conexion.dbConn.escape(lote),
			    (error, results, fields) =>
				{
					if (error) {console.log(error); reject();}
					else {resolve(results)}
				} 
		  )
		}
	)
}

function obtener_remesa_pendiente(lote)
{
	return new Promise(
		(resolve, reject) =>
		{
			conexion.dbConn.query('select * from ' + constantes.ESQUEMA_BD +
			   		".remesa where lote = " + conexion.dbConn.escape(lote) +
					" and estado = 'Pendiente'",
			    (error, results, fields) =>
				{
					if (error) {console.log(error); reject();}
					else {resolve(results)}
				} 
		  )
		}
	)
}

function obtener_remesa_estado(lote, estado)
{
	return new Promise(
		(resolve, reject) =>
		{
			console.log('Estado ' + estado)
			conexion.dbConn.query('select * from ' + constantes.ESQUEMA_BD +
			   		".remesa where lote = " + conexion.dbConn.escape(lote)
					 + ' and estado = ' + conexion.dbConn.escape(estado),
			    (error, results, fields) =>
				{
					if (error) {console.log(error); reject();}
					else {resolve(results)}
				} 
		  )
		}
	)
}



function obtener_lineas_remesa(nid_remesa)
{
	return new Promise(
		(resolve, reject) =>
		{
			conexion.dbConn.query('select * from ' + constantes.ESQUEMA_BD + '.linea_remesa where nid_remesa = '
					+ conexion.dbConn.escape(nid_remesa),
				(error, results, fields) =>
				{
					if (error) {console.log(error); reject();}
					else {resolve(results)}
				} );
		}
	)
}

function obtener_descuentos_remesa(nid_remesa)
{
	return new Promise(
		(resolve, reject) =>
		{
			conexion.dbConn.query('select * from ' + constantes.ESQUEMA_BD + '.remesa_descuento where nid_remesa = '
					+ conexion.dbConn.escape(nid_remesa),
				(error, results, fields) =>
				{
					if (error) {console.log(error); reject();}
					else {resolve(results)}
				} );
		}
	)
}


function obtener_precio_matricula(nid_matricula)
{
	return new Promise(
	 async (resolve, reject) =>
	 {
		let v_matricula = await gestor_matricula.obtener_matricula(nid_matricula);
		let nid_persona = v_matricula['nid_persona'];

		// Comprueba si es socio o tiene un socio asociado //
		let bEs_socio = await comprueba_es_socio(nid_persona);

		if (bEs_socio)
		{
			let nid_socio = await obtener_nid_socio(nid_persona);
			let v_personas_activas = await obtener_matriculas_activas(nid_socio);

			var v_resumen_matricula = null;

			if (v_personas_activas !== undefined)
			{
				for(let i = 0; i < v_personas_activas.length; i++)
				{
					if (v_personas_activas[i]['nid_matricula'] == nid_matricula)
					{
						v_resumen_matricula = await precio_matricula(nid_matricula, i);
						resolve(v_resumen_matricula);
					}
				}
			}
		}
		else
		{ 
			v_resumen_matricula = await precio_matricula(nid_matricula, 0);
			resolve(v_resumen_matricula);
	    }
	 }
	)
}

function obtener_ultimo_lote()
{
	return new Promise(
		async (resolve, reject) =>
		{
			conexion.dbConn.query('select ifnull(max(lote), 0) ultimo_lote from ' + constantes.ESQUEMA_BD + '.remesa',
				(error, results, fields) =>
				{
					if(error) {console.log(error); reject();}
					else {resolve(results[0]['ultimo_lote'])}
				}
			
			)
		}

	)
}

function obtener_remesa_nid(nid_remesa)
{
	return new Promise(
		async (resolve, reject) =>
		{
			conexion.dbConn.query('select * from ' + constantes.ESQUEMA_BD +
			   		".remesa where nid_remesa = " + conexion.dbConn.escape(nid_remesa),
			    (error, results, fields) =>
				{
					if (error) {console.log(error); reject();}
					else {resolve(results)}
				} 
		  )
		}
	)
}

function actualizar_estado(nid_remesa, estado, anotaciones)
{
	return new Promise(
		async (resolve, reject) =>
		{
			conexion.dbConn.beginTransaction(
				() =>
			conexion.dbConn.query('update ' + constantes.ESQUEMA_BD + '.remesa set estado = ' + conexion.dbConn.escape(estado) +
					', anotaciones = ' + conexion.dbConn.escape(anotaciones) +
					' where nid_remesa = ' + conexion.dbConn.escape(nid_remesa),
				(error, results, fields) =>
				{
					if(error) {console.log(error); reject()}
					else {resolve()}
				}

			)
			);
		}
	)
}

async function aprobar_remesas(lote, anotaciones)
{
	let remesas = await obtener_remesa_pendiente(lote);

	for (let i=0; i<remesas.length; i++)
	{
		await actualizar_estado(remesas[i]['nid_remesa'], 'Pagado', anotaciones)
	}
}

async function rechazar_remesa(nid_remesa, anotaciones)
{
	await actualizar_estado(nid_remesa, 'Rechazado', anotaciones)
}

async function aprobar_remesa(nid_remesa, anotaciones)
{
	await actualizar_estado(nid_remesa, 'Pagado', anotaciones);
}

module.exports.registrar_remesa = registrar_remesa;
module.exports.registrar_remesa_persona = registrar_remesa_persona;
module.exports.registrar_remesa_matriculas = registrar_remesa_matriculas;

module.exports.obtener_remesas = obtener_remesas;
module.exports.obtener_precio_matricula = obtener_precio_matricula;
module.exports.obtener_remesa = obtener_remesa;
module.exports.obtener_remesa_estado = obtener_remesa_estado;

module.exports.obtener_lineas_remesa = obtener_lineas_remesa;
module.exports.obtener_descuentos_remesa = obtener_descuentos_remesa;
module.exports.obtener_ultimo_lote = obtener_ultimo_lote;
module.exports.obtener_remesa_nid = obtener_remesa_nid;

module.exports.aprobar_remesas = aprobar_remesas;
module.exports.rechazar_remesa = rechazar_remesa;
module.exports.aprobar_remesa = aprobar_remesa;