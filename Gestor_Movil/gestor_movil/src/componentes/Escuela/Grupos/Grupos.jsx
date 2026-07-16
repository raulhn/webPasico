import { useGrupos } from "../../../hooks/useGrupos";

export default function Grupos() {
  const { grupos, loading, lanzarRefresco } = useGrupos();

  function CardGrupo(objetoGrupo) {
    let alumnos = objetoGrupo.alumnos;
    let grupo = objetoGrupo.grupo;
    return (
      <div key={grupo.nid_grupo} className="card">
        <h3>{grupo.nombre}</h3>
        <p>Profesor: {grupo.profesor}</p>
        <p>Alumnos: {alumnos.length}</p>
      </div>
    );
  }

  function CardGrupos() {
    return grupos.map((grupo) => CardGrupo(grupo));
  }

  if (loading) {
    return <p>Cargando grupos...</p>;
  }

  return (
    <>
      <CardGrupos></CardGrupos>
    </>
  );
}
