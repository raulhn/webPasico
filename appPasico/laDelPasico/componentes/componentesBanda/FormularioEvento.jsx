import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useState, useEffect } from "react";

import { AuthContext } from "../../providers/AuthContext";
import { useContext } from "react";
import serviceEventoConcierto from "../../servicios/serviceEventoConcierto"; // Asegúrate de importar tu servicio correctamente

import SelectorMultipleTipoPersona from "../persona/SelectorMultipleTipoPersona";
import Constantes from "../../config/constantes.js";
import { useTiposMusicos } from "../../hooks/personas/useTipoMusicos.js";

import {
  EntradaTexto,
  EntradaFecha,
  Boton,
  ModalExito,
} from "../componentesUI/ComponentesUI";

export default function FormularioEvento({ cancelar, callback, nidEvento }) {
  const [nombreEvento, setNombreEvento] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fechaEvento, setFechaEvento] = useState(new Date());
  const [vestimenta, setVestimenta] = useState("");
  const [lugar, setLugar] = useState("");
  const [tiposEventoRecuperados, setTiposEventoRecuperados] = useState([]);

  const { cerrarSesion } = useContext(AuthContext);

  const [exito, setExito] = useState(false);

  const { tiposMusicos } = useTiposMusicos();
  const listaTiposMusicos = tiposMusicos.map((tipo) => ({
    etiqueta: tipo.descripcion,
    valor: tipo.nid_tipo_musico,
  }));

  useEffect(() => {
    if (!nidEvento) return;

    serviceEventoConcierto
      .obtenerEventoConcierto(nidEvento, cerrarSesion)
      .then((response) => {
        if (!response.error) {
          setNombreEvento(response.evento_concierto.nombre);
          setDescripcion(response.evento_concierto.descripcion);
          setFechaEvento(new Date(response.evento_concierto.fecha_evento));
          setVestimenta(response.evento_concierto.vestimenta);
          setLugar(response.evento_concierto.lugar);

          let auxTiposEvento = [];

          let tiposEventoRecuperados = response.tipos_evento;

          for (let i = 0; i < tiposEventoRecuperados.length; i++) {
            auxTiposEvento.push(tiposEventoRecuperados[i].nid_tipo_musico);
          }

          let tiposEventoRecuperadosMapeados = tiposEventoRecuperados.map(
            (tipo) => ({
              valor: tipo.nid_tipo_musico,
              etiqueta: tipo.descripcion,
            })
          );

          setTiposEventoRecuperados(tiposEventoRecuperadosMapeados);
        }
      })
      .catch((error) => {
        console.log("Error al obtener el evento:", error);
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
      tiposEvento: conjuntoTiposEvento,
    };

    serviceEventoConcierto
      .registrarEventoConcierto(evento, cerrarSesion)
      .then((response) => {
        if (response.error) {
          console.log("Error al obtener eventos:", response.mensaje);
          return;
        }

        setExito(true); // Cambia el estado de éxito a verdadero
        if (callback) {
          callback();
        }
      })
      .catch((error) => {
        console.log("Error al registrar el evento:", error);
        alert("Error al registrar el evento");
      });
  }

  function obtenerConjuntoTiposEvento() {
    let conjuntoTiposEvento = [];
    let tiposEventosCopia = [...tiposEventoRecuperados];

    for (let i = 0; i < tiposEventosCopia.length; i++) {
      let bExiste = false;
      for (let j = 0; j < conjuntoTiposEvento.length; j++) {
        if (
          tiposEventosCopia[i] !== null &&
          tiposEventosCopia[i].valor == conjuntoTiposEvento[j]
        ) {
          bExiste = true;
          break;
        }
      }

      if (!bExiste && tiposEventosCopia[i] !== null) {
        conjuntoTiposEvento.push(tiposEventosCopia[i].valor);
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
      tiposEvento: conjuntoTiposEvento,
    };

    serviceEventoConcierto
      .actualizarEventoConcierto(evento, cerrarSesion)
      .then((response) => {
        if (response.error) {
          console.log("Error al actualizar el evento:", response.mensaje);
          return;
        }
        setExito(true); // Cambia el estado de éxito a verdadero
        if (callback) {
          callback();
        }
      })
      .catch((error) => {
        console.log("Error al actualizar el evento:", error);
        alert("Error al actualizar el evento");
      });
  }

  function formatearFecha(fecha) {
    const formattedDate = `${fecha.getFullYear()}-${String(
      fecha.getMonth() + 1
    ).padStart(2, "0")}-${String(fecha.getDate()).padStart(2, "0")}`;
    return formattedDate;
  }

  return (
    <ScrollView>
      <View style={estilos.container}>
        <Text style={estilos.titulo}>Registrar evento</Text>
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
          valor={lugar}
        ></EntradaTexto>

        <Text>Fecha</Text>
        <EntradaFecha
          onChangeFecha={(fecha) => {
            setFechaEvento(fecha);
          }}
          valorFecha={fechaEvento}
        ></EntradaFecha>

        <Text> Tipo de Evento </Text>
        <View
          style={{ justifyContent: "center", gap: 10, alignItems: "center" }}
        >
          <SelectorMultipleTipoPersona
          titulo={"Tipo de Evento"}
            tiposEventos={tiposEventoRecuperados}
            callback={(eventos) => {
              setTiposEventoRecuperados(eventos);
            }}
            opciones={listaTiposMusicos}
          />
        </View>
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
    </ScrollView>
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
    color: Constantes.COLOR_AZUL, // Color azul para resaltar
    marginBottom: 20, // Espacio debajo del título
    textAlign: "center", // Centrado horizontalmente
  },
  containerSeleccionTipos: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});
