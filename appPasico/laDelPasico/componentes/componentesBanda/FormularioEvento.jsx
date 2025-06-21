import { View, Text, StyleSheet } from "react-native";
import { useState, useEffect } from "react";

import { AuthContext } from "../../providers/AuthContext";
import { useContext } from "react";
import serviceEventoConcierto from "../../servicios/serviceEventoConcierto"; // Asegúrate de importar tu servicio correctamente

import { BotonFixed, ModalExito } from "../componentesUI/ComponentesUI";
import { SelectorTipoPersona} from "../persona/SelectorTipoPersona"


import {
  EntradaTexto,
  EntradaFecha,
  Boton,
} from "../componentesUI/ComponentesUI";

export default function FormularioEvento({ cancelar, callback, nidEvento }) {
  const [nombreEvento, setNombreEvento] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaEvento, setFechaEvento] = useState(new Date());
  const [vestimenta, setVestimenta] = useState("");
  const [lugar, setLugar] = useState("");
  const [tiposEvento, setTiposEvento] = useState([null]);
  const [numTiposEvento, setNumTiposEvento] = useState(1);

  const { cerrarSesion } = useContext(AuthContext);

  const [exito, setExito] = useState(false);

  useEffect(() => {
    if (!nidEvento) return;

    serviceEventoConcierto
      .obtenerEventoConcierto(nidEvento, cerrarSesion)
      .then((response) => {
        if (!response.error) {
          setNombreEvento(response.evento_concierto.nombre);
          setDescripcion(response.evento_concierto.descripcion);
          setFechaEvento(new Date(response.evento_concierto.fecha_evento));

          let auxTiposEvento = [];
          let tiposEventoRecuperados = response.evento_concierto.tipos_evento;

          for(let i=0; i < tiposEventoRecuperados.length; i++)
          {
            auxTiposEvento.push({etiqueta: tiposEventoRecuperados[i].descripcion , 
              valor:tiposEventoRecuperados[i].nid_tipo_musico})
          }
        }
      })
      .catch((error) => {
        console.error("Error al obtener el evento:", error);
        cerrarSesion();
      });
  }, [nidEvento]);



  function registrarEventoConcierto() {
    if (nombreEvento === "" || descripcion === "") {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const conjuntoTiposEvento = obtenerConjuntoTiposEvento();

    const evento = {
      nombre: nombreEvento,
      fecha_evento: formatearFecha(fechaEvento),
      descripcion: descripcion,
      tipo_evento: "Concierto",
      publicado: "N",
      vestimenta: vestimenta,
      lugar: lugar,
      tiposEvento: conjuntoTiposEvento
    };

    serviceEventoConcierto
      .registrarEventoConcierto(evento, cerrarSesion)
      .then((response) => {
        if (response.error) {
          console.error("Error al obtener eventos:", response.mensaje);
          return;
        }

        setExito(true); // Cambia el estado de éxito a verdadero
        if (callback) {
          callback();
        }
      })
      .catch((error) => {
        console.error("Error al registrar el evento:", error);
        alert("Error al registrar el evento");
      });
  }

  function obtenerConjuntoTiposEvento()
  {
    let conjuntoTiposEvento = [];

    for(let i=0; i < tiposEvento.length; i++)
    {
      let bExiste = false;
      for(let j=0; j < conjuntoTiposEvento.length; j++)
      {
        if(tiposEvento[i].valor == conjuntoTiposEvento[j])
        {
          bExiste = true;
          break;
        }
      }
      if (!bExiste)
      {
        conjuntoTiposEvento.push(tiposEvento[i].valor);
      }
    }

    return conjuntoTiposEvento;
  }

  function actualizarEventoConcierto() {
    if (nombreEvento === "" || descripcion === "") {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const conjuntoTiposEvento = obtenerConjuntoTiposEvento();

    const evento = {
      nid_evento_concierto: nidEvento,
      nombre: nombreEvento,
      fecha_evento: formatearFecha(fechaEvento),
      descripcion: descripcion,
      tipo_evento: "Concierto",
      publicado: "N",
      vestimenta: vestimenta,
      lugar: lugar,
      tiposEvento: conjuntoTiposEvento
    };

    serviceEventoConcierto
      .actualizarEventoConcierto(evento, cerrarSesion)
      .then((response) => {
        if (response.error) {
          console.error("Error al actualizar el evento:", response.mensaje);
          return;
        }
        setExito(true); // Cambia el estado de éxito a verdadero
        if (callback) {
          callback();
        }
      })
      .catch((error) => {
        console.error("Error al actualizar el evento:", error);
        alert("Error al actualizar el evento");
      });
  }

  function formatearFecha(fecha) {
    const formattedDate = `${fecha.getFullYear()}-${String(
      fecha.getMonth() + 1
    ).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;
    return formattedDate;
  }

  function incluyeSelectorTipoPersona()
  {
    let retorno = (<SelectorTipoPersona
                  setTexto={(tipoSeleccionado) =>
                        {
                          if(tipoSeleccionado === null)
                          {
                            //Se hace una copia del array
                            let auxTiposEvento = tiposEvento.slice() 
                            auxTiposEvento[i] = tipoSeleccionado.valor;
                            setTiposEvento(auxTiposEvento);
                          }
                        }}
              > </SelectorTipoPersona>
              
        );

    for (let i=0; i<numTiposEvento; i++)
    {
      if (i == numTiposEvento -1)
      {
        retorno = retorno + (
          <BotonFixed
            onPress={() =>
            {
              setNumTiposEvento(numTiposEvento + 1);
              let auxTiposEventos = tiposEvento.slice();
              auxTiposEventos.push(null);
              setTiposEvento(auxTiposEventos)
            }
            }></BotonFixed>
        )
      }
      else{
      const selector = (<SelectorTipoPersona
                        setTexto={(tipoSeleccionado) =>
                        {
                          if(tipoSeleccionado === null)
                          {
                            let auxTiposEvento = tiposEvento.slice();
                            auxTiposEvento[i] = tipoSeleccionado.valor;
                            setTiposEvento(auxTiposEvento);
                          }
                        }}></SelectorTipoPersona>
      )
      retorno = retorno + (<BotonFixed
                           onPress={()=>
                           {
                            setNumTiposEvento(numTiposEvento - 1)
                            let auxTiposEvento = tiposEvento.slice();
                            const indice = auxTiposEvento.indexOf(i);
                            auxTiposEvento.splice(indice, 1);
                            setTiposEvento(auxTiposEvento);
                           }
                           }
                          ></BotonFixed>)
      }
    }
    return retorno;

  }


  return (
    <View style={estilos.container}>
      <Text style={estilos.titulo}>Crear evento</Text>
      <Text>Nombre de Evento</Text>
      <EntradaTexto
        placeholder={"Nombre del Evento"}
        setValor={(text) => setNombreEvento(text)}
        valor={nombreEvento}
      ></EntradaTexto>

      <Text>Descripción</Text>
      <EntradaTexto
        placeholder={"Descripción del Evento"}
        setValor={(text) => setDescripcion(text)}
        ancho={300}
        alto={100}
        multiline={true}
        valor={descripcion}
      ></EntradaTexto>

      <Text>Vestimenta</Text>
      <EntradaTexto
        placeholder={"Vestimenta"}
        setValor={(text) => setVestimenta(text)}
        valor={vestimenta}
        ></EntradaTexto>

      <Text>Lugar</Text>
      <EntradaTexto
        placeholder={"Lugar"}
        setValor={(text) => setLugar(text)}
        valor={lugar}></EntradaTexto>

      <Text>Fecha</Text>
      <EntradaFecha
        onChangeFecha={(fecha) => {
          setFechaEvento(fecha);
          console.log("Fecha recuperada " + fecha);
        }}
        valorFecha={fechaEvento}
      ></EntradaFecha>

      {incluyeSelectorTipoPersona}
        
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          gap: 10,
          width: "100%",
        }}
      >
        <Boton
          nombre="Guardar"
          onPress={() => {
            if (nidEvento) {
              actualizarEventoConcierto();
            } else {
              registrarEventoConcierto();
            }
          }}
        />
        <Boton nombre="Cancelar" color="red" onPress={cancelar} />
      </View>
      <ModalExito
        visible={exito} // Cambia esto según tu lógica
        callback={() => {
          setExito(false);
          callback(); // Llama a la función de callback para refrescar la lista de eventos
        }} // Cambia esto según tu lógica
        mensaje="Evento registrado con éxito"
        textBoton="Aceptar"
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  titulo: {
    fontSize: 24, // Tamaño de fuente grande
    fontWeight: "bold", // Negrita para destacar
    color: "#007CFA", // Color azul para resaltar
    marginBottom: 20, // Espacio debajo del título
    textAlign: "center", // Centrado horizontalmente
  },
});
