import {
  Component,
  OnInit,
  signal,
  effect,
  WritableSignal,
  Signal,
} from '@angular/core';
import { ServicioPreinscripcionService } from 'src/app/servicios/servicio-preinscripcion.service';
import { Constantes } from '../logica/constantes';

@Component({
  selector: 'app-listado-preinscripciones',
  templateUrl: './listado-preinscripciones.component.html',
  styleUrls: ['./listado-preinscripciones.component.css'],
  standalone: false,
})
export class ListadoPreinscripcionesComponent implements OnInit {
  $lista_preinscripcion: WritableSignal<any[]> = signal([]);
  $lista_preinscripcion2: WritableSignal<any[]> = signal([]);

  dtOptions: any = {};
  dtOptions_2: any = {};
  dtOptions_3: any = {};

  bCargadoPreinscripciones: boolean = false;
  bCargadoPreinscripciones2: boolean = false;

  preinscripcion_seleccionada: any;

  $id_tabla_preinscripciones: Signal<String> = signal('tabla_preinscripciones');
  $id_tabla_preinscripciones2: Signal<String> = signal(
    'tabla_preinscripciones2',
  );
  $id_tabla_preinscripciones3: Signal<String> = signal(
    'tabla_preinscripciones3',
  );

  cabeceras2 = [
    {
      title: 'Primer Instrumento',
      data: 'instrumento',
    },

    { title: 'Segundo Instrumento', data: 'instrumento2' },
    { title: 'Tercer Instrumento', data: 'instrumento3' },
    { title: 'Sucursal', data: 'nombre_sucursal' },
    { title: 'Horario', data: 'horario' },
  ];

  cabeceras3 = [
    { title: 'Nombre (Padre)', data: 'nombre_padre' },
    { title: 'Primer apellido (Padre)', data: 'primer_apellido_padre' },
    { title: 'Segundo apellido (Padre)', data: 'segundo_apellido_padre' },
    { title: 'DNI (Padre)', data: 'dni_padre' },
    { title: 'Sucursal', data: 'nombre_sucursal' },
    { title: 'Curso', data: 'nombre_curso' },
  ];

  cabeceras = [
    { title: 'Nombre', data: 'nombre' },
    { title: 'Primer apellido', data: 'primer_apellido' },
    { title: 'Segundo apellido', data: 'segundo_apellido' },
    { title: 'DNI', data: 'dni' },
    { title: 'Tipo Preinscripción', data: 'tipo_matricula' },
    {
      title: 'Fecha solicitud',
      data: 'fecha_solicitud',
    },
    {
      title: 'Fecha de nacimiento',
      data: 'fecha_nacimiento',
    },

    { title: 'Teléfono', data: 'telefono' },
    {
      title: 'Correo electrónico',
      data: 'correo_electronico',
    },
  ];

  constructor(private preinscripcionService: ServicioPreinscripcionService) {
    effect(() => {
      console.log(this.$lista_preinscripcion());
    });
  }

  obtener_preinscripcions = {
    next: (respuesta: any) => {
      this.$lista_preinscripcion.set(respuesta.preinscripciones);
    },
  };
  ngOnInit(): void {
    this.preinscripcionService
      .obtener_preinscripciones()
      .subscribe(this.refrescar_personas);
  }
  refrescar_personas2 = {
    next: (respuesta: any) => {
      this.$lista_preinscripcion2.set(respuesta.preinscripciones);
    },
  };

  preinscripcion_marcada(data: any) {
    this.preinscripcion_seleccionada = data;
    this.preinscripcionService
      .obtener_preinscripciones_detalle(
        this.preinscripcion_seleccionada.nid_preinscripcion,
      )
      .subscribe(this.refrescar_personas2);
  }

  refrescar_personas = {
    next: (respuesta: any) => {
      var datatable = $('#tabla_preinscripciones').DataTable();
      datatable.destroy();
      this.$lista_preinscripcion.set(respuesta.preinscripciones);

      this.dtOptions = {
        language: Constantes.DataTablesOptions.spanish_datatables,
        data: this.$lista_preinscripcion,
        dom: 'Bfrtip',
        buttons: [
          {
            extend: 'excel',
            text: 'Generar Excel',
            className: 'btn btn-dark mb-3',
          },
        ],
        columns: [
          { title: 'Nombre', data: 'nombre' },
          { title: 'Primer apellido', data: 'primer_apellido' },
          { title: 'Segundo apellido', data: 'segundo_apellido' },
          { title: 'DNI', data: 'dni' },
          { title: 'Tipo Preinscripción', data: 'tipo_matricula' },
          {
            title: 'Fecha solicitud',
            data: 'fecha_solicitud',
          },
          {
            title: 'Fecha de nacimiento',
            data: 'fecha_nacimiento',
          },

          { title: 'Teléfono', data: 'telefono' },
          {
            title: 'Correo electrónico',
            data: 'correo_electronico',
          },
        ],
        rowCallback: (row: Node, data: any[] | Object, index: number) => {
          $('td', row).off('click');
          $('td', row).on('click', () => {
            $('#tabla_preinscripciones tr').removeClass('selected');
            $(row).addClass('selected');
            this.preinscripcion_marcada(data);
          });

          return row;
        },
      };
      $('#tabla_preinscripciones').DataTable(this.dtOptions);

      this.bCargadoPreinscripciones = true;
    },
  };
}
