import MisSolicitudesImpresion from "./MisSolicitudesImpresion";

export default function HistorialSolicitudesImpresion() {
  return (
    <MisSolicitudesImpresion
      titulo="Historial de solicitudes de impresión"
      mensajeVacio="Aún no has realizado solicitudes de impresión."
      limite={null}
      permitirCancelacion={false}
      mostrarPartitura
    />
  );
}
