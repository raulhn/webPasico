import { Component, OnInit } from '@angular/core';
import { PrestamosService } from 'src/app/servicios/prestamos.service';
import { DataTablesOptions } from 'src/app/logica/constantes';
import 'datatables.net-plugins/filtering/type-based/accent-neutralise.mjs';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-lista-prestamos',
    templateUrl: './lista-prestamos.component.html',
    styleUrls: ['./lista-prestamos.component.css'],
    standalone: false
})
export class ListaPrestamosComponent implements OnInit {

  bCargado_Prestamos: boolean = false;
  dtOptions_Prestamos: any= {};

  constructor(private prestamosServices:PrestamosService) { }

  URL_FICHA_PRESTAMO = "/ficha_prestamo/";

  prestamos: any = [];
  prestamo_seleccionado: string= "";

  click_prestamo(prestamo: any)
  {
    this.prestamo_seleccionado = prestamo['nid_prestamo'];
  }

  peticion_obtener_prestamos =
  {
    next: (respuesta: any) => {
      this.prestamos = respuesta['prestamos'];

      var datatable = $('#tabla_prestamos').DataTable();
      datatable.destroy();
      this.dtOptions_Prestamos =
      {
       language: DataTablesOptions.spanish_datatables,
       data: this.prestamos,
       dom: 'Bfrtip',
       buttons: [{extend: 'excel', text: 'Generar Excel', className: 'btn btn-dark mb-3'}],
       columns:
       [
         {title: 'Prestado a',
          data: 'etiqueta_persona'},
         {title: 'Instrumento',
          data: 'etiqueta_inventario'
         },
         {title: 'Fecha Prestamo',
          data: 'fecha_inicio'},
          {
            title: 'Fecha Devolucion',
            data: 'fecha_fin'
          }
        ],
          rowCallback: (row: Node, data: any[] | Object, index: number) => {
            $('td', row).off('click');
            $('td', row).on('click', () => {
              this.click_prestamo(data);
              $('#tabla_prestamos tr').removeClass('selected')
              $(row).addClass('selected');
            });
            return row;
          }
      }

      $('#tabla_prestamos').DataTable(this.dtOptions_Prestamos);

      this.bCargado_Prestamos = true;
    }
  }

  ngOnInit(): void {
    this.prestamosServices.obtener_prestamos().subscribe(this.peticion_obtener_prestamos);
  }

  obtener_url_ficha_prestamo()
  {
    return this.URL_FICHA_PRESTAMO + this.prestamo_seleccionado;
  }

  peticion_baja_prestamo =
  {
    next: (respuesta: any) =>
    {
      this.prestamo_seleccionado = "";
      Swal.fire({
        title: 'Prestamo dado de baja',
        icon: 'success',
        showConfirmButton: true}).then((result) => {
          this.prestamosServices.obtener_prestamos().subscribe(this.peticion_obtener_prestamos);
        }
      );    
    },
    error: (respuesta: any) =>
    {
      Swal.fire({
        title: 'Error al dar de baja el prestamo',
        icon: 'error',
        showConfirmButton: true});
      }
  }

  dar_de_baja_prestamo()
  {
    Swal.fire({
      title: 'Dar de baja prestamo',
      text: '¿Estás seguro de dar de baja el prestamo?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Dar de baja',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.prestamosServices.dar_baja_prestamo(this.prestamo_seleccionado).subscribe(this.peticion_baja_prestamo);
      }
    });
  }
}
