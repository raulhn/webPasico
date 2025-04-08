import React from "react";
import { TextInput } from "react-native-gesture-handler";

export default function Registro() {
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text class="titulo">Registro de usuario</Text>
      <View>
        <Text>Nombre</Text>
        <TextInput
          id="nombre"
          placeholder="Nombre"
          style={{ borderWidth: 1, width: 200 }}
        />
        <Text>Primer Apellido</Text>
        <TextInput
          id="primerApellido"
          placeholder="Primer Apellido"
          style={{ borderWidth: 1, width: 200 }}
        />
        <Text>Segundo Apellido</Text>
        <TextInput
          id="segundoApellido"
          placeholder="Segundo Apellido"
          style={{ borderWidth: 1, width: 200 }}
        />
        <Text>Correo Electrónico</Text>
        <TextInput
          id="correoElectronico"
          placeholder="Correo Electrónico"
          style={{ borderWidth: 1, width: 200 }}
        />
        <Text>Contraseña</Text>
        <TextInput
          id="contrasena"
          placeholder="Contraseña"
          style={{ borderWidth: 1, width: 200 }}
          secureTextEntry
        />
        <Button
          onPress={() => {
            // Aquí puedes manejar el registro del usuario
          }}
          title="Registrar"
        ></Button>
      </View>
    </View>
  );
}
