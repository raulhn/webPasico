const constantes = require("../constantes.js");
const conexion = require("../conexion.js");
const gestion_base_datos = require("./base_datos.js");

async function registrar_menu(titulo, padre, tipo_pagina, enlace) {
  try {
    const sql =
      "insert into " +
      constantes.ESQUEMA_BD +
      ".menu(vTitulo, padre, nTipo_Pagina, vEnlace) values(" +
      conexion.dbConn.escape(titulo) +
      ", " +
      conexion.dbConn.escape(padre) +
      ", " +
      conexion.dbConn.escape(tipo_pagina) +
      ", " +
      conexion.dbConn.escape(enlace) +
      ")";

    await gestion_base_datos.actualiza(sql);
    return true;
  } catch (error) {
    console.log("Error al registrar menu", error);
    return false;
  }
}

async function registrar_menu_id(titulo, padre, tipo_pagina, enlace) {
  try {
    const sql =
      "insert into " +
      constantes.ESQUEMA_BD +
      ".menu(vTitulo, padre, nTipo_Pagina, vEnlace) values(" +
      conexion.dbConn.escape(titulo) +
      ", " +
      conexion.dbConn.escape(padre) +
      ", " +
      conexion.dbConn.escape(tipo_pagina) +
      ", " +
      conexion.dbConn.escape(enlace) +
      ")";

    const results = await gestion_base_datos.actualiza(sql);
    return results.insertId;
  } catch (error) {
    console.log("menu.js -> registrar_menu_id:", error);
    return -1;
  }
}

async function obtiene_menu(id_menu) {
  try {
    const sql =
      "select * from " +
      constantes.ESQUEMA_BD +
      ".menu where padre = " +
      conexion.dbConn.escape(id_menu) +
      " order by norden";

    const results = await gestion_base_datos.consulta(sql);
    return results;
  } catch (error) {
    console.log("menu.js -> obtiene_menu:", error);
    throw new Error("Error al obtener el menu");
  }
}

async function obtiene_titulo(id_menu) {
  try {
    const sql =
      "select vTitulo from " +
      constantes.ESQUEMA_BD +
      ".menu where nid =" +
      conexion.dbConn.escape(id_menu);

    const results = await gestion_base_datos.consulta(sql);
    if (results.length < 1) throw new Error("Menu no encontrado");
    let titulo = results[0]["vTitulo"];
    return titulo;
  } catch (error) {
    console.log("menu.js -> obtiene_titulo:", error);
    throw new Error("Error al obtener el titulo del menu");
  }
}

async function obtiene_url_menu(id_menu) {
  try {
    const sql =
      "select * from " +
      constantes.ESQUEMA_BD +
      ".menu where nid =" +
      conexion.dbConn.escape(id_menu);
    const results = await gestion_base_datos.consulta(sql);
    if (results.length < 1) throw new Error("Menu no encontrado");
    let tipo_pagina = results[0]["nTipo_pagina"];
    if (tipo_pagina == constantes.TIPO_PAGINA_GENERAL) {
      return "/general/" + id_menu;
    } else {
      throw new Error("Tipo de pagina no soportada");
    }
  } catch (error) {
    console.log("menu.js -> obtiene_url_menu:", error);
    throw new Error("Error al obtener la url del menu");
  }
}

async function menu_tiene_componentes(id_menu) {
  try {
    const sql =
      "select count(*) num_componentes from " +
      constantes.ESQUEMA_BD +
      ".pagina_componente where nid_pagina = " +
      conexion.dbConn.escape(id_menu);

    const results = await gestion_base_datos.consulta(sql);
    let num_componentes = results[0]["num_componentes"];
    return num_componentes > 0;
  } catch (error) {
    console.log("menu.js -> menu_tiene_componentes:", error);
    throw new Error("Error al comprobar si el menu tiene componentes");
  }
}

async function menu_tiene_hijos(id_menu) {
  try {
    const sql =
      "select count(*) num_hijos from " +
      constantes.ESQUEMA_BD +
      ".menu where padre = " +
      conexion.dbConn.escape(id_menu);

    const results = await gestion_base_datos.consulta(sql);
    let num_hijos = results[0]["num_hijos"];
    return num_hijos > 0;
  } catch (error) {
    console.log("menu.js -> menu_tiene_hijos:", error);
    throw new Error("Error al comprobar si el menu tiene hijos");
  }
}

async function eliminar_menu(id_menu) {
  try {
    const bTiene_componentes = await menu_tiene_componentes(id_menu);
    const bTiene_hijos = await menu_tiene_hijos(id_menu);

    if (bTiene_componentes || bTiene_hijos) {
      throw new Error("La pagina tiene componentes o hijos");
    } else {
      const sql =
        "delete from " +
        constantes.ESQUEMA_BD +
        ".menu where nid = " +
        conexion.dbConn.escape(id_menu);
      await gestion_base_datos.actualiza(sql);
    }
    return;
  } catch (error) {
    console.log("menu.js -> eliminar_menu:", error);
    throw new Error("Error al eliminar el menu: " + error.message);
  }
}

async function actualizar_titulo_menu(id_menu, titulo) {
  try {
    const sql =
      "update " +
      constantes.ESQUEMA_BD +
      ".menu set vTitulo = " +
      conexion.dbConn.escape(titulo) +
      " where nid = " +
      conexion.dbConn.escape(id_menu);

    await gestion_base_datos.actualiza(sql);
    return;
  } catch (error) {
    console.log("menu.js -> actualizar_titulo_menu:", error);
    throw new Error("Error al actualizar el titulo del menu: " + error.message);
  }
}

module.exports.registrar_menu = registrar_menu;
module.exports.registrar_menu_id = registrar_menu_id;
module.exports.obtiene_menu = obtiene_menu;
module.exports.obtiene_url_menu = obtiene_url_menu;
module.exports.eliminar_menu = eliminar_menu;
module.exports.actualizar_titulo_menu = actualizar_titulo_menu;
module.exports.obtiene_titulo = obtiene_titulo;
