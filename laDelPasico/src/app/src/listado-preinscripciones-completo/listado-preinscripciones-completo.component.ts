import {
  Component,
  OnInit,
  WritableSignal,
  signal,
  Signal,
} from '@angular/core';
import { ServicioPreinscripcionService } from 'src/app/servicios/servicio-preinscripcion.service';
import { Constantes } from '../logica/constantes';

@Component({
  selector: 'app-listado-preinscripciones-completo',
  templateUrl: './listado-preinscripciones-completo.component.html',
  styleUrls: ['./listado-preinscripciones-completo.component.css'],
  standalone: false,
})
export class ListadoPreinscripcionesCompletoComponent implements OnInit {
  $lista_preinscripcion: WritableSignal<any[]> = signal([]);
  preinscripcion_seleccionada: any = {};
  $id_tabla_preinscripciones: Signal<String> = signal('tabla_preinscripciones');

  cabeceras = [
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

    { title: 'Teléfono', data: 'telefono' },
    {
      title: 'Correo electrónico',
      data: 'correo_electronico',
    },
    { title: 'Tipo Preinscripción', data: 'tipo_matricula' },
    { title: 'Nombre (Padre)', data: 'nombre_padre' },
    { title: 'Primer apellido (Padre)', data: 'primer_apellido_padre' },
    { title: 'Segundo apellido (Padre)', data: 'segundo_apellido_padre' },
    { title: 'DNI (Padre)', data: 'dni_padre' },
    {
      title: 'Primer Instrumento',
      data: 'instrumento',
    },

    { title: 'Segundo Instrumento', data: 'instrumento2' },
    { title: 'Tercer Instrumento', data: 'instrumento3' },
    { title: 'Sucursal', data: 'nombre_sucursal' },
    { title: 'Horario', data: 'horario' },
    { title: 'Curso', data: 'nombre_curso' },
  ];

  constructor(private preinscripcionService: ServicioPreinscripcionService) {}

  ngOnInit(): void {
    this.preinscripcionService
      .obtener_preinscripciones()
      .subscribe(this.refrescar_personas);
  }

  preinscripcion_marcada(data: any) {
    this.preinscripcion_seleccionada = data;
  }

  refrescar_personas = {
    next: (respuesta: any) => {
      this.$lista_preinscripcion.set(respuesta.preinscripciones);
    },
  };
}
