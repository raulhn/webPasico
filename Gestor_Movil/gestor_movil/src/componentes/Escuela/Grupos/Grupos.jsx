import { useGrupos } from "../../../hooks/useGrupos";
import { useCursos } from "../../../hooks/useCursos";
import { useState } from "react";
import Cabecera from "../../Cabecera/Cabecera";
import {
  EntradaTexto,
  Selector,
  ModalAviso,
  ModalExito,
  Boton,
  EnlaceDiv,
} from "../../ComponentesUI/ComponentesUI";
import { useAsignaturasProfesor } from "../../../hooks/useAsignaturas";
import { useNavigate } from "react-router";
import { URL_SUBPATH } from "../../../config/Constantes";
import "./Grupos.css";

export default function Grupos() {
  const [nid_curso, setNidCurso] = useState(null);
  const { grupos, loading, lanzarRefresco, crearGrupo } = useGrupos();
  const { asignaturas } = useAsignaturasProfesor();
  const { cursos, loading: loadingCursos } = useCursos(nid_curso);
  const navigate = useNavigate();

  const [errorCrearGrupo, setErrorCrearGrupo] = useState(null);
  const [exitoCrearGrupo, setExitoCrearGrupo] = useState(false);

  const [visibleFormulario, setVisibleFormulario] = useState(false);

  function CardGrupo(objetoGrupo) {
    let alumnos = objetoGrupo.alumnos;
    let grupo = objetoGrupo.grupo;
    return (
      <EnlaceDiv
        key={grupo.nid_grupo}
        onClick={() => navigate(`${URL_SUBPATH}/grupo/${grupo.nid_grupo}`)}
        contenido={() => (
          <div className="card">
            <h3>{grupo.nombre}</h3>
            <p>Profesor: {grupo.profesor}</p>
            <p>Alumnos: {alumnos.length}</p>
          </div>
        )}
      />
    );
  }

  async function handleCrearGrupo(curso, nombre, asignatura) {
    try {
      if (curso && nombre && asignatura) {
        await crearGrupo(curso, nombre, asignatura);
        setExitoCrearGrupo(true);
      } else {
        setErrorCrearGrupo({
          message: "Por favor, complete todos los campos.",
        });
      }
    } catch (error) {
      console.error("Error al crear el grupo:", error);
      setErrorCrearGrupo({
        message:
          "Hubo un error al crear el grupo. Por favor, inténtelo de nuevo.",
      });
    }
  }

  function FormularioGrupo() {
    const [nombre, setNombre] = useState("");
    const [asignatura, setAsignatura] = useState("");
    const [curso, setCurso] = useState("");

    const lista_asignaturas = asignaturas.map((asignatura) => ({
      valor: asignatura.nid_asignatura,
      etiqueta: asignatura.descripcion,
    }));

    const lista_cursos = cursos.map((curso) => ({
      valor: curso.nid_curso,
      etiqueta: curso.descripcion,
    }));

    lista_asignaturas.push({ valor: "", etiqueta: "Selecciona asignatura" });
    return (
      <>
        <div className="modal" style={{ paddingTop: "60px" }}>
          <form>
            <div className="grupos-container">
              <label htmlFor="nombre">Nombre del grupo:</label>
              <EntradaTexto
                id="nombre"
                value={nombre}
                setTexto={(texto) => {
                  setNombre(texto);
                }}
              />
              <Selector
                valor={curso}
                setValor={setCurso}
                width="200px"
                opciones={lista_cursos}
                placeholder="Seleccione curso"
              />

              <Selector
                valor={asignatura}
                setValor={setAsignatura}
                width="200px"
                opciones={lista_asignaturas}
                placeholder="Seleccione asignatura"
              />

              <div className=" grupo-item">
                <Boton
                  texto="Crear grupo"
                  onClick={() => handleCrearGrupo(curso, nombre, asignatura)}
                />
                <Boton
                  texto="Cancelar"
                  onClick={() => setVisibleFormulario(false)}
                />
              </div>
            </div>
          </form>
          <ModalAviso
            visible={errorCrearGrupo !== null}
            setVisible={() => {
              setErrorCrearGrupo(null);
            }}
            mensaje={errorCrearGrupo ? errorCrearGrupo.message : ""}
            textBoton={"Aceptar"}
            titulo={"Error"}
          />

          <ModalExito
            visible={exitoCrearGrupo}
            setVisible={() => {
              setVisibleFormulario(false);
              setExitoCrearGrupo(false);
              lanzarRefresco();
            }}
            mensaje={"Grupo creado con éxito"}
            textBoton={"Aceptar"}
            titulo={"Éxito"}
          />
        </div>
      </>
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
      <div className="container">
        <Cabecera />
        <div className="lista-grupos">
          <Selector
            valor={nid_curso}
            setValor={setNidCurso}
            width="200px"
            opciones={cursos.map((curso) => ({
              valor: curso.nid_curso,
              etiqueta: curso.descripcion,
            }))}
            placeholder="Seleccione curso"
          />
          <CardGrupos></CardGrupos>
        </div>
      </div>
      {visibleFormulario ? (
        <div className="modal">
          <FormularioGrupo />
        </div>
      ) : (
        <Boton
          texto="Crear nuevo grupo"
          onClick={() => setVisibleFormulario(true)}
        />
      )}
    </>
  );
}
