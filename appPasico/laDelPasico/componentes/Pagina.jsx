import React, { useEffect, useState } from "react";
import serviceComponentes from "../servicios/serviceComponentes.js";
import ComponenteTexto from "./componentesPagina/componenteTexto.jsx"; // Importa el componente de texto
import { View, Text, ActivityIndicator } from "react-native";

export default function Pagina(nidPagina) {
  const [componentes, setComponentes] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    serviceComponentes
      .recuperarComponentes(nidPagina)
      .then((data) => {
        setComponentes(data.data);
        console.log(data.data);
        setCargando(false); // Finaliza la carga
      })
      .catch((error) => {
        console.log("Error al recuperar componentes: ", error);
      });
  }, [nidPagina]);

  if (cargando) {
    // Muestra un indicador de carga mientras se descargan los datos
    return (
      <View>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Cargando noticias...</Text>
      </View>
    );
  }

  return (
    <View>
      {componentes.map((componente) => {
        console.log(componente.nTipo);
        switch (componente.nTipo) {
          case "1":
            return <ComponenteTexto key={componente.nid} {...componente} />;

          default:
            return null;
        }
      })}
    </View>
  );
}
