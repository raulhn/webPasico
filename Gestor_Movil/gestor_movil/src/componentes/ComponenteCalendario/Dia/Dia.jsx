import { useState } from "react";

export default function Dia(
  dia,
  seleccionado,
  tieneEventos,
  esHoy,
  desactivado,
  accion,
) {
  return (
    <div
      className={`dia ${seleccionado ? "seleccionado" : ""} ${tieneEventos ? "tiene-eventos" : ""} ${esHoy ? "hoy" : ""}`}
      onClick={() => {
        accion();
      }}
    >
      <span className={`${desactivado ? "desactivado" : ""}`}> {{ dia }}</span>
    </div>
  );
}
