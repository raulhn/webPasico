import DateTimePicker from "@react-native-community/datetimepicker";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Pressable,
  Platform,
  Touchable,
  TouchableOpacity,
  StyleSheet,
  View,
  TextInput,
  Text,
  FlatList,
  Modal,
  KeyboardAvoidingView,
} from "react-native";
import { useState, useEffect } from "react";
import { Link } from "expo-router";

import { ScrollView } from "react-native";
import Constantes from "../../config/constantes.js";

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

export function BotonIcono({
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
        <MaterialIcons name={nombre} size={24} color={colorTexto} />
      </View>
    </Pressable>
  );
}

export function BotonIconoComunity({
  nombreIcono,
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
        <MaterialCommunityIcons
          name={nombreIcono}
          size={24}
          color={colorTexto}
        />
      </View>
    </Pressable>
  );
}
export function BotonFixed({
  onPress,
  icon = "add",
  colorBoton = Constantes.COLOR_AZUL,
  size = 50,
}) {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      style={[
        {
          backgroundColor: colorBoton,
          width: size, // Ancho del botón
          height: size, // Alto del botón (igual al ancho para que sea redondo)
          borderRadius: 30, //
          alignItems: "center",
          justifyContent: "center",
        },
        isPressed && {
          backgroundColor: colorBoton, // Color más oscuro al presionar
          opacity: 0.5, // Opacidad al presionar
          transform: [{ scale: 0.95 }], // Efecto de escala al presionar
        },
      ]}
    >
      <View style={{ alignItems: "center", justifyContent: "center" }}>
        <MaterialIcons name={icon} size={size / 2} color="white" />
      </View>
    </Pressable>
  );
}

export function EntradaFecha({ onChangeFecha, valorFecha }) {
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
        onChangeFecha(currentDate);
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

  useEffect(() => {
    if (valorFecha) {
      const fechaFormateada = new Date(valorFecha);
      setFecha(fechaFormateada);
      const formattedDate = fechaFormateada.toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      setFechaEvento(formattedDate);
    }
  }, []);

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
  alto = 45,
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
        placeholderTextColor="gray"
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
                  color: "black",
                },
              ]
            : [
                estilos.input,
                {
                  width: ancho,
                  color: "black",
                  height: alto,
                  textAlignVertical: "top",
                },
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
        <View style={{ padding: 10 }}>
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

export function ModalConfirmacion({
  visible,
  setVisible,
  mensaje,
  textBoton,
  textBotonCancelar,
  accion,
  accionCancelar,
}) {
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

          <View
            style={{ flexDirection: "row", justifyContent: "center", gap: 10 }}
          >
            <Boton
              onPress={() => {
                setVisible();
                accion();
              }}
              nombre={textBoton}
              color="#007BFF"
              colorTexto="#FFF"
            />
            <Boton
              onPress={() => {
                accionCancelar();
                setVisible();
              }}
              nombre={textBotonCancelar}
              color="red"
              colorTexto="#FFF"
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

export function ModalExito({ visible, setVisible, mensaje, textBoton }) {
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
            name="check-circle-outline"
            size={60}
            color="#4caf50"
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

export function EntradaGroupRadioButton({
  titulo,
  opciones,
  valor,
  setValorSeleccionado,
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [presionado, setPresionado] = useState(null);
  const [valorSeleccionado, setValorSeleccionadoInterno] = useState(valor);

  useEffect(() => {
    setValorSeleccionadoInterno(valor);
  }, [valor]);

  return (
    <Pressable
      style={{ flexDirection: "row", gap: 10, alignItems: "center" }}
      onPress={() => {
        setIsVisible(true);
        setPresionado(true);
      }}
    >
      <View
        style={[
          {
            flexDirection: "row",
            gap: 10,
            padding: 10,
            borderWidth: 1,
            borderColor: "#ccc",
            borderRadius: 5,
          },
          presionado && { opacity: 0.5 },
        ]}
      >
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>
          {valorSeleccionado && valorSeleccionado.valor
            ? valorSeleccionado.etiqueta
            : "Seleccionar"}
        </Text>
      </View>
      <Modal
        animationType="fade"
        visible={isVisible}
        transparent={true}
        onRequestClose={() => setIsVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              width: "90%",
              maxHeight: "85%",
              height: "auto",
              borderRadius: 10,
              elevation: 5,
              borderColor: "#ccc",
              borderWidth: 1,
              justifyContent: "center",
              alignItems: "center",
              padding: 20,
            }}
          >
            <Text style={{ fontSize: 20, fontWeight: "bold", margin: 20 }}>
              {titulo}
            </Text>
            <ScrollView>
              <GroupRadioInput
                opciones={opciones}
                valor={valorSeleccionado}
                setValorSeleccionado={(valor) => {
                  setValorSeleccionadoInterno(valor);
                  setValorSeleccionado(valor);
                }}
              />
            </ScrollView>
            <View style={{ flexDirection: "row", gap: 10, marginTop: 20 }}>
              <Boton
                onPress={() => {
                  setIsVisible(false);
                }}
                nombre="Aceptar"
                color={Constantes.COLOR_AZUL}
                colorTexto="#FFF"
              />
              <Boton
                onPress={() => {
                  setValorSeleccionado({ etiqueta: "", valor: null });
                  setValorSeleccionadoInterno({ etiqueta: "", valor: null });
                }}
                nombre="Limpiar"
                color={Constantes.COLOR_AZUL}
                colorTexto="#FFF"
              />
            </View>
          </View>
        </View>
      </Modal>
    </Pressable>
  );
}

export function GroupRadioInput({ opciones, valor, setValorSeleccionado }) {
  return (
    <FlatList
      data={opciones}
      renderItem={({ item }) => (
        <RadioInput
          etiqueta={item.etiqueta}
          valor={item}
          valorSeleccionado={valor}
          setValorSeleccionado={setValorSeleccionado}
        />
      )}
      keyExtractor={(item) => item.valor}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        flexDirection: "column",
        gap: 10,
      }}
    />
  );
}

export function RadioInput({
  etiqueta,
  valor,
  valorSeleccionado,
  setValorSeleccionado,
}) {
  const [seleccionado, setSeleccionado] = useState(false);
  const [esPresionado, setEsPresionado] = useState(false);

  const accionPresionar = () => {
    setSeleccionado(true);
    setValorSeleccionado(valor);
  };

  useEffect(() => {
    if (valorSeleccionado && valorSeleccionado.valor === valor.valor) {
      setSeleccionado(true);
    } else {
      setSeleccionado(false);
    }
  }, [valorSeleccionado]);

  return (
    <Pressable
      onPress={accionPresionar}
      onPressIn={() => setEsPresionado(true)}
      onPressOut={() => setEsPresionado(false)}
    >
      <View
        style={[
          estilos.inputRadioButton,
          esPresionado ? estilos.presionado : {},
        ]}
      >
        <View style={[estilos.containerBotonVisible]}>
          <View
            style={[
              estilos.containerInteriorBotonVisible,
              seleccionado
                ? { backgroundColor: "#000" }
                : { backgroundColor: "#fff" },
            ]}
          ></View>
        </View>
        <Text style={{ marginLeft: 10 }}>{etiqueta}</Text>
      </View>
    </Pressable>
  );
}

export function CheckBox({ item, valorSeleccionado, setValorSeleccionado }) {
  const [seleccionado, setSeleccionado] = useState(false);
  const [esPresionado, setEsPresionado] = useState(false);

  const accionPresionar = () => {
    setValorSeleccionado(item, !seleccionado);
    setSeleccionado(!seleccionado);
  };

  useEffect(() => {
    setSeleccionado(valorSeleccionado);
  }, [valorSeleccionado]);

  return (
    <Pressable
      onPress={accionPresionar}
      onPressIn={() => setEsPresionado(true)}
      onPressOut={() => setEsPresionado(false)}
    >
      <View
        style={[
          esPresionado ? estilos.presionadoCheckBox : {},
          {
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            padding: 10,
          },
        ]}
      >
        <View>
          <MaterialIcons
            name={seleccionado ? "check-box" : "check-box-outline-blank"}
            size={20}
            color={seleccionado ? "#000" : "#ccc"}
          />
        </View>
        <Text style={{ marginLeft: 10 }}>{item.etiqueta}</Text>
      </View>
    </Pressable>
  );
}

export function CustomTabs({ tabs, pestana = 0 }) {
  const [pestanaSeleccionada, setPestanaSeleccionada] = useState();

  function obtenerBackGroundColor(pressed, index) {
    if (pressed) {
      return "#e0e0e0";
    }
    return index === pestanaSeleccionada ? Constantes.COLOR_AZUL : "#f5f5f5";
  }

  useEffect(() => {
    setPestanaSeleccionada(pestana);
  }, [pestana]);

  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flexDirection: "row",

          gap: 5,
          paddingLeft: 10,
          paddingTop: 5,
        }}
      >
        {tabs.map((tab, index) => (
          <Pressable
            key={index}
            onPress={() => {
              setPestanaSeleccionada(index);
            }}
            style={({ pressed }) => [
              {
                padding: 7,
                borderRadius: 5,
                backgroundColor: obtenerBackGroundColor(pressed, index),
              },
            ]}
          >
            <Text
              style={index == pestanaSeleccionada ? { color: "white" } : {}}
            >
              {tab.nombre}
            </Text>
          </Pressable>
        ))}
      </View>

      {tabs.map((tab, index) => (
        <View
          style={
            index === pestanaSeleccionada
              ? { flexGrow: 1 }
              : { display: "none" }
          }
          key={index}
        >
          {tab.contenido()}
        </View>
      ))}
    </View>
  );
}

export function MenuDesplegable({ opciones }) {
  const [isVisible, setIsVisible] = useState(false);
  const [presionado, setPresionado] = useState(null);

  function opcionesMenu() {
    return opciones.map((opcion, index) => (
      <Link
        href={{
          pathname: opcion.ruta,
          params: opcion.parametros,
        }}
        key={index}
        asChild
      >
        <Pressable
          onPress={() => {
            setIsVisible(false);
            setPresionado(-1);
            console.log("Opción seleccionada:", opcion.etiqueta);
          }}
          onPressIn={() => setPresionado(index)}
          onPressOut={() => setPresionado(-1)}
        >
          <View
            style={[
              { padding: 5, flexDirection: "row", alignItems: "center" },
              presionado === index && {
                backgroundColor: Constantes.COLOR_AZUL,
                color: "#fff",
              },
            ]}
          >
            <MaterialIcons
              name={opcion.icono}
              size={20}
              color={presionado === index ? "#fff" : "#000"}
            />
            <Text
              style={[
                { marginLeft: 10 },
                presionado === index && {
                  color: "#fff",
                },
              ]}
            >
              {opcion.etiqueta}
            </Text>
          </View>
        </Pressable>
      </Link>
    ));
  }

  return (
    <View style={{ position: "relative" }}>
      <BotonFixed
        onPress={() => {
          setIsVisible(true);
        }}
        icon="more-vert"
        size={30}
      ></BotonFixed>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={() => setIsVisible(false)}
        style={{ position: "absolute", top: 0, right: 0 }}
      >
        <Pressable style={{ flex: 1 }} onPress={() => setIsVisible(false)}>
          <View
            style={{
              position: "absolute",
              top: 100,
              right: 10,
              zIndex: 1,
              backgroundColor: "#fff",
              padding: 10,
              borderRadius: 5,
              shadowColor: "#000",
              borderColor: "#ccc",
              borderWidth: 1,
            }}
            // Evita que el modal se cierre al pulsar dentro del menú
            onStartShouldSetResponder={() => true}
          >
            {opcionesMenu()}
          </View>
        </Pressable>
      </Modal>
    </View>
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
    width: 110,
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    color: "black",
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
  containerBotonVisible: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: 8,
    borderColor: "#ccc",
    borderWidth: 1,
    width: 10,
    height: 10,
    borderRadius: 20,
  },
  containerInteriorBotonVisible: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",

    width: 10,
    height: 10,
    borderRadius: 20,
  },
  inputRadioButton: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
  },
  presionado: {
    opacity: 0.5,
    transform: [{ scale: 0.95 }],
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    borderColor: "#ccc",
    borderWidth: 1,
  },
  presionadoCheckBox: {
    opacity: 0.5,
    backgroundColor: "#e0e0e0",
    borderRadius: 5,
    borderColor: "#ccc",
    borderWidth: 1,
  },
});
