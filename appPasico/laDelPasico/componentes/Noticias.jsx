import { FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import { CardBlog, AnimatedGameCard } from "./CardBlog.jsx";
const serviceNoticias = require("../servicios/serviceNoticias.js");

export function Noticias() {
  const [listaNoticias, obtenerNoticias] = useState([]);

  useEffect(() => {
    serviceNoticias.obtenerUltimasNoticias().then((v_noticias) => {
      let array_noticias = v_noticias["componente_blog"].slice(0, 5);
      obtenerNoticias(array_noticias);
    });
  }, []);

  return (
    <FlatList
      data={listaNoticias}
      keyExtractor={(noticia) => noticia.nid_imagen}
      renderItem={({ item }) => (
        <AnimatedGameCard noticia={item}></AnimatedGameCard>
      )}
    >
      {({ item }) => <CardBlog noticia={item}></CardBlog>}
    </FlatList>
  );
}
