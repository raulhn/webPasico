import { useContext, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { AuthContext } from "../../../../providers/AuthContext";
import { useCursos } from "../../../../hooks/escuela/useCurso";
import { useAsignaturasProfesor } from "../../../../hooks/escuela/useAsignaturas";
import serviceGrupos from "../../../../servicios/serviceGrupos";
import {
  Boton,
  EntradaGroupRadioButton,
  EntradaTexto,
  ModalAviso,
  ModalExito,
} from "../../../../componentes/componentesUI/ComponentesUI";

const SIN_SELECCION = { etiqueta: "", valor: null };

export default function Grupos() {
  const { cerrarSesion } = useContext(AuthContext);
  const router = useRouter();
  const { cursos, cargando: cargandoCursos } = useCursos(cerrarSesion);
  const { asignaturas, cargando: cargandoAsignaturas } =
    useAsignaturasProfesor(cerrarSesion);
  const [curso, setCurso] = useState(SIN_SELECCION);
  const [grupos, setGrupos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nombre, setNombre] = useState("");
  const [asignatura, setAsignatura] = useState(SIN_SELECCION);
  const [cursoNuevo, setCursoNuevo] = useState(SIN_SELECCION);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  useEffect(() => {
    const cursoActivo = cursos.find((elemento) => elemento.activo === "S");
    if (cursoActivo && !curso.valor) {
      setCurso({
        etiqueta: cursoActivo.descripcion,
        valor: cursoActivo.nid_curso,
      });
    }
  }, [cursos, curso.valor]);

  async function cargarGrupos() {
    if (!curso.valor) {
      setGrupos([]);
      return;
    }

    setCargando(true);
    try {
      const respuesta = await serviceGrupos.obtenerGrupos(
        curso.valor,
        cerrarSesion
      );
      if (respuesta.error) {
        throw new Error(
          respuesta.message || "No se han podido cargar los grupos."
        );
      }
      setGrupos(respuesta.grupos || []);
    } catch (err) {
      setError(err.message || "No se han podido cargar los grupos.");
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    cargarGrupos();
  }, [curso.valor]);

  async function crearGrupo() {
    if (!nombre.trim() || !cursoNuevo.valor || !asignatura.valor) {
      setError("Completa el nombre, curso y asignatura del grupo.");
      return;
    }

    try {
      const respuesta = await serviceGrupos.crearGrupo(
        cursoNuevo.valor,
        nombre.trim(),
        asignatura.valor,
        cerrarSesion
      );
      if (respuesta.error) {
        throw new Error(respuesta.message || "No se ha podido crear el grupo.");
      }
      setMostrarFormulario(false);
      setNombre("");
      setAsignatura(SIN_SELECCION);
      setCursoNuevo(SIN_SELECCION);
      setCurso(cursoNuevo);
      setExito("Grupo creado correctamente.");
      if (String(curso.valor) === String(cursoNuevo.valor)) {
        cargarGrupos();
      }
    } catch (err) {
      setError(err.message || "No se ha podido crear el grupo.");
    }
  }

  const opcionesCursos = cursos.map((elemento) => ({
    etiqueta: elemento.descripcion,
    valor: elemento.nid_curso,
  }));
  const opcionesAsignaturas = asignaturas.map((elemento) => ({
    etiqueta: elemento.descripcion,
    valor: elemento.nid_asignatura,
  }));

  return (
    <View style={estilos.contenedor}>
      <ScrollView contentContainerStyle={estilos.contenido}>
        <Text style={estilos.titulo}>Mis grupos</Text>
        <EntradaGroupRadioButton
          titulo="Curso"
          opciones={opcionesCursos}
          valor={curso}
          setValorSeleccionado={setCurso}
        />
        {(cargandoCursos || cargandoAsignaturas || cargando) && (
          <ActivityIndicator size="large" />
        )}
        {!cargando && curso.valor && grupos.length === 0 && (
          <Text style={estilos.vacio}>
            No hay grupos para el curso seleccionado.
          </Text>
        )}
        {grupos.map(({ grupo, alumnos }) => (
          <Pressable
            key={grupo.nid_grupo}
            style={estilos.tarjeta}
            onPress={() =>
              router.push({
                pathname: "/(tabs)/(escuela)/stackGrupos/" + grupo.nid_grupo,
              })
            }
          >
            <Text style={estilos.nombreGrupo}>{grupo.nombre}</Text>
            <Text>Alumnos: {alumnos.length}</Text>
            <Text>Horario: {grupo.horario || "Sin definir"}</Text>
          </Pressable>
        ))}
        <Boton
          nombre="Crear nuevo grupo"
          onPress={() => setMostrarFormulario(true)}
        />
      </ScrollView>

      <Modal visible={mostrarFormulario} transparent animationType="fade">
        <View style={estilos.fondoModal}>
          <ScrollView contentContainerStyle={estilos.modal}>
            <Text style={estilos.titulo}>Crear grupo</Text>
            <Text>Nombre del grupo</Text>
            <EntradaTexto
              placeholder="Nombre del grupo"
              valor={nombre}
              setValor={setNombre}
              ancho={280}
            />
            <Text>Curso</Text>
            <EntradaGroupRadioButton
              titulo="Curso"
              opciones={opcionesCursos}
              valor={cursoNuevo}
              setValorSeleccionado={setCursoNuevo}
            />
            <Text>Asignatura</Text>
            <EntradaGroupRadioButton
              titulo="Asignatura"
              opciones={opcionesAsignaturas}
              valor={asignatura}
              setValorSeleccionado={setAsignatura}
            />
            <View style={estilos.acciones}>
              <Boton nombre="Crear" onPress={crearGrupo} />
              <Boton
                nombre="Cancelar"
                color="#777"
                onPress={() => setMostrarFormulario(false)}
              />
            </View>
          </ScrollView>
        </View>
      </Modal>
      <ModalAviso
        visible={Boolean(error)}
        setVisible={() => setError("")}
        mensaje={error}
        textBoton="Aceptar"
      />
      <ModalExito
        visible={Boolean(exito)}
        setVisible={() => setExito("")}
        mensaje={exito}
        textBoton="Aceptar"
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  contenedor: { flex: 1, backgroundColor: "white" },
  contenido: { padding: 16, gap: 12 },
  titulo: { fontSize: 22, fontWeight: "bold", textAlign: "center" },
  tarjeta: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 14,
    gap: 4,
  },
  nombreGrupo: { fontSize: 18, fontWeight: "bold" },
  vacio: { textAlign: "center", marginVertical: 12 },
  fondoModal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    padding: 20,
  },
  modal: { backgroundColor: "white", borderRadius: 8, padding: 20, gap: 14 },
  acciones: { flexDirection: "row", justifyContent: "center", gap: 10 },
});
