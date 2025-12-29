import "./FichaPersona.css";
import { useParams } from "react-router";
import { usePersona } from "../../../hooks/usePersonas.js";
import Cabecera from "../../Cabecera/Cabecera.jsx";

export default function FichaPersona() {
  const { nidPersona } = useParams();
  const { info, loading, error } = usePersona(nidPersona);

  if (loading || !info) {
    return (
      <div className="loading-container">
        <span className="loading-text">
          Cargando información de la persona...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>Error al cargar la información: {error}</p>
      </div>
    );
  }

  function mostrarPadre() {
    if (info.padre) {
      return (
        <div className="padre-card">
          <div className="parent-title">Padre</div>
          <div className="parent-info">
            <div className="info-item">
              <span className="info-label">Nombre:</span>
              <span className="info-value">
                {info.padre.nombre} {info.padre.primer_apellido}{" "}
                {info.padre.segundo_apellido}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">
                {info.padre.correo_electronico}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Teléfono:</span>
              <span className="info-value">{info.padre.telefono}</span>
            </div>
          </div>
        </div>
      );
    }
  }

  function mostrarMadre() {
    if (info.madre) {
      return (
        <div className="madre-card">
          <div className="parent-title">Madre</div>
          <div className="parent-info">
            <div className="info-item">
              <span className="info-label">Nombre:</span>
              <span className="info-value">
                {info.madre.nombre} {info.madre.primer_apellido}{" "}
                {info.madre.segundo_apellido}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Email:</span>
              <span className="info-value">
                {info.madre.correo_electronico}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Teléfono:</span>
              <span className="info-value">{info.madre.telefono}</span>
            </div>
          </div>
        </div>
      );
    }
  }

  return (
    <>
      <Cabecera />

      <div className="ficha-persona-container">
        <div className="ficha-persona-header">
          <h1 className="ficha-persona-title">Ficha Personal</h1>
        </div>

        <div className="persona-card">
          <div className="persona-card-title">Datos Personales</div>
          <div className="persona-info">
            <div className="info-item">
              <span className="info-label">Nombre Completo</span>
              <span className="info-value">
                {info.persona.nombre} {info.persona.primer_apellido}{" "}
                {info.persona.segundo_apellido}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Correo Electrónico</span>
              <span className="info-value">
                {info.persona.correo_electronico}
              </span>
            </div>
            <div className="info-item">
              <span className="info-label">Teléfono</span>
              <span className="info-value">{info.persona.telefono}</span>
            </div>
          </div>
        </div>

        <div className="padres-container">
          {mostrarPadre()}
          {mostrarMadre()}
        </div>
      </div>
    </>
  );
}
