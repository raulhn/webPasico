import { Component, Input, EventEmitter, Output, input, effect, signal, WritableSignal } from '@angular/core';
import { Constantes } from '../../logica/constantes';

@Component({
  selector: 'app-datatable',
  templateUrl: './datatable.component.html',
  styleUrl: './datatable.component.css',
  standalone: false,
})
export class DatatableComponent {
  @Input() id = '';

  $lista = input();
  $cabeceras = input();

  $dtOptions: WritableSignal<any> = signal({});

  @Output() rowSelected = new EventEmitter<any>();
  id_tr = '#' + this.id + ' tr';

  constructor() {
    effect(() => {
      console.log("Listado", this.$lista());
      this.$dtOptions.set({
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
            $(this.id_tr).removeClass('selected');
            $(row).addClass('selected');
          });

          return row;
        }
      }
      )
    })
  }
}
