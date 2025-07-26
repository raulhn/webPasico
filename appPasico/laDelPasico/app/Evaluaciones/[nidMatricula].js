import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from "react-native";
import { useEvaluaciones } from "../../hooks/escuela/useEvaluaciones";
import { useLocalSearchParams } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "../../providers/AuthContext";
import { useTrimestre } from "../../hooks/useTrimestre";
import { CustomTabs } from "../../componentes/componentesUI/ComponentesUI";
import CardEvaluacion from "../../componentes/componentesEscuela/CardEvaluacion";

export default function Evaluacion() {
  const { nidMatricula } = useLocalSearchParams();
  const { cerrar_sesion } = useContext(AuthContext);

  const { evaluaciones, cargando, error, refrescar, setRefrescar } =
    useEvaluaciones(nidMatricula, cerrar_sesion);

  const {
    trimestres,
    cargando: cargandoTrimestres,
    error: errorTrimestres,
  } = useTrimestre(cerrar_sesion);

  console.log("Trimestres:", trimestres);

  if (cargando || cargandoTrimestres) {
    return (
      <View>
        <ActivityIndicator size="large" color="#007CFA" />
      </View>
    );
  }

  function mostrarEvaluaciones() {
    console.log("Trimestres disponibles:", trimestres.length);
    if (
      !cargando &&
      !cargandoTrimestres &&
      evaluaciones.length > 0 &&
      trimestres.length > 0
    ) {
      const tabsEvaluaciones = [];
      console.log("Mostrando evaluaciones");
      console.log("Trimestres disponibles:", trimestres.length);
      for (let i = 0; i < trimestres.length; i++) {
        console.log(trimestres[i].nombre);

        const evaluacionesTrimestre = evaluaciones.filter(
          (evaluacion) =>
            evaluacion.nid_trimestre === trimestres[i].nid_trimestre
        );

        tabsEvaluaciones.push({
          nombre: trimestres[i].descripcion,
          contenido: () => (
            <FlatList
              data={evaluacionesTrimestre}
              keyExtractor={(item) => item.nid_evaluacion_matricula.toString()}
              renderItem={({ item }) => <CardEvaluacion evaluacion={item} />}
              refreshControl={
                <RefreshControl
                  refreshing={cargando}
                  onRefresh={() => setRefrescar(!refrescar)}
                />
              }
            />
          ),
        });
      }
      return <CustomTabs tabs={tabsEvaluaciones} />;
    }
  }

  return (
    <View>
      <Text>Evaluación</Text>
      {mostrarEvaluaciones()}
    </View>
  );
}
