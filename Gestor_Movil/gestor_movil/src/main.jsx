import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route} from 'react-router'
import Login from './componentes/Login/Login.jsx'
import {UsuarioProvider} from "./contexto/usuario.jsx"
import Evaluaciones from './componentes/Escuela/Evaluaciones/Evaluaciones.jsx'
import Evaluacion from './componentes/Escuela/Evaluacion/Evaluacion.jsx'
import VisualizarEvaluaciones from './componentes/Escuela/VisualizarEvaluaciones/VisualizarEvaluaciones.jsx'
import CambiarPassword from './componentes/CambiarPassword/CambiarPassword.jsx'
import Partituras from './componentes/Banda/Partituras/Partituras.jsx'
import FichaPartitura from './componentes/Banda/FichaPartitura/FichaPartitura.jsx'
import ListaPersonas from './componentes/Personas/ListaPersonas.jsx'

createRoot(document.getElementById('root')).render(
  <UsuarioProvider>
  <BrowserRouter>
    <Routes>
      <Route  path="/gestion/" element={<App />} />
      <Route path="/gestion/login" element={<Login />} />
      <Route path="/gestion/evaluaciones" element={<Evaluaciones />} />
      <Route path="/gestion/evaluacion/:nidCurso/:nidAsignatura/:nidTrimestre" element={<Evaluacion />} />
      <Route path="/gestion/visualizar_evaluaciones/:nidMatricula/:nidTrimestre" element={<VisualizarEvaluaciones />} />
      <Route path="/gestion/cambiar_password" element={<CambiarPassword />} />
      <Route path="/gestion/partituras" element={<Partituras />} />
      <Route path="/gestion/partitura/:nidPartitura" element={<FichaPartitura />}></Route>
      <Route path="/gestion/nueva_partitura" element={<FichaPartitura />}></Route>
      <Route path="/gestion/lista_personas" element={<ListaPersonas/>}></Route>
    </Routes>
  </BrowserRouter>
  </UsuarioProvider>
)
