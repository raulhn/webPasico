import {
  Component,
  OnInit,
  WritableSignal,
  Signal,
  signal,
} from '@angular/core';
import { PrestamosService } from 'src/app/servicios/prestamos.service';
import { DataTablesOptions } from 'src/app/logica/constantes';
import 'datatables.net-plugins/filtering/type-based/accent-neutralise.mjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-prestamos',
  templateUrl: './lista-prestamos.component.html',
  styleUrls: ['./lista-prestamos.component.css'],
  standalone: false,
})
export class ListaPrestamosComponent implements OnInit {
  bCargado_Prestamos: boolean = false;
  dtOptions_Prestamos: any = {};

  constructor(private prestamosServices: PrestamosService) {}

  URL_FICHA_PRESTAMO = '/ficha_prestamo/';

  prestamo_seleccionado: string = '';

  $prestamos: WritableSignal<any[]> = signal([]);
  $id_tabla_prestamos: Signal<string> = signal('tabla_prestamos');
  cabeceras_tabla_prestamos: any[] = [
    { title: 'Prestado a', data: 'etiqueta_persona' },
    { title: 'Instrumento', data: 'etiqueta_inventario' },
    { title: 'Fecha Prestamo', data: 'fecha_inicio' },
    {
      title: 'Fecha Devolucion',
      data: 'fecha_fin',
    },
  ];

  click_prestamo(prestamo: any) {
    this.prestamo_seleccionado = prestamo['nid_prestamo'];
  }

  peticion_obtener_prestamos = {
    next: (respuesta: any) => {
      this.$prestamos.set(respuesta['prestamos']);

      this.bCargado_Prestamos = true;
    },
  };

  ngOnInit(): void {
    this.prestamosServices
      .obtener_prestamos()
      .subscribe(this.peticion_obtener_prestamos);
  }

  obtener_url_ficha_prestamo() {
    return this.URL_FICHA_PRESTAMO + this.prestamo_seleccionado;
  }

  peticion_baja_prestamo = {
    next: (respuesta: any) => {
      this.prestamo_seleccionado = '';
      Swal.fire({
        title: 'Prestamo dado de baja',
        icon: 'success',
        showConfirmButton: true,
      }).then((result) => {
        this.prestamosServices
          .obtener_prestamos()
          .subscribe(this.peticion_obtener_prestamos);
      });
    },
    error: (respuesta: any) => {
      Swal.fire({
        title: 'Error al dar de baja el prestamo',
        icon: 'error',
        showConfirmButton: true,
      });
    },
  };

  dar_de_baja_prestamo() {
    Swal.fire({
      title: 'Dar de baja prestamo',
      text: '¿Estás seguro de dar de baja el prestamo?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Dar de baja',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.prestamosServices
          .dar_baja_prestamo(this.prestamo_seleccionado)
          .subscribe(this.peticion_baja_prestamo);
      }
    });
  }
}
