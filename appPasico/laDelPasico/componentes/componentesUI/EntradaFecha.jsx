import DateTimePicker from "@react-native-community/datetimepicker";
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

export default function EntradaFecha({onChangeFecha}) {
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

const estilos = StyleSheet.create({
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
});
