import EvaluacionesAlumnosForm from "../../../componentes/EvaluacionesAlumnosForm";

export default function Evaluaciones() {
  const alumnos = [
    { nid_persona: 1, nombre: "Juan", primer_apellido: "Pérez", segundo_apellido: "Gómez" },
    { nid_persona: 2, nombre: "María", primer_apellido: "López", segundo_apellido: "Martínez" },
  ];

  const handleGuardar = (evaluaciones) => {
    console.log("Evaluaciones guardadas:", evaluaciones);
  };

  return (
    <EvaluacionesAlumnosForm alumnos={alumnos} onGuardar={handleGuardar} />
  );
}