import {
  Component,
  OnInit,
  WritableSignal,
  Signal,
  signal,
} from '@angular/core';
import { DataTablesOptions } from 'src/app/logica/constantes';
import { FichaAsistenciaService } from 'src/app/servicios/fichaasistencia.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-fichas-asistencias',
  templateUrl: './lista-fichas-asistencias.component.html',
  styleUrls: ['./lista-fichas-asistencias.component.css'],
  standalone: false,
})
export class ListaFichasAsistenciasComponent implements OnInit {
  $lista_ficha_asistencias: WritableSignal<any[]> = signal([]);
  $id_tabla_asistencias: Signal<string> = signal('tabla_ficha_asistencias');
  cabecera_asistencias: any[] = [{ title: 'Ficha', data: 'etiqueta' }];

  bCargadas_fichas_asistencias: boolean = false;

  ficha_seleccionada: string = '';

  dtOptions_fichas_asistencias: any = {};

  URL_FICHA_ASISTENCIA = '/ficha_asistencia/';

  constructor(private fichaAsistenciaService: FichaAsistenciaService) {}

  click_ficha(ficha_marcada: any) {
    this.ficha_seleccionada = ficha_marcada['nid_ficha_asistencia'];
  }

  recuperar_ficha_asistencias = {
    next: (respuesta: any) => {
      this.$lista_ficha_asistencias.set(respuesta['fichas_asistencias']);
      this.bCargadas_fichas_asistencias = true;
    },
  };

  ngOnInit(): void {
    this.fichaAsistenciaService
      .obtener_fichas_asistencias()
      .subscribe(this.recuperar_ficha_asistencias);
  }

  obtener_url_ficha() {
    return this.URL_FICHA_ASISTENCIA + this.ficha_seleccionada;
  }

  peticion_cancelar_ficha_asistencia = {
    next: (respuesta: any) => {
      Swal.fire({
        icon: 'success',
        title: 'Ficha eliminada',
        text: 'Se ha elimiando la ficha correctamente',
      }).then(() => {
        window.location.reload();
      });
    },
    error: (respuesta: any) => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Se ha producido un error',
      });
    },
  };

  cancelar_ficha_asistencia() {
    Swal.fire({
      title: 'Eliminar ficha',
      text: 'Se eliminará la ficha completamente',
      confirmButtonText: 'Eliminar',
      showCancelButton: true,
    }).then((results: any) => {
      if (results.isConfirmed) {
        this.fichaAsistenciaService
          .cancelar_ficha_asistencia(this.ficha_seleccionada)
          .subscribe(this.peticion_cancelar_ficha_asistencia);
      }
    });
  }
}
