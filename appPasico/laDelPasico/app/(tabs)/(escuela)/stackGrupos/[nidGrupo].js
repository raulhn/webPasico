import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { AuthContext } from "../../../../providers/AuthContext";
import { useAlumnosAsignaturaProfesor } from "../../../../hooks/escuela/useAlumnos";
import serviceGrupos from "../../../../servicios/serviceGrupos";
import {
  Boton,
  CheckBox,
  EntradaGroupRadioButton,
  ModalAviso,
  ModalConfirmacion,
  ModalExito,
} from "../../../../componentes/componentesUI/ComponentesUI";

const DIAS_SEMANA = ["L", "M", "X", "J", "V", "S", "D"];
const SIN_SELECCION = { etiqueta: "", valor: null };

function nombreCompleto(alumno) {
  return [alumno.nombre, alumno.primer_apellido, alumno.segundo_apellido]
    .filter(Boolean)
    .join(" ");
}

export default function DetalleGrupo() {
  const { nidGrupo } = useLocalSearchParams();
  const { cerrarSesion } = useContext(AuthContext);
  const [grupo, setGrupo] = useState(null);
  const [dias, setDias] = useState([]);
  const [alumno, setAlumno] = useState(SIN_SELECCION);
  const [alumnoAEliminar, setAlumnoAEliminar] = useState(null);
  const [confirmarEliminacion, setConfirmarEliminacion] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  const { alumnos: alumnosAsignatura } = useAlumnosAsignaturaProfesor(
    grupo?.grupo.nid_curso,
    grupo?.grupo.nid_asignatura,
    cerrarSesion
  );

  const cargarGrupo = useCallback(async () => {
    setCargando(true);
    try {
      const respuesta = await serviceGrupos.obtenerGrupos(null, cerrarSesion);
      if (respuesta.error) {
        throw new Error(
          respuesta.message || "No se ha podido cargar el grupo."
        );
      }
      const encontrado = (respuesta.grupos || []).find(
        (elemento) => String(elemento.grupo.nid_grupo) === String(nidGrupo)
      );
      if (!encontrado) {
        throw new Error(
          "El grupo no existe o no tienes permiso para consultarlo."
        );
      }
      setGrupo(encontrado);
      setDias((encontrado.grupo.horario || "").split("-").filter(Boolean));
    } catch (err) {
      setError(err.message || "No se ha podido cargar el grupo.");
    } finally {
      setCargando(false);
    }
  }, [cerrarSesion, nidGrupo]);

  useEffect(() => {
    cargarGrupo();
  }, [cargarGrupo]);

  const alumnosDisponibles = useMemo(() => {
    const incluidos = new Set(
      (grupo?.alumnos || []).map((elemento) =>
        String(elemento.nid_matricula_asignatura)
      )
    );
    return alumnosAsignatura.filter(
      (elemento) => !incluidos.has(String(elemento.nid_matricula_asignatura))
    );
  }, [alumnosAsignatura, grupo]);

  function actualizarDia(dia, seleccionado) {
    setDias((actuales) =>
      seleccionado
        ? [...actuales, dia]
        : actuales.filter((elemento) => elemento !== dia)
    );
  }

  async function guardarHorario() {
    try {
      const horario = DIAS_SEMANA.filter((dia) => dias.includes(dia)).join("-");
      const respuesta = await serviceGrupos.actualizarHorarioGrupo(
        nidGrupo,
        horario,
        cerrarSesion
      );
      if (respuesta.error) {
        throw new Error(
          respuesta.message || "No se ha podido guardar el horario."
        );
      }
      setGrupo((actual) => ({
        ...actual,
        grupo: { ...actual.grupo, horario },
      }));
      setExito("Horario guardado.");
    } catch (err) {
      setError(err.message || "No se ha podido guardar el horario.");
    }
  }

  async function incluirAlumno() {
    if (!alumno.valor) {
      setError("Selecciona un alumno para incluirlo en el grupo.");
      return;
    }
    try {
      const respuesta = await serviceGrupos.addAlumnoGrupo(
        nidGrupo,
        alumno.valor,
        cerrarSesion
      );
      if (respuesta.error) {
        throw new Error(
          respuesta.message || "No se ha podido incluir el alumno."
        );
      }
      setAlumno(SIN_SELECCION);
      setExito("Alumno incluido en el grupo.");
      cargarGrupo();
    } catch (err) {
      setError(err.message || "No se ha podido incluir el alumno.");
    }
  }

  async function eliminarAlumno() {
    try {
      const respuesta = await serviceGrupos.eliminarAlumnoGrupo(
        nidGrupo,
        alumnoAEliminar.nid_matricula_asignatura,
        cerrarSesion
      );
      if (respuesta.error) {
        throw new Error(
          respuesta.message || "No se ha podido eliminar el alumno."
        );
      }
      setAlumnoAEliminar(null);
      setExito("Alumno eliminado del grupo.");
      cargarGrupo();
    } catch (err) {
      setError(err.message || "No se ha podido eliminar el alumno.");
    }
  }

  if (cargando) {
    return <ActivityIndicator style={estilos.cargando} size="large" />;
  }

  if (!grupo) {
    return (
      <ModalAviso
        visible={Boolean(error)}
        setVisible={() => setError("")}
        mensaje={error}
        textBoton="Aceptar"
      />
    );
  }

  return (
    <ScrollView contentContainerStyle={estilos.contenedor}>
      <Text style={estilos.titulo}>{grupo.grupo.nombre}</Text>
      <Text>Alumnos incluidos: {grupo.alumnos.length}</Text>
      <Text style={estilos.subtitulo}>Horario de clase</Text>
      <View style={estilos.dias}>
        {DIAS_SEMANA.map((dia) => (
          <CheckBox
            key={dia}
            item={{ etiqueta: dia, valor: dia }}
            valorSeleccionado={dias.includes(dia)}
            setValorSeleccionado={(_, seleccionado) =>
              actualizarDia(dia, seleccionado)
            }
          />
        ))}
      </View>
      <Boton nombre="Guardar horario" onPress={guardarHorario} />

      <Text style={estilos.subtitulo}>Incluir alumno</Text>
      <EntradaGroupRadioButton
        titulo="Alumnos de la asignatura"
        opciones={alumnosDisponibles.map((elemento) => ({
          etiqueta: nombreCompleto(elemento),
          valor: elemento.nid_matricula_asignatura,
        }))}
        valor={alumno}
        setValorSeleccionado={setAlumno}
      />
      <Boton nombre="Incluir alumno" onPress={incluirAlumno} />

      <Text style={estilos.subtitulo}>Alumnos del grupo</Text>
      {grupo.alumnos.map((elemento) => (
        <Pressable
          key={elemento.nid_matricula_asignatura}
          style={[
            estilos.alumno,
            alumnoAEliminar?.nid_matricula_asignatura ===
              elemento.nid_matricula_asignatura && estilos.alumnoSeleccionado,
          ]}
          onPress={() => setAlumnoAEliminar(elemento)}
        >
          <Text>{nombreCompleto(elemento)}</Text>
          <Text>Faltas: {elemento.faltas}</Text>
        </Pressable>
      ))}
      <Boton
        nombre="Eliminar alumno seleccionado"
        color="#c62828"
        onPress={() => {
          if (!alumnoAEliminar) {
            setError("Selecciona un alumno del listado para eliminarlo.");
            return;
          }
          setConfirmarEliminacion(true);
        }}
      />
      <ModalConfirmacion
        visible={confirmarEliminacion}
        setVisible={() => setConfirmarEliminacion(false)}
        mensaje="¿Quieres eliminar este alumno del grupo?"
        textBoton="Eliminar"
        textBotonCancelar="Cancelar"
        accion={eliminarAlumno}
        accionCancelar={() => setConfirmarEliminacion(false)}
      />
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
    </ScrollView>
  );
}

const estilos = StyleSheet.create({
  contenedor: { padding: 16, gap: 12, backgroundColor: "white" },
  cargando: { flex: 1 },
  titulo: { fontSize: 22, fontWeight: "bold", textAlign: "center" },
  subtitulo: { marginTop: 10, fontSize: 18, fontWeight: "bold" },
  dias: { flexDirection: "row", flexWrap: "wrap" },
  alumno: { borderWidth: 1, borderColor: "#ddd", borderRadius: 6, padding: 12 },
  alumnoSeleccionado: { borderColor: "#007CFA", backgroundColor: "#eaf4ff" },
});
