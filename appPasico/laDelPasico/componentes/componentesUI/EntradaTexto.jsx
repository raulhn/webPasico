import { TextInput, StyleSheet } from "react-native";
import React, { useState } from "react";

export default function EntradaTexto({
  placeholder,
  valor,
  setValor,
  editable = true,
  secureTextEntry = false,
  multiline = false,
  maxLength = null,
}) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <TextInput
      placeholder={placeholder}
      value={valor}
      editable={editable}
      secureTextEntry={secureTextEntry}
      multiline={multiline}
      maxLength={maxLength}
      onChangeText={(text) => {
        setValor(text);
      }}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={isFocused ? estilos.inputFocus : estilos.input}
    />
  );
}

const estilos = StyleSheet.create({
  input: {
    width: 200,
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: "#ccc",
  },
  inputFocus: {
    width: 200,
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: "blue",
    borderWidth: 2,
  },
});
