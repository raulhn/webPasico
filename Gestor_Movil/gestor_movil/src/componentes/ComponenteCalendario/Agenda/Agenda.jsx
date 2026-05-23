import { useState } from "react"
import Calendario from "../Calendario/Calendario.jsx"

export default function Agenda() {

  const [fecha, setFecha] = useState(new Date())

  return (
    <Calendario anio_={fecha.getFullYear()} mes_={fecha.getMonth()}></Calendario>
  )
}
