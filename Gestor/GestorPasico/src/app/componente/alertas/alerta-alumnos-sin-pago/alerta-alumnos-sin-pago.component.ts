import { Component, OnInit, signal } from '@angular/core';
import { AlertasService } from '../../../servicios/alertas.service';
import { DataTablesOptions, URL } from 'src/app/logica/constantes';

@Component({
  selector: 'app-alerta-alumnos-sin-pago',
  templateUrl: './alerta-alumnos-sin-pago.component.html',
  styleUrl: './alerta-alumnos-sin-pago.component.css',
  standalone: false,
})
export class AlertaAlumnosSinPagoComponent implements OnInit {
  alumnosSinPago = signal([]);
  alumnoSeleccionado: any;
  dtOptions_alumnosSinPago: any = {};

  bCargadosAlumnos: boolean = false;

  constructor(private alertasService: AlertasService) {}
  enlaceFicha: string = URL.URL_FRONT_END + '/ficha_persona/';

  peticion_alumnos_sin_pago = {
    next: (res: any) => {
      console.log(res);
      this.alumnosSinPago.set(res.alumnos_sin_pago);
      var datatable = $('#tabla_personas').DataTable();
      datatable.destroy();

      this.dtOptions_alumnosSinPago = {
        data: this.alumnosSinPago(),
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
            this.alumnoSeleccionado = data;
            $('#tabla_personas tr').removeClass('selected');
            $(row).addClass('selected');
          });
          return row;
        },
      };
      $('#tabla_personas').DataTable(this.dtOptions_alumnosSinPago);
      this.bCargadosAlumnos = true;
    },
    error: (err: any) => {
      console.log(err);
    },
  };

  ngOnInit(): void {
    this.alertasService
      .obtener_alumnos_sin_pago()
      .subscribe(this.peticion_alumnos_sin_pago);
  }

  obtenerUrlFicha() {
    return this.enlaceFicha + this.alumnoSeleccionado.nid;
  }
}
