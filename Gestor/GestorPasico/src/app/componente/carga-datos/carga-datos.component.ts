import { Component } from '@angular/core';
import { CargaDatosService } from 'src/app/servicios/carga-datos.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-carga-datos',
  templateUrl: './carga-datos.component.html',
  styleUrl: './carga-datos.component.css',
  standalone: false,
})
export class CargaDatosComponent {
  formData = new FormData();

  // Propiedades para el estado del componente
  archivoSeleccionado: boolean = false;
  nombreArchivo: string = '';
  tamanoArchivo: string = '';
  cargando: boolean = false;

  // Mensajes de estado
  mensajeExito: string = '';
  mensajeError: string = '';
  mensajeWarning: string = '';

  constructor(
    private cargaDatosService: CargaDatosService,
    private router: Router,
  ) {}

  onChange(event: any) {
    const datos: File = event.target.files[0];

    if (datos) {
      // Limpiar FormData anterior
      this.formData = new FormData();
      this.formData.append('datos', datos);

      // Actualizar estado del archivo
      this.archivoSeleccionado = true;
      this.nombreArchivo = datos.name;
      this.tamanoArchivo = this.formatearTamanoArchivo(datos.size);

      // Limpiar mensajes anteriores
      this.limpiarMensajes();

      // Validar tipo de archivo
      this.validarTipoArchivo(datos);
    } else {
      this.resetearEstadoArchivo();
    }
  }

  private formatearTamanoArchivo(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  private validarTipoArchivo(archivo: File): void {
    const tiposPermitidos = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
      'application/json',
    ];

    const extensionesPermitidas = ['.csv', '.xlsx', '.xls', '.json'];
    const extension = archivo.name
      .toLowerCase()
      .substring(archivo.name.lastIndexOf('.'));

    if (
      !tiposPermitidos.includes(archivo.type) &&
      !extensionesPermitidas.includes(extension)
    ) {
      this.mensajeWarning =
        'Tipo de archivo no soportado. Por favor, selecciona un archivo CSV, Excel o JSON.';
    }
  }

  private resetearEstadoArchivo(): void {
    this.archivoSeleccionado = false;
    this.nombreArchivo = '';
    this.tamanoArchivo = '';
    this.limpiarMensajes();
  }

  private limpiarMensajes(): void {
    this.mensajeExito = '';
    this.mensajeError = '';
    this.mensajeWarning = '';
  }

  peticion_guardar = {
    next: (respuesta: any) => {
      this.cargando = false;
      this.mensajeExito = 'Los datos se han cargado exitosamente';

      Swal.fire({
        icon: 'success',
        title: 'Datos guardados',
        text: 'Se han guardado los cambios correctamente',
        confirmButtonColor: '#3b82f6',
      }).then(() => {
        this.router
          .navigateByUrl('/', { skipLocationChange: true })
          .then(() => {
            this.router.navigate(['/carga_lote/' + respuesta.lote]);
          });
      });
    },
    error: (respuesta: any) => {
      this.cargando = false;
      this.mensajeError =
        'Error al procesar el archivo. Por favor, inténtalo de nuevo.';

      Swal.fire({
        icon: 'error',
        title: 'Error al procesar',
        text: 'Se ha producido un error al procesar el archivo',
        confirmButtonColor: '#3b82f6',
      });
    },
  };

  guardar() {
    if (!this.archivoSeleccionado) {
      this.mensajeWarning =
        'Por favor, selecciona un archivo antes de continuar.';
      return;
    }

    this.cargando = true;
    this.limpiarMensajes();

    this.cargaDatosService
      .cargarDatos(this.formData)
      .subscribe(this.peticion_guardar);
  }
}
