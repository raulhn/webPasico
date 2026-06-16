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
import { useInstrumentos } from "../../hooks/banda/useInstrumentos";

import { AuthContext } from "../../providers/AuthContext";

import { useRouter } from "expo-router";

import { COLOR_ROJO } from "../../config/constantes.js";

import { useListadoPersonas } from "../../hooks/personas/usePersonas";
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
  const {
    instrumentos,
    cargando: cargandoInstrumentos,
    error: errorInstrumentos,
  } = useInstrumentos(cerrarSesion);

  const opcionesInstrumento = instrumentos.map((instrumento) => ({
    etiqueta: instrumento.descripcion,
    valor: instrumento.nid_instrumento,
  }));

  const opcionesActivo = [
    { etiqueta: "Todos", valor: 0 },
    { etiqueta: "Activos", valor: 1 },
    { etiqueta: "Baja", valor: 2 },
  ];

  const {
    cursos,
    obtenerCursoActivo,
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

  const [asignaturaSeleccionadaProfesor, setAsignaturaSeleccionadaProfesor] =
    useState({
      etiqueta: "Todas las asignaturas",
      valor: 0,
    });

  const [cursoSeleccionado, setCursoSeleccionado] = useState({
    etiqueta: obtenerCursoActivo()?.descripcion || "Todos los cursos",
    valor: obtenerCursoActivo()?.nid_curso || 0,
  });

  const [instrumentoSeleccionado, setInstrumentoSeleccionado] = useState({
    etiqueta: null,
    valor: null,
  });

  const router = useRouter();

  useEffect(() => {
    setCursoSeleccionado({
      etiqueta: obtenerCursoActivo()?.descripcion || "Todos los cursos",
      valor: obtenerCursoActivo()?.nid_curso || 0,
    });
  }, [obtenerCursoActivo()]);

  const { personas, refrescarPersonas, cargando, error } = useListadoPersonas(
    tipoSeleccionado.valor,
    activoSeleccionado.valor,
    cursoSeleccionado.valor,
    asignaturaSeleccionada.valor
  );
  const [presionado, setPresionado] = useState(null);

  const [personasFiltradas, setPersonasFiltradas] = useState([]);

  const [textoFiltro, setTextoFiltro] = useState("");

  function existe(array, valor) {
    if (!array || array.length === 0) {
      return false;
    }
    return array.some((elemento) => elemento.nid === valor);
  }

  useEffect(() => {
    let personasFiltradasTemporal = [];
    if (tipoSeleccionado.valor === 3) {
      personasFiltradasTemporal = personas.filter((personaObjeto) => {
        const persona = personaObjeto.persona;
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
      personasFiltradasTemporal = personas.filter((personaObjeto) => {
        const persona = personaObjeto.persona;

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
      personasFiltradasTemporal = personas.filter((personaObjeto) => {
        const persona = personaObjeto.persona;
        let nombreCompleto =
          persona.nombre +
          " " +
          persona.primer_apellido +
          " " +
          persona.segundo_apellido;
        nombreCompleto = nombreCompleto.toLowerCase();

        return (
          nombreCompleto.includes(textoFiltro.toLowerCase()) &&
          (existe(personaObjeto.asignaturas, instrumentoSeleccionado.valor) ||
            !instrumentoSeleccionado.valor)
        );
      });
    } else if (tipoSeleccionado.valor === 5) {
      personasFiltradasTemporal = personas.filter((personaObjeto) => {
        const persona = personaObjeto.persona;
        let nombreCompleto =
          persona.nombre +
          " " +
          persona.primer_apellido +
          " " +
          persona.segundo_apellido;
        nombreCompleto = nombreCompleto.toLowerCase();

        return (
          nombreCompleto.includes(textoFiltro.toLowerCase()) &&
          (existe(
            personaObjeto.asignaturas,
            asignaturaSeleccionadaProfesor.valor
          ) ||
            asignaturaSeleccionadaProfesor.valor === 0)
        );
      });
    } else {
      personasFiltradasTemporal = personas;
    }

    personasFiltradasTemporal = personasFiltradasTemporal.filter(
      (personaObjeto) => {
        const persona = personaObjeto.persona;
        let nombreCompleto =
          persona.nombre +
          " " +
          persona.primer_apellido +
          " " +
          persona.segundo_apellido;
        nombreCompleto = nombreCompleto.toLowerCase();
        return nombreCompleto.includes(textoFiltro.toLowerCase());
      }
    );
    setPersonasFiltradas(personasFiltradasTemporal);
  }, [
    tipoSeleccionado,
    activoSeleccionado,
    cursoSeleccionado,
    asignaturaSeleccionada,
    instrumentoSeleccionado,
    asignaturaSeleccionadaProfesor,
    personas,
    textoFiltro,
  ]);

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
            keyExtractor={(item) => item.persona.nid_persona.toString()}
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
                <View key={item.persona.nid_persona}>
                  <Pressable
                    onPress={() => {
                      router.push({
                        pathname:
                          "/(drawer)/stackAdministracion/" +
                          item.persona.nid_persona,
                        params: {
                          nidListaPersona: item.persona.nid_persona,
                        },
                      });
                    }}
                    onTouchStart={() => {
                      setPresionado(item.persona.nid_persona); // Cambia el estado a presionado
                    }}
                    onTouchEnd={() => {
                      setPresionado(null); // Cambia el estado a no presionado
                    }}
                    style={[{ width: "100%", alignItems: "center" }]}
                  >
                    <View
                      style={[
                        presionado === item.persona.nid_persona
                          ? estilos.tarjetaPresionada
                          : null,
                      ]}
                    >
                      <View style={{ width: "100%", alignItems: "center" }}>
                        <CardPersona
                          persona={item.persona}
                          detalles={item.asignaturas}
                        />
                      </View>
                    </View>
                  </Pressable>
                </View>
              );
            }}
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
                      etiqueta: cursoSeleccionado.etiqueta,
                      valor: cursoSeleccionado.valor,
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

          {tipoSeleccionado.valor === 5 && (
            <>
              <Text>Asignatura</Text>
              <EntradaGroupRadioButton
                titulo={"Asignatura"}
                opciones={opcionesAsignaturas}
                valor={asignaturaSeleccionadaProfesor}
                setValorSeleccionado={(seleccion) => {
                  if (seleccion.valor === null) {
                    setAsignaturaSeleccionadaProfesor({
                      etiqueta: "Todas las asignaturas",
                      valor: 0,
                    });
                    return;
                  }
                  setAsignaturaSeleccionadaProfesor(seleccion);
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

          {tipoSeleccionado.valor === 4 && (
            <>
              <Text>Instrumento</Text>
              <EntradaGroupRadioButton
                titulo={"Instrumento"}
                opciones={opcionesInstrumento}
                valor={instrumentoSeleccionado}
                setValorSeleccionado={(seleccion) => {
                  if (seleccion.valor === null) {
                    setInstrumentoSeleccionado({
                      etiqueta: null,
                      valor: null,
                    });
                    return;
                  }
                  setInstrumentoSeleccionado(seleccion);
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
    paddingTop: 25,
    backgroundColor: "white",
    alignItems: "stretch",
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
