import { useState } from "react";

export default function Dia(
  dia,
  seleccionado,
  tieneEventos,
  esHoy,
  desactivado,
) {
  return (
    <div
      className={`dia ${seleccionado ? "seleccionado" : ""} ${tieneEventos ? "tiene-eventos" : ""} ${esHoy ? "hoy" : ""}`}
    >
      <span className={`${desactivado ? "desactivado" : ""}`}> {{ dia }}</span>
    </div>
  );
}
