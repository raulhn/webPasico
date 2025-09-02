
import "./ComponentesUI.css";
import {useEffect, useState} from "react";

export function EntradaTexto({ valorDefecto = "", secure = false, setTexto, width = "150px", height = "20px" })
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