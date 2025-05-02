import { TextInput, StyleSheet, Pressable, View } from "react-native";
import React, { useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { use } from "react";

export default function EntradaTexto({
  placeholder,
  valor,
  setValor,
  editable = true,
  secureTextEntry = false,
  multiline = false,
  maxLength = null,
  ancho = 200,
}) {
  const esPassword = secureTextEntry;
  const [isFocused, setIsFocused] = useState(false);
  const [isSecure, setIsSecure] = useState(secureTextEntry);

  let nombreIcono = isSecure ? "visibility-off" : "visibility";

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
      }}
    >
      <TextInput
        placeholder={placeholder}
        value={valor}
        editable={editable}
        secureTextEntry={isSecure}
        multiline={multiline}
        maxLength={maxLength}
        onChangeText={(text) => {
          setValor(text);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={
          isFocused
            ? [
                estilos.inputFocus,
                {
                  width: ancho,
                },
              ]
            : [estilos.input, { width: ancho }]
        }
      />
      <Pressable
        style={[
          esPassword ? { display: "flex" } : { display: "none" },
          {
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
        onPress={() => setIsSecure(!isSecure)}
      >
        <View style={estilos.containerBotonVisible}>
          <MaterialIcons name={nombreIcono} size={20} color="gray" />
        </View>
      </Pressable>
    </View>
  );
}

const estilos = StyleSheet.create({
  input: {
    borderWidth: 1,

    borderRadius: 5,
    borderColor: "#ccc",
  },
  inputFocus: {
    borderRadius: 5,
    borderColor: "blue",
    borderWidth: 2,
  },
  containerBotonVisible: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
});
