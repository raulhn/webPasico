import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter, Routes, Route} from 'react-router'
import Login from './componentes/Login/Login.jsx'
import {UsuarioProvider} from "./contexto/usuario.jsx"


createRoot(document.getElementById('root')).render(
  <UsuarioProvider>
  <BrowserRouter>
    <Routes>
      <Route  path="/gestion/" element={<App />} />
      <Route path="/gestion/login" element={<Login />} />
    </Routes>
  </BrowserRouter>
  </UsuarioProvider>
)
