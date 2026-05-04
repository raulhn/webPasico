import { Component, OnInit, signal } from '@angular/core';
import { AlertasService } from '../../../servicios/alertas.service';
import { DataTablesOptions, URL } from 'src/app/logica/constantes';

@Component({
  selector: 'app-alerta-socios-sin-pago',
  templateUrl: './alerta-socios-sin-pago.component.html',
  styleUrl: './alerta-socios-sin-pago.component.css',
  standalone: false,
})
export class AlertaSociosSinPagoComponent implements OnInit {
  enlaceFicha: string = URL.URL_FRONT_END + '/ficha_persona/';

  sociosSinPago = signal([]);
  socioSeleccionado: any;
  dtOptions_socioSinPago: any = {};

  bCargadosSocios: boolean = false;

  constructor(private alertasService: AlertasService) { }

  peticion_socios_sin_pago = {
    next: (res: any) => {
      console.log(res);
      this.sociosSinPago.set(res.socios_sin_forma_pago);
      var datatable = $('#tabla_personas').DataTable();
      datatable.destroy();

      this.dtOptions_socioSinPago = {
        data: this.sociosSinPago(),
        columns: [
          { title: 'Nombre', data: 'nombre' },
          { title: 'Primer Apellido', data: 'primer_apellido' },
          { title: 'Segundo Apellido', data: 'segundo_apellido' },
          { title: 'Email', data: 'correo_electronico' },
          { title: 'Teléfono', data: 'telefono' },
        ],
        language: DataTablesOptions.spanish_datatables,
        dom: 'Bfrtip',
        buttons: [
          {
            extend: 'excel',
            text: 'Generar Excel',
            className: 'btn btn-dark mb-3',
          },
        ],
        rowCallback: (row: Node, data: any[] | Object, index: number) => {
          $('td', row).off('click');
          $('td', row).on('click', () => {
            this.socioSeleccionado = data;
            $('#tabla_personas tr').removeClass('selected');
            $(row).addClass('selected');
          });
          return row;
        },
      };
      $('#tabla_personas').DataTable(this.dtOptions_socioSinPago);
      this.bCargadosSocios = true;
    },
    error: (err: any) => {
      console.log(err);
    },
  };

  ngOnInit(): void {
    this.alertasService
      .obtener_socios_sin_pago()
      .subscribe(this.peticion_socios_sin_pago);
  }

  obtenerUrlFicha() {
    return this.enlaceFicha + this.socioSeleccionado.nid;
  }
}
