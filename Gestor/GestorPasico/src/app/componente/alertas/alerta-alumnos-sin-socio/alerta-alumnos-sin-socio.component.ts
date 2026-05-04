import { Component, OnInit, signal } from '@angular/core';
import { AlertasService } from '../../../servicios/alertas.service';
import { DataTablesOptions, URL } from 'src/app/logica/constantes';

@Component({
  selector: 'app-alerta-alumnos-sin-socio',
  templateUrl: './alerta-alumnos-sin-socio.component.html',
  styleUrl: './alerta-alumnos-sin-socio.component.css',
  standalone: false,
})
export class AlertaAlumnosSinSocioComponent implements OnInit {
  constructor(private alertasService: AlertasService) {}
  enlaceFicha: string = URL.URL_FRONT_END + '/ficha_persona/';

  alumnosSinSocio = signal([]);
  alumnoSeleccionado: any;
  dtOptions_alumnosSinSocio: any = {};

  bCargadosAlumnos: boolean = false;

  peticion_alumnos_sin_socios = {
    next: (res: any) => {
      console.log(res);
      this.alumnosSinSocio.set(res.alumnos_sin_socio);
      var datatable = $('#tabla_personas').DataTable();
      datatable.destroy();

      this.dtOptions_alumnosSinSocio = {
        data: this.alumnosSinSocio(),
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
      $('#tabla_personas').DataTable(this.dtOptions_alumnosSinSocio);
      this.bCargadosAlumnos = true;
    },
    error: (err: any) => {
      console.log(err);
    },
  };

  ngOnInit(): void {
    this.alertasService
      .obtener_alumnos_sin_socios()
      .subscribe(this.peticion_alumnos_sin_socios);
  }

  obtenerUrlFicha() {
    return this.enlaceFicha + this.alumnoSeleccionado.nid;
  }
}
