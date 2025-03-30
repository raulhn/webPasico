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
        >
          <View style={estilos.menuContainer}>
            <Text> Esto es un modal</Text>
          </View>
        </Modal>
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 100,
    height: "80%",
  },
  menuContainer: {
    backgroundColor: "red",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    height: "98%",
  },
  menuItem: {
    paddingVertical: 10,
  },
});
