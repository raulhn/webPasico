import Agenda from "../../../../componentes/componentesGeneral/agenda/Agenda";
import { View, StyleSheet, Modal } from "react-native";
import { BotonFixed } from "../../../../componentes/componentesUI/ComponentesUI";
import { useState } from "react";
import FormularioAgenda from "../../../../componentes/componentesGeneral/agenda/FormularioAgenda";
import { useContext } from "react";
import { AuthContext } from "../../../../providers/AuthContext";
import { useRol } from "../../../../hooks/useRol";
import Constantes from "../../../../config/constantes";

export default function PantallaAgenda() {
  let fecha = new Date();
  const { cerrarSesion, usuario } = useContext(AuthContext);
  const { esRol } = useRol();

  let mes = fecha.getMonth() + 1;
  let anio = fecha.getFullYear();

  const [visibleFormulario, setVisibleFormulario] = useState(false);

  function ButtonAdd() {
    if (esRol([Constantes.ROL_ADMINISTRADOR])) {
      return (
        <BotonFixed
          onPress={() => {
            setVisibleFormulario(true);
          }}
        />
      );
    }
    return null;
  }

  return (
    <View styles={estilos.contenedor}>
      <Agenda mes_={mes} anio_={anio} />
      <ButtonAdd />
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
