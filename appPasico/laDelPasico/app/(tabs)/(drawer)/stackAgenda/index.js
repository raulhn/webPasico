import Agenda from "../../../../componentes/componentesGeneral/agenda/Agenda";
import { View, StyleSheet, Modal } from "react-native";
import { BotonFixed } from "../../../../componentes/componentesUI/ComponentesUI";
import { useState } from "react";
import FormularioAgenda from "../../../../componentes/componentesGeneral/agenda/FormularioAgenda";
import { useContext } from "react";
import { AuthContext } from "../../../../providers/AuthContext";

export default function PantallaAgenda() {
  let fecha = new Date();
  const { cerrarSesion, usuario } = useContext(AuthContext);

  let mes = fecha.getMonth() + 1;
  let anio = fecha.getFullYear();

  const [visibleFormulario, setVisibleFormulario] = useState(false);

  return (
    <View styles={estilos.contenedor}>
      <Agenda mes_={mes} anio_={anio} />
      <BotonFixed
        onPress={() => {
          setVisibleFormulario(true);
        }}
      />
      <Modal
        animationType="slide"
        visible={visibleFormulario}
        onRequestClose={() => {
          setVisibleFormulario(false);
        }}
      >
        <FormularioAgenda
          cerrar_sesion={cerrarSesion}
          volver={() => {
            setVisibleFormulario(false);
          }}
        />
      </Modal>
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
