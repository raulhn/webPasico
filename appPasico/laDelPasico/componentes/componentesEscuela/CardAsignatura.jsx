import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function CardAsignatura({ matriculaAsignatura, matricula }) {
  function formatDateToMySQL(date) {
    try {
      if (!date) return null;
      const d = new Date(date);
      return d.toISOString().slice(0, 19).replace("T", " ");
    } catch (error) {
      return null;
    }
  }

  console.log("Matricula Asignatura:", matricula);
  function incluirProfesores() {
    const profesores = matriculaAsignatura.profesores || [];
    return profesores.map((profesor, index) => {
      const fechaInicio = new Date(formatDateToMySQL(profesor.fecha_alta));
      const fechaFin = profesor.fechabaja
        ? new Date(formatDateToMySQL(profesor.fecha_baja))
        : null;
      const cadenaFechaFin = fechaFin
        ? `  -  Hasta: ${fechaFin.toLocaleDateString()}`
        : "";
      return (
        <View key={index} style={estilos.profesorRow}>
          <MaterialIcons
            name="person"
            size={18}
            color="#007CFA"
            style={{ marginRight: 6 }}
          />
          <View style={{ flexDirection: "column" }}>
            <Text style={estilos.profesorNombre}>
              {profesor.nombre_profesor} {profesor.primer_apellido_profesor}{" "}
              {profesor.segundo_apellido_profesor}
            </Text>
            <Text style={estilos.profesorFecha}>
              Desde: {fechaInicio.toLocaleDateString()}
              {cadenaFechaFin}
            </Text>
          </View>
        </View>
      );
    });
  }

  if (!matriculaAsignatura) return null;

  return (
    <View style={estilos.card}>
      <View style={estilos.header}>
        <MaterialIcons
          name="book"
          size={24}
          color="#007CFA"
          style={{ marginRight: 8 }}
        />
        <Text style={estilos.asignatura}>{matriculaAsignatura.asignatura}</Text>
      </View>
      <Text style={estilos.label}>
        {matriculaAsignatura.profesores.length > 1 ? "Profesores" : "Profesor"}
      </Text>
      <View style={estilos.profesoresContainer}>{incluirProfesores()}</View>
    </View>
  );
}

const estilos = StyleSheet.create({
  card: {
    backgroundColor: "#f8faff",
    padding: 16,
    borderRadius: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#e3eaf2",
    width: "95%",
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  asignatura: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    flexShrink: 1,
  },
  label: {
    fontSize: 14,
    color: "#007CFA",
    fontWeight: "bold",
    marginBottom: 6,
    marginLeft: 2,
  },
  profesoresContainer: {
    gap: 6,
  },
  profesorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
    flexWrap: "wrap",
  },
  profesorNombre: {
    fontSize: 15,
    color: "#333",
    fontWeight: "500",
    marginRight: 4,
    flexShrink: 1,
  },
  profesorFecha: {
    fontSize: 13,
    color: "#666",
    fontStyle: "italic",
  },
});
