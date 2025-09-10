import { View, Text, ActivityIndicator } from "react-native";
import CardMatricula from "../../../../componentes/componentesEscuela/CardMatricula";
import { useMatriculas } from "../../../../hooks/personas/useMatriculas";
import { useContext, useState } from "react";
import { AuthContext } from "../../../../providers/AuthContext";
import { FlatList, RefreshControl, Pressable } from "react-native";
import { Link } from "expo-router";
import Constantes from "../../../../config/constantes.js";

export default function Expediente() {
  const { cerrarSesion } = useContext(AuthContext);
  const [presionado, setPresionado] = useState(null); // Estado para controlar si se ha presionado un elemento

  const { matriculas, cargando, refrescarMatriculas, refrescar, error } =
    useMatriculas(cerrarSesion);

  if (cargando) {
    return <ActivityIndicator size="large" color={Constantes.COLOR_AZUL} />;
  }

  return (
    <View style={estilos.container}>
      <View style={{ alignItems: "center" }}>
        <Text style={estilos.title}>Matriculas</Text>
      </View>

      <FlatList
        data={matriculas}
        onScrollEndDrag={() => {
          setPresionado(null); // Cambia el estado a no presionado al hacer scroll
        }}
        style={{
          flexGrow: 1,
          backgroundColor: "white",
        }}
        keyExtractor={(item) => item.nid_matricula.toString()}
        renderItem={({ item }) => (
          <Link
            href={{
              pathname: "/stackMatricula/" + item.nid_matricula,
              params: { nidEvento: item.nid_matricula },
            }}
            key={item.nid_matricula}
            asChild
          >
            <Pressable
              onTouchStart={() => {
                setPresionado(item.nid_matricula); // Cambia el estado a presionado
              }}
              onTouchEnd={() => {
                setPresionado(null); // Cambia el estado a no presionado
              }}
              style={{ width: "100%", alignItems: "center" }}
            >
              <View
                style={[
                  {
                    width: "90%",
                    gap: 10,
                  },
                  presionado === item.nid_matricula
                    ? { transform: [{ scale: 1.05 }] }
                    : {},
                ]}
              >
                <CardMatricula Matricula={item} />
              </View>
            </Pressable>
          </Link>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refrescar}
            onRefresh={() => {
              refrescarMatriculas();
              setPresionado(null);
            }}
          />
        }
      ></FlatList>
    </View>
  );
}

const estilos = {
  container: {
    backgroundColor: "white",
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: Constantes.COLOR_AZUL,
  },
  tarjetaPresionada: {
    transform: [{ scale: 1.05 }],
  },
};
