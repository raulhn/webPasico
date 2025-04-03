import React, { useEffect, useState } from "react";
import serviceComponentes from "../servicios/serviceComponentes.js";
import ComponenteTexto from "./componentesPagina/componenteTexto.js"; // Importa el componente de texto

export default function Pagina(nidPagina) {
  const [componentes, setComponentes] = useState([]);

  useEffect(() => {
    serviceComponentes
      .recuperarComponentes(nidPagina)
      .then((data) => {
        setComponentes(data);
      })
      .error((error) => {
        console.log("Error al recuperar componentes: ", error);
      });
  }, [nidPagina]);

  return (
    <div>
      {componentes.map((componente) => {
        switch (componente.tipo) {
          case "texto":
            return <ComponenteTexto key={componente.nid} {...componente} />;
          // Agregar otros tipos de componentes aquí
          default:
            return null;
        }
      })}
    </div>
  );
}
