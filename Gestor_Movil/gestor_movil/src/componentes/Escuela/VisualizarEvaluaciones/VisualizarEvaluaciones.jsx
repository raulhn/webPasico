import { useParams } from "react-router";
import { useEvaluaciones } from "../../../hooks/useEvaluaciones";
import { useTrimestres } from "../../../hooks/useTrimestres";
import CardEvaluacion from "../CardEvaluacion/CardEvaluacion";
import { CustomTabs } from "../../ComponentesUI/ComponentesUI";
import Cabecera from "../../Cabecera/Cabecera";

export default function VisualizarEvaluaciones()
{
    const { nidMatricula } = useParams();
    const { evaluaciones, nombreAlumno } = useEvaluaciones(nidMatricula);
    const { trimestres } = useTrimestres();

    console.log(evaluaciones)


function mostrarEvaluaciones() {
  if (
    evaluaciones.length > 0 &&
    trimestres.length > 0
  ) {
    const tabsEvaluaciones = [];

    for (let i = 0; i < trimestres.length; i++) {
      const evaluacionesTrimestre = evaluaciones.filter(
        (evaluacion) =>
          evaluacion.nid_trimestre === trimestres[i].nid_trimestre
      );

      if (evaluacionesTrimestre.length === 0) {
        tabsEvaluaciones.push({
          nombre: trimestres[i].nombre,
          contenido: () => (
            <div style={{ padding: 16 }}>
    
              <div className="card">
                <span>No hay evaluaciones para mostrar.</span>
              </div>
            </div>
          ),
        });
      } else {
        console.log(evaluacionesTrimestre)
        tabsEvaluaciones.push({
          nombre: trimestres[i].nombre,
          contenido: () => (
            <div style={{ padding: 16 }}>
              <div className="lista-evaluaciones">
                {evaluacionesTrimestre.map((item) => (
                  <CardEvaluacion key={item.nid_evaluacion_matricula} evaluacion={item} />
                ))}
              </div>
             
              
            </div>
          ),
        });
      }
    }
    return ( <>
      <Cabecera/>
      <div style={{paddingTop: "60px"}}>
        <h1>{nombreAlumno}</h1>
      <CustomTabs tabs={tabsEvaluaciones} pestana={Number(0)} />
      </div>
    </>);
  }
}

return <div>{mostrarEvaluaciones()}</div>;


}