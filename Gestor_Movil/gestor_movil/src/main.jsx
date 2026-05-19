import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Routes, Route } from "react-router";
import Login from "./componentes/Login/Login.jsx";
import { UsuarioProvider } from "./contexto/usuario.jsx";
import Evaluaciones from "./componentes/Escuela/Evaluaciones/Evaluaciones.jsx";
import Evaluacion from "./componentes/Escuela/Evaluacion/Evaluacion.jsx";
import VisualizarEvaluaciones from "./componentes/Escuela/VisualizarEvaluaciones/VisualizarEvaluaciones.jsx";
import CambiarPassword from "./componentes/CambiarPassword/CambiarPassword.jsx";
import Partituras from "./componentes/Banda/Partituras/Partituras.jsx";
import FichaPartitura from "./componentes/Banda/FichaPartitura/FichaPartitura.jsx";
import ListaPersonas from "./componentes/Personas/ListaPersonas/ListaPersonas.jsx";
import FichaPersona from "./componentes/Personas/FichaPersona/FichaPersona.jsx";
import SelectorEvaluacionesProfesor from "./componentes/Escuela/SelectorEvaluacionesProfesor/SelectorEvaluacionesProfesor.jsx";
import EvaluacionesProfesor from "./componentes/Escuela/EvaluacionesProfesor/EvaluacionesProfesor.jsx";
import Registro from "./componentes/Usuarios/Registro/Registro.jsx";
import RecuperarPassword from "./componentes/Usuarios/RecuperaPassword/RecuperaPassword.jsx";
import { URL_SUBPATH } from "./config/Constantes";

createRoot(document.getElementById("root")).render(
  <UsuarioProvider>
    <BrowserRouter>
      <Routes>
        <Route path={URL_SUBPATH + "/"} element={<App />} />
        <Route path={URL_SUBPATH + "/login"} element={<Login />} />
        <Route
          path={URL_SUBPATH + "/evaluaciones"}
          element={<Evaluaciones />}
        />
        <Route
          path={
            URL_SUBPATH + "/evaluacion/:nidCurso/:nidAsignatura/:nidTrimestre"
          }
          element={<Evaluacion />}
        />
        <Route
          path={
            URL_SUBPATH + "/visualizar_evaluaciones/:nidMatricula/:nidTrimestre"
          }
          element={<VisualizarEvaluaciones />}
        />
        <Route
          path={URL_SUBPATH + "/ficha_persona/:nidPersona"}
          element={<FichaPersona />}
        />
        <Route
          path={URL_SUBPATH + "/cambiar_password"}
          element={<CambiarPassword />}
        />
        <Route path={URL_SUBPATH + "/partituras"} element={<Partituras />} />
        <Route
          path={URL_SUBPATH + "/partitura/:nidPartitura"}
          element={<FichaPartitura />}
        ></Route>
        <Route
          path={URL_SUBPATH + "/nueva_partitura"}
          element={<FichaPartitura />}
        ></Route>
        <Route
          path={URL_SUBPATH + "/lista_personas"}
          element={<ListaPersonas />}
        ></Route>
        <Route
          path={URL_SUBPATH + "/selector_evaluacion_profesor"}
          element={<SelectorEvaluacionesProfesor />}
        />
        <Route
          path={
            URL_SUBPATH +
            "/evaluaciones_profesor/:nidCurso/:nidAsignatura/:nidProfesor/:nidTrimestre"
          }
          element={<EvaluacionesProfesor />}
        />
        <Route path={URL_SUBPATH + "/registro"} element={<Registro />} />
        <Route
          path={URL_SUBPATH + "/recuperarPassword"}
          element={<RecuperarPassword />}
        />
      </Routes>
    </BrowserRouter>
  </UsuarioProvider>,
);
