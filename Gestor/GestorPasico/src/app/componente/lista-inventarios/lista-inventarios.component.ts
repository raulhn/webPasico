import {
  Component,
  OnInit,
  WritableSignal,
  signal,
  Signal,
} from '@angular/core';
import { DataTablesOptions } from 'src/app/logica/constantes';
import { InventarioService } from 'src/app/servicios/inventario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-inventarios',
  templateUrl: './lista-inventarios.component.html',
  styleUrls: ['./lista-inventarios.component.css'],
  standalone: false,
})
export class ListaInventariosComponent implements OnInit {
  bCargados_inventarios: boolean = false;

  dtOptions_fichas_inventarios: any = {};

  ficha_seleccionada: string = '';

  URL_FICHA_INVENTARIO = '/ficha_inventario/';

  $lista_inventarios: WritableSignal<any[]> = signal([]);
  $id_tabla_inventarios: Signal<string> = signal('tabla_ficha_inventario');
  cabecera_inventarios: any[] = [
    { title: 'Descripcion', data: 'descripcion' },
    { title: 'Modelo', data: 'modelo' },
  ];

  constructor(private inventarioService: InventarioService) {}

  click_ficha(ficha_marcada: any) {
    this.ficha_seleccionada = ficha_marcada['nid_inventario'];
  }

  recuperar_inventarios = {
    next: (respuesta: any) => {
      this.$lista_inventarios.set(respuesta.inventarios);

      this.bCargados_inventarios = true;
    },
  };

  ngOnInit(): void {
    this.inventarioService
      .obtener_inventarios()
      .subscribe(this.recuperar_inventarios);
  }

  obtener_url_ficha() {
    return this.URL_FICHA_INVENTARIO + this.ficha_seleccionada;
  }

  peticion_eliminar_inventario = {
    next: (respuesta: any) => {
      this.ficha_seleccionada = '';
      Swal.fire({
        icon: 'success',
        title: 'Inventario eliminado',
        text: 'Se ha eliminado el inventario',
      }).then(() => {
        this.bCargados_inventarios = false;
        this.inventarioService
          .obtener_inventarios()
          .subscribe(this.recuperar_inventarios);
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

  eliminar_ficha() {
    Swal.fire({
      title: 'Eliminar ficha de inventario',
      text: 'Se eliminará la ficha de inventario',
      confirmButtonText: 'Eliminar',
      showCancelButton: true,
    }).then((results: any) => {
      if (results.isConfirmed) {
        this.inventarioService
          .eliminar_inventario(this.ficha_seleccionada)
          .subscribe(this.peticion_eliminar_inventario);
      }
    });
  }
}
