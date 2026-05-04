import { Component, OnInit, signal } from '@angular/core';
import { AlertasService } from '../../../servicios/alertas.service';
import { DataTablesOptions, URL } from 'src/app/logica/constantes';
@Component({
  selector: 'app-alerta-alumnos-sin-profesor',
  templateUrl: './alerta-alumnos-sin-profesor.component.html',
  styleUrl: './alerta-alumnos-sin-profesor.component.css',
  standalone: false,
})
export class AlertaAlumnosSinProfesorComponent implements OnInit {
  constructor(private alertaService: AlertasService) {}
  enlaceFicha: string = URL.URL_FRONT_END + '/ficha_persona/';
  alumnoSeleccionado: any;
  dtOptions_alumnosSinProfesor: any = {};

  bCargadosAlumnos: boolean = false;

  alumnosSinProfesor = signal([]);
  peticion_alumnos_sin_profesor = {
    next: (res: any) => {
      console.log(res);
      this.alumnosSinProfesor.set(res.alumnos_sin_profesor);
      var datatable = $('#tabla_personas').DataTable();
      datatable.destroy();

      this.dtOptions_alumnosSinProfesor = {
        data: this.alumnosSinProfesor(),
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
      $('#tabla_personas').DataTable(this.dtOptions_alumnosSinProfesor);
      this.bCargadosAlumnos = true;
    },
    error: (err: any) => {
      console.log(err);
    },
  };

  ngOnInit(): void {
    this.alertaService
      .obtener_alumnos_sin_profesor()
      .subscribe(this.peticion_alumnos_sin_profesor);
  }

  obtenerUrlFicha() {
    return this.enlaceFicha + this.alumnoSeleccionado.nid;
  }
}
