import {
  Component,
  Input,
  EventEmitter,
  Output,
  input,
  effect,
  signal,
  WritableSignal,
} from '@angular/core';
import { Constantes } from '../../logica/constantes';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrl: './datatable.component.css',
  standalone: false,
})
export class DatatableComponent {
  $lista = input();
  $cabeceras = input();
  $identificador = input();

  dtOptions: any = {};


  @Output() rowSelected = new EventEmitter<any>();
  constructor() {
    effect(() => {
      let id_tr: string = '#' + this.$identificador() + ' tr';

      this.dtOptions = {
        language: Constantes.DataTablesOptions.spanish_datatables,
        data: this.$lista(),
        dom: 'Bfrtip',
        buttons: [
          {
            extend: 'excel',
            text: 'Generar Excel',
            className: 'btn btn-dark mb-3',
          },
        ],
        columns: this.$cabeceras(),

        rowCallback: (row: Node, data: any[] | Object, index: number) => {
          $('td', row).off('click');
          $('td', row).on('click', () => {
            $(id_tr).removeClass('selected');
            $(row).addClass('selected');
            this.rowSelected.emit(data)
          });

          return row;
        },
      };
    });

    effect(() => {
      let id_tabla: string = "#" + String(this.$identificador());

      var datatable = $(id_tabla).DataTable();
      datatable.destroy();
      console.log("Efecto", id_tabla)
      console.log("Lista", this.$lista())
      console.log("Cabeceras", this.$cabeceras())
      console.log("Opciones", this.dtOptions)
      console.log("Id tabla", id_tabla)
      $(id_tabla).DataTable(this.dtOptions);
    })
  }
}


