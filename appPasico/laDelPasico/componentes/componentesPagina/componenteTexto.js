import React, { useEffect, useState } from "react";
import { Text } from "react-native";
import serviceComponentes from "../../servicios/serviceComponentes.js";

export default function ComponenteTexto(nidComponente) {
  const [componenteTexto, setComponenteTexto] = useState({});

  useEffect(() => {
    serviceComponentes
      .recuperarComponenteTexto(nidComponente)
      .then((data) => {
        setComponenteTexto(data);
      })
      .error((error) => {
        console.log("Error al recuperar componente texto: ", error);
      });
  }, [nidComponente]);

  return <Text>{componenteTexto.cTexto}</Text>;
}
