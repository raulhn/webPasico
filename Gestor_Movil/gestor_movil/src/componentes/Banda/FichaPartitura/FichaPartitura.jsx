import  {useParams} from "react-router"
import FormularioPartitura from "../FormularioPartitura/FormularioPartitura";

export default function FichaPartitura()
{
    const {nidPartitura} = useParams();


    console.log("Partitura recuperada", nidPartitura)
  
    return (<FormularioPartitura nidPartitura={nidPartitura}></FormularioPartitura>)
    
}