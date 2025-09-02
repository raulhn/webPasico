
import "./ComponentesUI.css";
import {useState} from "react";

export function EntradaTexto({ valorDefecto = "", secure = false, setTexto})
{
    const [valor, setValor] = useState(valorDefecto);

    return (
        <input  className={"entrada-texto"}
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
