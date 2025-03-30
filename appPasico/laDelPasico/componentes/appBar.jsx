import React from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  ViewPropTypes,
  StyleSheet,
  View,
  StyledText,
  Text,
  TouchableOpacity,
  Pressable
} from "react-native";

import { Link } from "expo-router";
export default function AppBar() {
  const [esPresionado, setEsPresionado] = React.useState(false);

  return (
    <View style={estilos.container}>
<Link asChild href="/" > 
<TouchableOpacity>
<MaterialIcons name="home" size={30} color="black" />
</TouchableOpacity>
</Link>
<Link asChild href="/escuela" >
<TouchableOpacity>
<MaterialIcons name="school" size={30} color="black" />
</TouchableOpacity>
</Link>
<Link asChild href="/banda" >
<TouchableOpacity>
<MaterialCommunityIcons name="trumpet" size={30} color="black" />
</TouchableOpacity>
</Link>
  <Link asChild href="/asociacion" >
  <TouchableOpacity>
  <MaterialIcons name="group" size={30} color="black" />
  </TouchableOpacity>
  </Link>
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    display: "flex",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "gray",
    justifyContent: "space-around",
    alignItems: "center",
    flexDirection: "row",
    width: "100%",
    padding: 10,
  },

});
