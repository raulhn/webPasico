import {
  Component,
  OnInit,
  WritableSignal,
  Signal,
  signal,
} from '@angular/core';
import { PreinscripcionesService } from 'src/app/servicios/preinscripciones.service';
import { DataTablesOptions } from 'src/app/logica/constantes';

@Component({
  selector: 'app-listado-preinscripciones',
  templateUrl: './listado-preinscripciones.component.html',
  styleUrls: ['./listado-preinscripciones.component.css'],
  standalone: false,
})
export class ListadoPreinscripcionesComponent implements OnInit {
  $listado_preinscripcion: WritableSignal<any[]> = signal([]);
  $listado_preinscripcion2: WritableSignal<any[]> = signal([]);
  $id_tabla_preinscripiones: WritableSignal<string> = signal(
    'tabla_preinscripciones',
  );
  $id_tabla_preinscripiones2: WritableSignal<string> = signal(
    'tabla_preinscripciones_2',
  );

  cabecera_preinscripcion: any[] = [
    { title: 'Nombre', data: 'nombre' },
    { title: 'Primer apellido', data: 'primer_apellido' },
    { title: 'Segundo apellido', data: 'segundo_apellido' },
    { title: 'DNI', data: 'dni' },
    {
      title: 'Fecha solicitud',
      data: 'fecha_solicitud',
    },
    {
      title: 'Fecha de nacimiento',
      data: 'fecha_nacimiento',
    },
    {
      title: 'Instrumento',
      data: 'instrumento',
    },
    { title: 'Nombre (Padre)', data: 'nombre_padre' },
    { title: 'Primer apellido (Padre)', data: 'primer_apellido_padre' },
    { title: 'Segundo apellido (Padre)', data: 'segundo_apellido_padre' },
    { title: 'DNI (Padre)', data: 'dni_padre' },
    { title: 'Teléfono', data: 'telefono' },
    {
      title: 'Correo electrónico',
      data: 'correo_electronico',
    },
  ];

  cabecera_preinscripcion2: any[] = [
    { title: 'Segundo Instrumento', data: 'instrumento2' },
    { title: 'Tercer Instrumento', data: 'instrumento3' },
    { title: 'Sucursal', data: 'nombre_sucursal' },
    { title: 'Horario', data: 'horario' },
    { title: 'Curso', data: 'nombre_curso' },
  ];

  dtOptions: any = {};
  dtOptions_2: any = {};

  bCargadoPreinscripciones: boolean = false;
  bCargadoPreinscripciones2: boolean = false;

  preinscripcion_seleccionada: any;

  constructor(private preinscripcionService: PreinscripcionesService) {}

  obtener_preinscripcions = {
    next: (respuesta: any) => {
      this.$listado_preinscripcion.set(respuesta.preinscripciones);
    },
  };
  ngOnInit(): void {
    this.preinscripcionService
      .obtener_preinscripciones()
      .subscribe(this.refrescar_personas);
  }

  refrescar_personas2 = {
    next: (respuesta: any) => {
      this.$listado_preinscripcion2.set(respuesta.preinscripciones);

      this.bCargadoPreinscripciones2 = true;
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
      this.$listado_preinscripcion.set(respuesta.preinscripciones);
      this.bCargadoPreinscripciones = true;
    },
  };
}
