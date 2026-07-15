import { useGrupos } from "../../../hooks/useGrupos";

export default function Grupos() {
  const { grupos } = useGrupos();

  function CardGrupo(grupo) {
    return (
      <div key={grupo.nid_grupo} className="card">
        <h3>{grupo.nombre}</h3>
        <p>Profesor: {grupo.profesor}</p>
        <p>Alumnos: {grupo.alumnos.length}</p>
      </div>
    );
  }

  function CardGrupos() {
    return grupos.map((grupo) => CardGrupo(grupo));
  }
  return (
    <>
      <CardGrupos></CardGrupos>
    </>
  );
}
