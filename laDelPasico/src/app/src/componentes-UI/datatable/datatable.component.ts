import { Component, Input } from '@angular/core';
import { Constantes } from '../../logica/constantes';

@Component({
  selector: 'app-datatable',
  imports: [],
  templateUrl: './datatable.component.html',
  styleUrl: './datatable.component.css',
})
export class DatatableComponent {
  @Input() lista: any[] = [];
  @Input() cabeceras: string[] = [];
  @Input() id = '';

  titulos = Object.keys(this.lista);

  titulos_tabla = this.cabeceras.map((titulo, index) => {
    return { title: this.cabeceras[index], data: titulo };
  });

  id_tr = '#' + this.id + ' tr';

  dtOptions: any = {
    language: Constantes.DataTablesOptions.spanish_datatables,
    data: this.lista,
    dom: 'Bfrtip',
    buttons: [
      {
        extend: 'excel',
        text: 'Generar Excel',
        className: 'btn btn-dark mb-3',
      },
    ],
    columns: this.titulos_tabla,

    rowCallback: (row: Node, data: any[] | Object, index: number) => {
      $('td', row).off('click');
      $('td', row).on('click', () => {
        $(this.id_tr).removeClass('selected');
        $(row).addClass('selected');
      });

      return row;
    },
  };
}
