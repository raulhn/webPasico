import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialIcons } from "@expo/vector-icons";
import {
  Pressable,
  Platform,
  Touchable,
  TouchableOpacity,
  StyleSheet,
  View,
  TextInput,
} from "react-native";
import { useState } from "react";

export function Boton({
  nombre,
  onPress,
  color = "#007BFF",
  colorTexto = "#fff",
}) {
  const [presionado, setPresionado] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setPresionado(true)}
      onPressOut={() => setPresionado(false)}
    >
      <View
        style={[
          estilos.boton,
          { backgroundColor: color },
          presionado && { opacity: 0.5, transform: [{ scale: 0.95 }] },
        ]}
      >
        <Text style={([estilos.textoBoton], { color: colorTexto })}>
          {nombre}
        </Text>
      </View>
    </Pressable>
  );
}

export function BotonFixed({ onPress }) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={[
        {
          backgroundColor: "#007CFA",
          width: 50, // Ancho del botón
          height: 50, // Alto del botón (igual al ancho para que sea redondo)
          borderRadius: 30, //
          padding: 10,
          alignItems: "center",
          justifyContent: "center",
        },
        isPressed && {
          backgroundColor: "#005BB5", // Color más oscuro al presionar
          transform: [{ scale: 0.95 }], // Efecto de escala al presionar
        },
      ]}
    >
      <View>
        <MaterialIcons name="add" size={24} color="white" />
      </View>
    </Pressable>
  );
}

export function EntradaFecha({ onChangeFecha }) {
  const [fecha, setFecha] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
  const [presionado, setPresionado] = useState(false);
  const [fechaEvento, setFechaEvento] = useState("");

  const togglePicker = () => {
    setShowPicker(!showPicker);
  };

  const onChange = ({ type }, selectedDate) => {
    if (type === "set") {
      const currentDate = selectedDate;
      setFecha(currentDate);

      if (Platform.OS === "android") {
        togglePicker();
        const formattedDate = currentDate.toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });
        setFechaEvento(formattedDate);
        console.log("Fecha seleccionada1:", currentDate.toDateString());
        onChangeFecha(fecha);
      }
    } else {
      togglePicker();
    }
  };

  const confirmIOSDate = () => {
    const formattedDate = currentDate.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    setFechaEvento(formattedDate);
    onChangeFecha(fecha);
    togglePicker();
  };

  return (
    <View>
      <Pressable onPress={togglePicker}>
        <TextInput
          value={fechaEvento}
          editable={false}
          pointerEvents="none"
          style={[estilos.inputFecha, presionado ? estilos.inputFocus : {}]}
          onChangText={setFechaEvento}
          onFocus={() => setPresionado(true)}
          onBlur={() => setPresionado(false)}
        />
      </Pressable>

      {showPicker && (
        <>
          {Platform.OS === "ios" && (
            <View
              style={{ flexDirection: "row", justifyContent: "space-around" }}
            >
              <TouchableOpacity
                onPress={togglePicker}
                style={[estilos.pickerButton, { backgroundColor: "#FF0000" }]}
              >
                <Text style={estilos.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmIOSDate}
                style={estilos.pickerButton}
              >
                <Text style={estilos.buttonText}>Confirmar</Text>
              </TouchableOpacity>
            </View>
          )}
          <DateTimePicker
            mode="date"
            display="spinner"
            value={fecha}
            onChange={onChange}
            style={estilos.datePicker}
          />
        </>
      )}
    </View>
  );
}

export function EntradaTexto({
  placeholder,
  valor,
  setValor,
  editable = true,
  secureTextEntry = false,
  multiline = false,
  maxLength = null,
  ancho = 200,
  alto = 50,
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
                  height: alto,
                  textAlignVertical: "top",
                },
              ]
            : [
                estilos.input,
                { width: ancho, height: alto, textAlignVertical: "top" },
              ]
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

export function ModalAviso({ visible, setVisible, mensaje, textBoton }) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={setVisible}
    >
      <View style={estilos.modalContainer}>
        <View style={estilos.modalContent}>
          <MaterialIcons
            name="warning-amber"
            size={60}
            color="#f87c00"
            style={estilos.iconoWarning}
          />
          <Text style={estilos.mensaje}>{mensaje}</Text>

          <Boton
            onPress={setVisible}
            nombre={textBoton}
            color="#007BFF"
            colorTexto="#FFF"
          />
        </View>
      </View>
    </Modal>
  );
}

export function ModalExito({ visible, callback, mensaje, textBoton }) {
  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={callback}
    >
      <View style={estilos.modalContainer}>
        <View style={estilos.modalContent}>
          <MaterialIcons
            name="check-circle-outline"
            size={60}
            color="#4caf50"
            style={estilos.iconoWarning}
          />
          <Text style={estilos.mensaje}>{mensaje}</Text>

          <Boton
            onPress={callback}
            nombre={textBoton}
            color="#007BFF"
            colorTexto="#FFF"
          />
        </View>
      </View>
    </Modal>
  );
}

const estilos = StyleSheet.create({
  boton: {
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    justifyContent: "center",
  },
  textoBoton: {
    textAlign: "center",
  },
  datePicker: { height: 120, marginTop: -10 },
  pickerButton: {
    paddingHorizontal: 20,
  },
  buttonText: {
    fortSize: 14,
    fontWeight: "500",
    corlor: "#FFF",
  },
  inputFecha: {
    width: 100,
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderColor: "#ccc",
  },
  inputFocus: {
    borderRadius: 5,
    borderColor: "blue",
    borderWidth: 2,
  },
  input: {
    borderWidth: 1,

    borderRadius: 5,
    borderColor: "#ccc",
  },

  containerBotonVisible: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  iconoWarning: {
    marginBottom: 10,
  },
  mensaje: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 20,
  },
});
