import { Component, OnInit } from '@angular/core';
import { DataTablesOptions } from 'src/app/logica/constantes';
import { FichaAsistenciaService } from 'src/app/servicios/fichaasistencia.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-lista-fichas-asistencias',
  templateUrl: './lista-fichas-asistencias.component.html',
  styleUrls: ['./lista-fichas-asistencias.component.css']
})
export class ListaFichasAsistenciasComponent implements OnInit{

  lista_ficha_asistencias: any;
  bCargadas_fichas_asistencias: boolean = false;

  ficha_seleccionada: string = "";

  dtOptions_fichas_asistencias: any= {}

  URL_FICHA_ASISTENCIA = "/ficha_asistencia/";


  constructor(private fichaAsistenciaService: FichaAsistenciaService)
  {}

  click_ficha(ficha_marcada: any)
  {
    this.ficha_seleccionada = ficha_marcada['nid_ficha_asistencia'];
  }


  recuperar_ficha_asistencias =
  {
    next: (respuesta: any) =>
    {
      var datatable = $('#tabla_ficha_asistencias').DataTable();
      datatable.destroy();
      this.lista_ficha_asistencias = respuesta['fichas_asistencias'];

      this.dtOptions_fichas_asistencias =
      {
        language: DataTablesOptions.spanish_datatables,
        data: this.lista_ficha_asistencias,
        dom: 'Bfrtip',
        responsive: true,
        buttons: [{extend: 'excel', text: 'Generar Excel', className: 'btn btn-dark mb-3'}],
        columns:
        [
          {title: 'Ficha',
          data: 'etiqueta'
          }],
          rowCallback: (row: Node, data: any[] | Object, index: number) => {
            $('td', row).off('click');
            $('td', row).on('click', () => {
              this.click_ficha(data);
              $('#tabla_ficha_asistencias tr').removeClass('selected')
              $(row).addClass('selected');
            });
            return row;
            }
        }
        $('#tabla_ficha_asistencias').DataTable(this.dtOptions_fichas_asistencias);
      this.bCargadas_fichas_asistencias = true;
    }
  }

  ngOnInit(): void {
    this.fichaAsistenciaService.obtener_fichas_asistencias().subscribe(this.recuperar_ficha_asistencias);
  }

  obtener_url_ficha()
  {
    return this.URL_FICHA_ASISTENCIA + this.ficha_seleccionada;
  }

  peticion_cancelar_ficha_asistencia =
  {
    next: (respuesta: any) =>
    {
      Swal.fire({
        icon: 'success',
        title: 'Ficha eliminada',
        text: 'Se ha elimiando la ficha correctamente'
      }).then(
        () => { 
         window.location.reload(); }
       )
    },
    error: (respuesta: any) =>
    {
      Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Se ha producido un error',
            })
    }
  }

  cancelar_ficha_asistencia()
  {
    Swal.fire(
        {
          title: 'Eliminar ficha',
          text: 'Se eliminará la ficha completamente',
          confirmButtonText: 'Eliminar',
          showCancelButton: true
        }
      ).then(
        (results: any) =>
        {
          if(results.isConfirmed)
          {
            this.fichaAsistenciaService.cancelar_ficha_asistencia(this.ficha_seleccionada).subscribe(this.peticion_cancelar_ficha_asistencia);
          }
        }
      )
  }
}
