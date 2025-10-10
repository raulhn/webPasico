import  {useParams} from "react-router"
import FormularioPartitura from "../FormularioPartitura/FormularioPartitura";
import Cabecera from "../../Cabecera/Cabecera.jsx";

export default function FichaPartitura()
{
    const {nidPartitura} = useParams();


    console.log("Partitura recuperada", nidPartitura)

    return (<><Cabecera /><FormularioPartitura nidPartitura={nidPartitura}></FormularioPartitura></>);

}