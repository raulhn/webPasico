
import './App.css'
import { useNavigate } from 'react-router'
import { MdChromeReaderMode } from "react-icons/md";
import { EnlaceDiv } from './componentes/ComponentesUI/ComponentesUI';
import * as Constantes from "./config/Constantes"
import Cabecera from './componentes/Cabecera/Cabecera'

function App() {
  const navigate = useNavigate();


  return (
    <>

      <Cabecera />
      <div style={{ padding: "60px" }}>
        <EnlaceDiv onClick={() => navigate(`/gestion/evaluaciones`)} 
        contenido={() => (
                  <div style={{ display: "flex", alignItems: "center",  flexDirection: "column"}}>
          <MdChromeReaderMode size={40}/>
        <span>Evaluaciones</span></div>
        )} />

     </div>

    </>
  )
}

export default App
