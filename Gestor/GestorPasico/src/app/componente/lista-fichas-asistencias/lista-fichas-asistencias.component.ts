import { Component, OnInit } from '@angular/core';
import { DataTablesOptions } from 'src/app/logica/constantes';
import { FichaAsistenciaService } from 'src/app/servicios/fichaasistencia.service';

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


  constructor(private fichaAsistenciaService: FichaAsistenciaService)
  {}

  click_ficha(ficha_marcada: any)
  {
    this.ficha_seleccionada = ficha_marcada;
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
}
