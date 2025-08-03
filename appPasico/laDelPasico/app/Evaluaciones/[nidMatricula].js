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
import { Link, useLocalSearchParams } from "expo-router";
import { useContext } from "react";
import { AuthContext } from "../../providers/AuthContext";
import { useTrimestre } from "../../hooks/useTrimestre";
import {
  Boton,
  CustomTabs,
  BotonFixed,
} from "../../componentes/componentesUI/ComponentesUI";
import CardEvaluacion from "../../componentes/componentesEscuela/CardEvaluacion";
import serviceEvaluaciones from "../../servicios/serviceEvaluaciones.js";
import { useState } from "react";

import * as Linking from "expo-linking";

import Constantes from "../../config/constantes"; // Asegúrate de que la ruta sea correcta

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
        <ActivityIndicator size="large" color={Constantes.COLOR_AZUL} />
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
              <>
                <View style={estilos.container}>
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

                  <View style={[estilos.botonDescarga]}>
                    <BotonFixed
                      icon="download"
                      onPress={async () => {
                        try {
                          const boletin =
                            await serviceEvaluaciones.generarBoletin(
                              nidMatricula,
                              trimestres[i].nid_trimestre,
                              cerrar_sesion
                            );

                          const token = boletin.tokenGeneracion;
                          const url =
                            Constantes.URL_SERVICIO_MOVIL +
                            "generar_boletin/" +
                            token;

                          await Linking.openURL(url);
                        } catch (error) {
                          console.error(
                            "Error al descargar el boletín:",
                            error
                          );
                        }
                      }}
                    />
                  </View>
                </View>
              </>
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
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  botonDescarga: { position: "absolute", bottom: 20, right: 20, zIndex: 10 },
});
