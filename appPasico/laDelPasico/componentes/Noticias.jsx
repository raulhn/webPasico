import { FlatList } from "react-native";
import React, { useState, useEffect } from "react";
import { CardBlog, AnimatedCardBlog } from "./CardBlog.jsx";
import { View, Text } from "react-native";
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
    <View>
      <FlatList
        data={listaNoticias}
        keyExtractor={(noticia) => noticia.nid_imagen}
        renderItem={({ item }) => (
          <AnimatedCardBlog noticia={item}></AnimatedCardBlog>
        )}
      >
        {({ item }) => <CardBlog noticia={item}></CardBlog>}
      </FlatList>
    </View>
  );
}
