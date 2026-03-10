import { ActivityIndicator, StyleSheet } from "react-native";
import { useComponenteCard } from "./../../hooks/componentes/useComponenteCard";
import { View, Text } from "react-native";

export default function ComponenteCard({ nid_componente }) {
  const { componenteCard, cargando, error } = useComponenteCard(nid_componente);

  if (cargando) {
    return (
      <>
        <Text>Cargando...</Text>
        <ActivityIndicator size="large" color="#0000ff" />
      </>
    );
  }

  function htmlToReactNativeText(html) {
    if (!html) return null; // Maneja el caso de texto vacío o nulo
    const tagRegex = /<\/?(b|i|u)>/g;
    const parts = [];
    let lastIndex = 0;
    let match;
    let styleStack = [];

    while ((match = tagRegex.exec(html)) !== null) {
      if (match.index > lastIndex) {
        parts.push({
          text: html.slice(lastIndex, match.index),
          style: { ...styleStack[styleStack.length - 1] },
        });
      }
      if (match[0][1] === "/") {
        styleStack.pop();
      } else {
        let prevStyle = styleStack.length
          ? { ...styleStack[styleStack.length - 1] }
          : {};
        if (match[1] === "b") prevStyle.fontWeight = "bold";
        if (match[1] === "i") prevStyle.fontStyle = "italic";
        if (match[1] === "u")
          prevStyle.textDecorationLine = prevStyle.textDecorationLine
            ? `${prevStyle.textDecorationLine} underline`
            : "underline";
        styleStack.push(prevStyle);
      }
      lastIndex = tagRegex.lastIndex;
    }
    if (lastIndex < html.length) {
      parts.push({
        text: html.slice(lastIndex),
        style: { ...styleStack[styleStack.length - 1] },
      });
    }
    // Devuelve solo fragmentos, sin texto principal.
    return parts.map((part, idx) => (
      <Text key={idx} style={part.style}>
        {part.text}
      </Text>
    ));
  }

  function transformaTexto(html) {
    if (!html) return null; // Maneja el caso de texto vacío o nulo
    const posItalic = html.indexOf("<i>");
    const posBold = html.indexOf("<b>");
    const posUnderline = html.indexOf("<u>");

    const min = Math.min(
      posItalic === -1 ? Infinity : posItalic,
      posBold === -1 ? Infinity : posBold,
      posUnderline === -1 ? Infinity : posUnderline
    );

    if (min === posItalic && posItalic !== -1) {
      const posCloseItalic = html.indexOf("</i>", posItalic);
      return (
        <Text>
          {transformaTexto(html.slice(0, posItalic))}
          <Text style={{ fontStyle: "italic" }}>
            {transformaTexto(html.slice(posItalic + 3, posCloseItalic))}
          </Text>
          {transformaTexto(html.slice(posCloseItalic + 4))}
        </Text>
      );
    }
    if (min === posBold && posBold !== -1) {
      const posCloseBold = html.indexOf("</b>", posBold);
      return (
        <Text>
          {transformaTexto(html.slice(0, posBold))}
          <Text style={{ fontWeight: "bold" }}>
            {transformaTexto(html.slice(posBold + 3, posCloseBold))}
          </Text>
          {transformaTexto(html.slice(posCloseBold + 4))}
        </Text>
      );
    }
    if (min === posUnderline && posUnderline !== -1) {
      const posCloseUnderline = html.indexOf("</u>", posUnderline);
      return (
        <Text>
          {transformaTexto(html.slice(0, posUnderline))}
          <Text style={{ textDecorationLine: "underline" }}>
            {transformaTexto(html.slice(posUnderline + 3, posCloseUnderline))}
          </Text>
          {transformaTexto(html.slice(posCloseUnderline + 4))}
        </Text>
      );
    }
    return <Text>{html}</Text>;
  }

  return (
    <View
      style={[
        estilos.cardContainer,
        {
          backgroundColor: componenteCard.color ? componenteCard.color : "#fff",
        },
      ]}
    >
      {transformaTexto(componenteCard.texto)}
    </View>
  );
}

const estilos = StyleSheet.create({
  cardContainer: {
    borderRadius: 22,
    padding: 16,
    marginVertical: 4,
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3, // Para Android
    borderColor: "#e2e8f0",
  },
});
