import "./App.css";
import { useNavigate } from "react-router";
import { MdChromeReaderMode } from "react-icons/md";
import { MdFactCheck } from "react-icons/md";
import { MdGroups } from "react-icons/md";
import { EnlaceDiv } from "./componentes/ComponentesUI/ComponentesUI";
import * as Constantes from "./config/Constantes";
import Cabecera from "./componentes/Cabecera/Cabecera";

function App() {
  const navigate = useNavigate();

  return (
    <>
      <Cabecera />
      <div style={{ padding: "60px", display: "flex", gap: "30px" }}>
        <EnlaceDiv
          onClick={() => navigate(Constantes.URL_SUBPATH + `/evaluaciones`)}
          contenido={() => (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                width: "80px",
              }}
            >
              <MdChromeReaderMode size={40} />
              <span>Evaluaciones</span>
            </div>
          )}
        />
        <EnlaceDiv
          onClick={() => navigate(Constantes.URL_SUBPATH + `/asistencias`)}
          contenido={() => (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                width: "80px",
              }}
            >
              <MdFactCheck size={40} />
              <span>Asistencias</span>
            </div>
          )}
        />

        <EnlaceDiv
          onClick={() => navigate(Constantes.URL_SUBPATH + `/grupos`)}
          contenido={() => (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                width: "80px",
              }}
            >
              <MdGroups size={40} />
              <span>Grupos</span>
            </div>
          )}
        />
      </div>
    </>
  );
}

export default App;
