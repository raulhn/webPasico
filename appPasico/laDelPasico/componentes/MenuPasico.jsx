import { useState } from "react";
import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

export function MenuPasico() {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    console.log("Menu toggled:", !menuVisible);
  };

  return (
    <View>
      <View styles={estilos.container}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={menuVisible}
          styles={estilos.container}
          onRequestClose={() => {
            toggleMenu();
          }}
        ></Modal>
      </View>

      <View>
        <TouchableOpacity onPress={toggleMenu}>
          <Text>☰</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 100,
    height: "80%",
  },

  menuItem: {
    paddingVertical: 10,
  },
});
