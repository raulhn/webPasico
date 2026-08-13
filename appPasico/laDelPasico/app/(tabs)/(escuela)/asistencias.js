import { useContext, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AuthContext } from "../../../providers/AuthContext";
import serviceGrupos from "../../../servicios/serviceGrupos";
import {
  Boton,
  CheckBox,
  EntradaFecha,
  EntradaGroupRadioButton,
  EntradaTexto,
  ModalAviso,
  ModalExito,
} from "../../../componentes/componentesUI/ComponentesUI";

const DIAS_SEMANA = ["D", "L", "M", "X", "J", "V", "S"];
const SIN_SELECCION = { etiqueta: "", valor: null };
const NOMBRE_DIAS_SEMANA = [
  "Domingo",
  "Lunes",
  "Martes",
  "Miércoles",
  "Jueves",
  "Viernes",
  "Sábado",
];

function fechaISO(fecha) {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return anio + "-" + mes + "-" + dia;
}

function nombreCompleto(alumno) {
  return [alumno.nombre, alumno.primer_apellido, alumno.segundo_apellido]
    .filter(Boolean)
    .join(" ");
}

function esDiaDeClase(horario, fecha) {
  return (horario || "").split("-").includes(DIAS_SEMANA[fecha.getDay()]);
}

export default function Asistencias() {
  const { cerrarSesion } = useContext(AuthContext);
  const [fecha, setFecha] = useState(new Date());
  const [grupos, setGrupos] = useState([]);
  const [grupo, setGrupo] = useState(SIN_SELECCION);
  const [alumnos, setAlumnos] = useState([]);
  const [cargandoGrupos, setCargandoGrupos] = useState(true);
  const [cargandoAsistencia, setCargandoAsistencia] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");
  const fechaSeleccionada = fechaISO(fecha);

  useEffect(() => {
    async function cargarGrupos() {
      try {
        const respuesta = await serviceGrupos.obtenerGrupos(null, cerrarSesion);
        if (respuesta.error) {
          throw new Error(
            respuesta.message || "No se han podido obtener los grupos."
          );
        }
        setGrupos((respuesta.grupos || []).map((elemento) => elemento.grupo));
      } catch (err) {
        setError(err.message || "No se han podido obtener los grupos.");
      } finally {
        setCargandoGrupos(false);
      }
    }
    cargarGrupos();
  }, [cerrarSesion]);

  const gruposDelDia = useMemo(
    () => grupos.filter((elemento) => esDiaDeClase(elemento.horario, fecha)),
    [fecha, grupos]
  );

  useEffect(() => {
    if (
      !gruposDelDia.some(
        (elemento) => String(elemento.nid_grupo) === String(grupo.valor)
      )
    ) {
      setGrupo(SIN_SELECCION);
      setAlumnos([]);
    }
  }, [gruposDelDia, grupo.valor]);

  useEffect(() => {
    if (!grupo.valor) {
      return;
    }
    async function cargarAsistencia() {
      setCargandoAsistencia(true);
      try {
        const respuesta = await serviceGrupos.obtenerAsistenciaGrupo(
          grupo.valor,
          fechaSeleccionada,
          cerrarSesion
        );
        if (respuesta.error) {
          throw new Error(
            respuesta.message || "No se ha podido obtener la asistencia."
          );
        }
        setAlumnos(
          (respuesta.alumnos || []).map((elemento) => ({
            ...elemento,
            falta: elemento.falta === "S",
            justificada: elemento.justificada === "S",
          }))
        );
      } catch (err) {
        setError(err.message || "No se ha podido obtener la asistencia.");
        setAlumnos([]);
      } finally {
        setCargandoAsistencia(false);
      }
    }
    cargarAsistencia();
  }, [cerrarSesion, fechaSeleccionada, grupo.valor]);

  function actualizarAlumno(nidMatriculaAsignatura, cambios) {
    setAlumnos((actuales) =>
      actuales.map((elemento) =>
        String(elemento.nid_matricula_asignatura) ===
        String(nidMatriculaAsignatura)
          ? { ...elemento, ...cambios }
          : elemento
      )
    );
  }

  async function guardarAsistencia() {
    setGuardando(true);
    try {
      const respuesta = await serviceGrupos.guardarAsistenciaGrupo(
        grupo.valor,
        fechaSeleccionada,
        alumnos.map((elemento) => ({
          nid_matricula_asignatura: elemento.nid_matricula_asignatura,
          falta: elemento.falta,
          justificada: elemento.falta && elemento.justificada,
          causa:
            elemento.falta && elemento.justificada ? elemento.causa.trim() : "",
        })),
        cerrarSesion
      );
      if (respuesta.error) {
        throw new Error(
          respuesta.message || "No se ha podido guardar la asistencia."
        );
      }
      setExito("Asistencia guardada correctamente.");
    } catch (err) {
      setError(err.message || "No se ha podido guardar la asistencia.");
    } finally {
      setGuardando(false);
    }
  }

  return (
    <ScrollView contentContainerStyle={estilos.contenedor}>
      <Text style={estilos.titulo}>Registro de asistencias</Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          flexWrap: "wrap",
        }}
      >
        <View style={{ fontSize: 16, fontWeight: "bold" }}>
          <Text>Fecha</Text>
          <EntradaFecha onChangeFecha={setFecha} valorFecha={fecha} />
        </View>
        <View style={estilos.contenedorDia}>
          <Text>{NOMBRE_DIAS_SEMANA[fecha?.getDay()]}</Text>
        </View>
        <EntradaGroupRadioButton
          titulo="Grupos con clase"
          opciones={gruposDelDia.map((elemento) => ({
            etiqueta: elemento.nombre,
            valor: elemento.nid_grupo,
          }))}
          valor={grupo}
          setValorSeleccionado={setGrupo}
        />
      </View>
      {cargandoGrupos && <ActivityIndicator size="large" />}
      {!cargandoGrupos && gruposDelDia.length === 0 && (
        <Text>No tienes grupos programados para la fecha seleccionada.</Text>
      )}
      {cargandoAsistencia && <ActivityIndicator size="large" />}
      {!cargandoAsistencia && grupo.valor && alumnos.length === 0 && (
        <Text>Este grupo no tiene alumnos.</Text>
      )}
      {alumnos.map((alumno) => (
        <View key={alumno.nid_matricula_asignatura} style={estilos.alumno}>
          <Text style={estilos.nombre}>{nombreCompleto(alumno)}</Text>
          <CheckBox
            item={{ etiqueta: "Ha faltado" }}
            valorSeleccionado={alumno.falta}
            setValorSeleccionado={(_, falta) =>
              actualizarAlumno(alumno.nid_matricula_asignatura, {
                falta,
                justificada: falta ? alumno.justificada : false,
                causa: falta ? alumno.causa : "",
              })
            }
          />
          <CheckBox
            item={{ etiqueta: "Falta justificada" }}
            valorSeleccionado={alumno.falta && alumno.justificada}
            disabled={!alumno.falta}
            setValorSeleccionado={(_, justificada) =>
              actualizarAlumno(alumno.nid_matricula_asignatura, {
                justificada,
                causa: justificada ? alumno.causa : "",
              })
            }
          />
          <EntradaTexto
            placeholder="Causa de la falta"
            valor={alumno.falta && alumno.justificada ? alumno.causa : ""}
            setValor={(causa) =>
              actualizarAlumno(alumno.nid_matricula_asignatura, { causa })
            }
            editable={alumno.falta && alumno.justificada}
            ancho={300}
          />
        </View>
      ))}
      {alumnos.length > 0 && (
        <Boton
          nombre={guardando ? "Guardando..." : "Guardar asistencia"}
          onPress={guardarAsistencia}
        />
      )}
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
  titulo: { fontSize: 22, fontWeight: "bold", textAlign: "center" },
  alumno: { borderWidth: 1, borderColor: "#ddd", borderRadius: 8, padding: 12 },
  nombre: { fontSize: 16, fontWeight: "bold" },
  contenedorDia: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    height: 50,
    backgroundColor: "#f0f0f0",
  },
});
