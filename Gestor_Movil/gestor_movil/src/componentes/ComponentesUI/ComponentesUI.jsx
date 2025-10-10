
import "./ComponentesUI.css";
import {useEffect, useState} from "react";
import * as Constantes from "../../config/Constantes";

import { MdWarningAmber, MdCheckCircleOutline } from "react-icons/md";

export function EntradaTexto({ valorDefecto = "", secure = false, setTexto, width = "150px", height = "30px" })
{
    const [valor, setValor] = useState(valorDefecto);

    useEffect(() => {
        setValor(valorDefecto);
    }, [valorDefecto]);

    return (
        <input  className={"entrada-texto"} style={{ width: width, height: height }}
         value={valor} onChange={e => { setValor(e.target.value); setTexto(e.target.value); }} 
         type={secure ? "password" : "text"} />
    );
    
}

export function Boton({ texto = "Botón", onClick = () => {} }) {
    return (
        <button className={"boton"} onClick={onClick}>
            {texto}
        </button>
    );
}


export function EntradaTextoArea({ valorDefecto = "", setTexto, width= "300px", height= "100px" }) {
    const [valor, setValor] = useState(valorDefecto);

    useEffect(() => {
        setValor(valorDefecto);
    }, [valorDefecto]);

    return (
        <textarea className={"entrada-texto-area"} style={{ width: width, height: height }}
            value={valor} onChange={e => { setValor(e.target.value); setTexto(e.target.value); }} />
    );

}

export function Selector({valor ="", opciones = [], setValor, width = "150px", height = "50px" }) {
    return (
        <select className={"selector"} style={{ width: width, height: height }} value={valor} onChange={e => setValor(e.target.value)}>
           
            {opciones.map(opcion => (
                <option key={opcion.valor} value={opcion.valor}>{opcion.etiqueta}</option>
            ))}
        </select>
    );
}


export function CustomTabs({ tabs, pestana = 0 }) {
  const [pestanaSeleccionada, setPestanaSeleccionada] = useState();

  function obtenerBackGroundColor(active, index) {
    if (active) {
      return "#e0e0e0";
    }
    return index === pestanaSeleccionada ? Constantes.COLOR_AZUL : "#f5f5f5";
  }

  useEffect(() => {
    setPestanaSeleccionada(pestana);
  }, [pestana]);

  return (
    <div className="custom-tabs">
      <div className="custom-tabs-bar">
        {tabs.map((tab, index) => (
          <button
            key={index}
            type="button"
            className={`custom-tab-btn${index === pestanaSeleccionada ? " active" : ""}`}
            style={{
              background: obtenerBackGroundColor(false, index),
              color: index === pestanaSeleccionada ? "#fff" : "#222",
              padding: "7px 16px",
              borderRadius: "5px",
              border: "none",
              marginRight: "5px",
              cursor: "pointer",
              fontWeight: 500,
              transition: "background 0.2s, color 0.2s"
            }}
            onClick={() => setPestanaSeleccionada(index)}
            onMouseDown={e => e.currentTarget.style.background = obtenerBackGroundColor(true, index)}
            onMouseUp={e => e.currentTarget.style.background = obtenerBackGroundColor(false, index)}
            onMouseLeave={e => e.currentTarget.style.background = obtenerBackGroundColor(false, index)}
          >
            {tab.nombre}
          </button>
        ))}
      </div>
      <div className="custom-tabs-content" style={{ marginTop: 12 }}>
        {tabs.map((tab, index) =>
          index === pestanaSeleccionada ? (
            <div key={index} style={{ flexGrow: 1 }}>
              {tab.contenido()}
            </div>
          ) : null
        )}
      </div>
    </div>
  );
}


// ModalAviso
export function ModalAviso({ visible, setVisible, mensaje, textBoton, titulo =""}) {
  if (!visible) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <MdWarningAmber size={60} color="#f87c00" className="icono-warning" />
        <div className="titulo">{titulo}</div>
        <div className="mensaje">{mensaje}</div>
        <button className="boton" onClick={() => setVisible(false)}>{textBoton}</button>
      </div>
    </div>
  );
}

// ModalConfirmacion
export function ModalConfirmacion({
  visible,
  setVisible,
  mensaje,
  textBoton,
  textBotonCancelar,
  accion,
  accionCancelar,
}) {
  if (!visible) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <MdWarningAmber size={60} color="#f87c00" className="icono-warning" />
        <div className="mensaje">{mensaje}</div>
        <div style={{ display: "flex", justifyContent: "center", gap: 10 }}>
          <button
            className="boton"
            onClick={() => {
              setVisible(false);
              accion();
            }}
            style={{ background: "#007BFF", color: "#FFF" }}
          >
            {textBoton}
          </button>
          <button
            className="boton"
            onClick={() => {
              accionCancelar();
              setVisible(false);
            }}
            style={{ background: "red", color: "#FFF" }}
          >
            {textBotonCancelar}
          </button>
        </div>
      </div>
    </div>
  );
}

// ModalExito
export function ModalExito({ visible, setVisible, mensaje, textBoton }) {
  if (!visible) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <MdCheckCircleOutline size={60} color="#4caf50" className="icono-warning" />
        <div className="mensaje">{mensaje}</div>
        <button className="boton" onClick={() => setVisible(false)}>{textBoton}</button>
      </div>
    </div>
  );
}


export function EnlaceDiv({ onClick, contenido}) {
  return (
    <div className="enlace-div" onClick={onClick}>
      {contenido()}
    </div>
  );
}


