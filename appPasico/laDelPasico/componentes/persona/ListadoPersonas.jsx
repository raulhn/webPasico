import {
  BotonIcono,
  EntradaGroupRadioButton,
  Boton,
  EntradaTexto,
} from "../../componentes/componentesUI/ComponentesUI";
import { useState, useContext, useEffect } from "react";
import {
  Pressable,
  Text,
  Modal,
  StyleSheet,
  View,
  FlatList,
  RefreshControl,
} from "react-native";
import { useAsignaturas } from "../../hooks/escuela/useAsignaturas";
import { useCursos } from "../../hooks/escuela/useCurso";
import { AuthContext } from "../../providers/AuthContext";

import { useRouter } from "expo-router";

import { COLOR_ROJO, ESCUELA } from "../../config/constantes.js";

import {
  useListadoPersonas,
  usePersonas,
} from "../../hooks/personas/usePersonas";
import CardPersona from "./CardPersona.jsx";

export default function ListadoPersonas() {
  const opcionesTipo = [
    { etiqueta: "Todas las personas", valor: 1 },
    { etiqueta: "Alumnos", valor: 3 },
    { etiqueta: "Socios", valor: 2 },
    { etiqueta: "Musicos", valor: 4 },
    { etiqueta: "Profesores", valor: 5 },
  ];

  const { cerrarSesion } = useContext(AuthContext);
  const [modalVisible, setModalVisible] = useState(false);

  const opcionesActivo = [
    { etiqueta: "Todos", valor: 0 },
    { etiqueta: "Activos", valor: 1 },
    { etiqueta: "Baja", valor: 2 },
  ];

  const {
    cursos,
    cargando: cargandoCursos,
    error: errorCursos,
  } = useCursos(cerrarSesion);

  const {
    asignaturas,
    cargando: cargandoAsignaturas,
    error: errorAsignaturas,
    lanzarRefresco: lanzarRefrescoAsignaturas,
    obtenerAsignatura: obtenerAsignatura,
  } = useAsignaturas(cerrarSesion);

  const [tipoSeleccionado, setTipoSeleccionado] = useState({
    valor: 1,
    etiqueta: "Todas las personas",
  });

  const opcionesAsignaturas = asignaturas.map((asignatura) => ({
    etiqueta: asignatura.descripcion,
    valor: asignatura.nid_asignatura,
  }));

  const opcionesCursos = cursos.map((curso) => ({
    etiqueta: curso.descripcion,
    valor: curso.nid_curso,
  }));

  const [activoSeleccionado, setActivoSeleccionado] = useState({
    etiqueta: "Todos",
    valor: 0,
  });
  const [asignaturaSeleccionada, setAsignaturaSeleccionada] = useState({
    etiqueta: "Todas las asignaturas",
    valor: 0,
  });

  const [cursoSeleccionado, setCursoSeleccionado] = useState({
    etiqueta: null,
    valor: null,
  });

  const router = useRouter();

  const { personas, refrescarPersonas, cargando, error } = useListadoPersonas(
    tipoSeleccionado.valor,
    activoSeleccionado.valor,
    cursoSeleccionado.valor,
    asignaturaSeleccionada.valor
  );
  const [presionado, setPresionado] = useState(null);

  const [personasFiltradas, setPersonasFiltradas] = useState([]);

  const [textoFiltro, setTextoFiltro] = useState("");
  const alumnosUnicos = Object.values(
    personas
      ? personas.reduce(
          (
            acc,
            {
              nid_persona,
              nombre,
              primer_apellido,
              segundo_apellido,
              nid_asignatura,
            }
          ) => {
            if (!acc[nid_persona]) {
              acc[nid_persona] = {
                nid_persona,
                nombre,
                primer_apellido,
                segundo_apellido,
                asignaturas: [],
              };
            }

            acc[nid_persona].asignaturas.push({
              nid: nid_asignatura,
              descripcion: obtenerAsignatura(nid_asignatura),
            });

            return acc;
          },
          {}
        )
      : {}
  );
  console.log(alumnosUnicos);

  const musicosUnicos = [
    ...new Map(
      personas?.map((musico) => [musico.nid_persona, musico])
    ).values(),
  ];

  const profesoresUnicos = [
    ...new Map(
      personas?.map((profesor) => [profesor.nid_persona, profesor])
    ).values(),
  ];

  useEffect(() => {
    let personasFiltradasTemporal = [];
    if (tipoSeleccionado.valor === 3) {
      personasFiltradasTemporal = alumnosUnicos.filter((persona) => {
        let nombreCompleto =
          persona.nombre +
          " " +
          persona.primer_apellido +
          " " +
          persona.segundo_apellido;
        nombreCompleto = nombreCompleto.toLowerCase();
        return nombreCompleto.includes(textoFiltro.toLowerCase());
      });
    } else if (tipoSeleccionado.valor === 2) {
      personasFiltradasTemporal = personas.filter((persona) => {
        let nombreCompleto =
          persona.nombre +
          " " +
          persona.primer_apellido +
          " " +
          persona.segundo_apellido;
        nombreCompleto = nombreCompleto.toLowerCase();
        return nombreCompleto.includes(textoFiltro.toLowerCase());
      });
    } else if (tipoSeleccionado.valor === 4) {
      personasFiltradasTemporal = musicosUnicos.filter((persona) => {
        let nombreCompleto =
          persona.nombre +
          " " +
          persona.primer_apellido +
          " " +
          persona.segundo_apellido;
        nombreCompleto = nombreCompleto.toLowerCase();
        return nombreCompleto.includes(textoFiltro.toLowerCase());
      });
    } else if (tipoSeleccionado.valor === 5) {
      personasFiltradasTemporal = profesoresUnicos.filter((persona) => {
        let nombreCompleto =
          persona.nombre +
          " " +
          persona.primer_apellido +
          " " +
          persona.segundo_apellido;
        nombreCompleto = nombreCompleto.toLowerCase();
        return nombreCompleto.includes(textoFiltro.toLowerCase());
      });
    } else {
      personasFiltradasTemporal = personas;
    }

    personasFiltradasTemporal = personasFiltradasTemporal.filter((persona) => {
      let nombreCompleto =
        persona.nombre +
        " " +
        persona.primer_apellido +
        " " +
        persona.segundo_apellido;
      nombreCompleto = nombreCompleto.toLowerCase();
      return nombreCompleto.includes(textoFiltro.toLowerCase());
    });
    setPersonasFiltradas(personasFiltradasTemporal);
  }, [
    tipoSeleccionado,
    activoSeleccionado,
    cursoSeleccionado,
    asignaturaSeleccionada,
    personas,
    textoFiltro,
  ]);

  function obtenerListaAsignaturas(nid_persona) {
    let listaAsignaturas = [];
    if (tipoSeleccionado.valor === 5) {
      listaAsignaturas = personas
        .filter(
          (persona) =>
            persona.nid_persona === nid_persona && persona.esBaja === "N"
        )
        .map((persona) => {
          return obtenerAsignatura(persona.nid_asignatura);
        });
    } else if (tipoSeleccionado.valor === 3) {
      listaAsignaturas = personas
        .filter((persona) => persona.nid_persona === nid_persona)
        .map((persona) => {
          return obtenerAsignatura(persona.nid_asignatura);
        });
    }
    return listaAsignaturas;
  }

  return (
    <>
      <View style={estilos.contenedor}>
        <View style={estilos.contenedorFiltros}>
          <EntradaTexto
            placeholder="Buscar persona..."
            valor={textoFiltro}
            setValor={(texto) => setTextoFiltro(texto)}
          />
          <BotonIcono
            nombre={"filter-list"}
            onPress={() => {
              setModalVisible(true);
            }}
          />
        </View>
        <View>
          <FlatList
            data={personasFiltradas}
            onScrollEndDrag={() => {
              setPresionado(null); // Cambia el estado a no presionado al hacer scroll
            }}
            refreshControl={
              <RefreshControl
                refreshing={cargando}
                onRefresh={() => {
                  refrescarPersonas();
                  setPresionado(null);
                }}
              />
            }
            renderItem={({ item }) => {
              return (
                <View key={item.nid_persona}>
                  <Pressable
                    onPress={() => {
                      router.push({
                        pathname:
                          "/(drawer)/stackAdministracion/" + item.nid_persona,
                        params: {
                          nidListaPersona: item.nid_persona,
                        },
                      });
                    }}
                    onTouchStart={() => {
                      setPresionado(item.nid_persona); // Cambia el estado a presionado
                    }}
                    onTouchEnd={() => {
                      setPresionado(null); // Cambia el estado a no presionado
                    }}
                    style={[{ width: "100%", alignItems: "center" }]}
                  >
                    <View
                      style={[
                        presionado === item.nid_persona
                          ? estilos.tarjetaPresionada
                          : null,
                      ]}
                    >
                      <View style={{ width: "100%", alignItems: "center" }}>
                        <CardPersona
                          persona={item}
                          detalles={item.asignaturas}
                        />
                      </View>
                    </View>
                  </Pressable>
                </View>
              );
            }}
            keyExtractor={(item) => item.nid_persona}
            contentContainerStyle={{ gap: 10, flexGrow: 1 }}
          />
        </View>
      </View>
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={estilos.contenedorModal}>
          <Text>Tipo</Text>
          <EntradaGroupRadioButton
            titulo={"Tipo"}
            opciones={opcionesTipo}
            valor={tipoSeleccionado}
            setValorSeleccionado={(seleccion) => {
              if (seleccion.valor === null) {
                setTipoSeleccionado({
                  valor: 1,
                  etiqueta: "Todas las personas",
                });
                return;
              }
              setTipoSeleccionado(seleccion);
            }}
          />
          {tipoSeleccionado.valor === 3 && (
            <>
              <Text>Curso</Text>
              <EntradaGroupRadioButton
                titulo={"Cursos"}
                opciones={opcionesCursos}
                valor={cursoSeleccionado}
                setValorSeleccionado={(seleccion) => {
                  if (seleccion.valor === null) {
                    setCursoSeleccionado({
                      etiqueta: null,
                      valor: null,
                    });
                    return;
                  }
                  setCursoSeleccionado(seleccion);
                }}
              />
              <Text>Asignatura</Text>
              <EntradaGroupRadioButton
                titulo={"Asignatura"}
                opciones={opcionesAsignaturas}
                valor={asignaturaSeleccionada}
                setValorSeleccionado={(seleccion) => {
                  if (seleccion.valor === null) {
                    setAsignaturaSeleccionada({
                      etiqueta: "Todas las asignaturas",
                      valor: 0,
                    });
                    return;
                  }
                  setAsignaturaSeleccionada(seleccion);
                }}
              />
            </>
          )}

          {(tipoSeleccionado.valor === 2 || tipoSeleccionado.valor === 3) && (
            <>
              <Text>Activo</Text>
              <EntradaGroupRadioButton
                titulo={"Estado"}
                opciones={opcionesActivo}
                valor={activoSeleccionado}
                setValorSeleccionado={(seleccion) => {
                  if (seleccion.valor === null) {
                    setActivoSeleccionado({ etiqueta: "Todos", valor: 0 });
                    return;
                  }
                  setActivoSeleccionado(seleccion);
                }}
              />
            </>
          )}

          <Boton
            nombre={"Cerrar"}
            color={COLOR_ROJO}
            onPress={() => setModalVisible(false)}
          />
        </View>
      </Modal>
    </>
  );
}

const estilos = StyleSheet.create({
  contenedor: {
    padding: 25,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  contenedorModal: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  tarjetaPresionada: {
    transform: [{ scale: 1.05 }],
  },
  contenedorFiltros: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    alignItems: "center",
    alignContent: "center",
  },
});
