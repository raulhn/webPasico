import { useGrupos } from "../../../hooks/useGrupos";
import { useState } from "react";
import {
  EntradaTexto,
  Selector,
  ModalAviso,
  ModalExito,
  Boton,
} from "../../ComponentesUI/ComponentesUI";
import { useAsignaturasProfesor } from "../../../hooks/useAsignaturas";
import "./Grupos.css";

export default function Grupos() {
  const { grupos, loading, lanzarRefresco, crearGrupo } = useGrupos();
  const { asignaturas } = useAsignaturasProfesor();

  const [errorCrearGrupo, setErrorCrearGrupo] = useState(null);
  const [exitoCrearGrupo, setExitoCrearGrupo] = useState(false);

  const [visibleFormulario, setVisibleFormulario] = useState(false);

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

  async function handleCrearGrupo(nombre, asignatura) {
    try {
      if (nombre && asignatura) {
        await crearGrupo(nombre, asignatura);
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

    return (
      <>
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
              valor={asignatura}
              setValor={setAsignatura}
              width="200px"
              opciones={asignaturas.map((asignatura) => ({
                valor: asignatura.nid_asignatura,
                etiqueta: asignatura.descripcion,
              }))}
              placeholder="Seleccione asignatura"
            />

            <div className=" grupo-item">
              <Boton
                texto="Crear grupo"
                onClick={() => handleCrearGrupo(nombre, asignatura)}
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
      <CardGrupos></CardGrupos>
      {visibleFormulario ? (
        <FormularioGrupo />
      ) : (
        <Boton
          texto="Crear nuevo grupo"
          onClick={() => setVisibleFormulario(true)}
        />
      )}
    </>
  );
}
