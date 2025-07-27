import {
  View,
  Text,
  Pressable,
  ActivityIndicator,
  RefreshControl,
  FlatList,
  ScrollView,
  StyleSheet,
} from "react-native";
import { useEvaluaciones } from "../../hooks/escuela/useEvaluaciones";
import { useLocalSearchParams } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "../../providers/AuthContext";
import { useTrimestre } from "../../hooks/useTrimestre";
import {
  Boton,
  CustomTabs,
} from "../../componentes/componentesUI/ComponentesUI";
import CardEvaluacion from "../../componentes/componentesEscuela/CardEvaluacion";
import serviceEvaluaciones from "../../servicios/serviceEvaluaciones.js";

import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";

import Constantes from "../../constantes.js";

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

  if (cargando || cargandoTrimestres) {
    return (
      <View>
        <ActivityIndicator size="large" color="#007CFA" />
      </View>
    );
  }

  function mostrarEvaluaciones() {
    if (
      !cargando &&
      !cargandoTrimestres &&
      evaluaciones.length > 0 &&
      trimestres.length > 0
    ) {
      const tabsEvaluaciones = [];

      for (let i = 0; i < trimestres.length; i++) {
        const evaluacionesTrimestre = evaluaciones.filter(
          (evaluacion) =>
            evaluacion.nid_trimestre === trimestres[i].nid_trimestre
        );

        if (evaluacionesTrimestre.length == 0) {
          tabsEvaluaciones.push({
            nombre: trimestres[i].nombre,
            contenido: () => (
              <ScrollView
                refreshControl={
                  <RefreshControl
                    refreshing={cargando}
                    onRefresh={() => setRefrescar(!refrescar)}
                  />
                }
              >
                <View style={estilos.card}>
                  <Text>No hay evaluaciones para mostrar.</Text>
                </View>
              </ScrollView>
            ),
          });
        } else {
          tabsEvaluaciones.push({
            nombre: trimestres[i].nombre,
            contenido: () => (
              <View
                style={{
                  backgroundColor: "#fff",
                }}
              >
                <FlatList
                  data={evaluacionesTrimestre}
                  keyExtractor={(item) =>
                    item.nid_evaluacion_matricula.toString()
                  }
                  renderItem={({ item }) => (
                    <CardEvaluacion evaluacion={item} />
                  )}
                  refreshControl={
                    <RefreshControl
                      refreshing={cargando}
                      onRefresh={() => setRefrescar(!refrescar)}
                    />
                  }
                />
                <Boton
                  onPress={async () => {
                    try {
                      const boletin = await serviceEvaluaciones.generarBoletin(
                        nidMatricula,
                        trimestres[i].nid_trimestre,
                        cerrar_sesion
                      );
                      console.log("Boletín generado:", boletin.fichero);
                      const fileUri =
                        FileSystem.documentDirectory + "boletin.doc";
                      await FileSystem.writeAsStringAsync(
                        fileUri,
                        boletin.fichero,
                        {}
                      );
                      // Abrir el archivo con una app externa
                      await IntentLauncher.startActivityAsync(
                        "android.intent.action.VIEW",
                        {
                          data: fileUri,
                          flags: 1,
                          type: "application/msword",
                        }
                      );
                    } catch (error) {
                      console.error("Error al descargar el boletín:", error);
                    }
                  }}
                  nombre={"Descargar"}
                />
              </View>
            ),
          });
        }
      }
      return <CustomTabs tabs={tabsEvaluaciones} />;
    }
  }

  return <View style={estilos.container}>{mostrarEvaluaciones()}</View>;
}

const estilos = StyleSheet.create({
  card: {
    backgroundColor: "#f8faff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e3eaf2",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
});
