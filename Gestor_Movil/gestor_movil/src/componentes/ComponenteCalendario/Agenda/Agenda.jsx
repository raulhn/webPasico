import { useState } from "react"
import Calendario from "../Calendario/Calendario.jsx"

export default function Agenda() {

  const [fecha, setFecha] = useState(sysdate)

  return (
    <Calendario anio_={fecha.getYear()} mes_={fecha.getMonth()}></Calendario>
  )
}
