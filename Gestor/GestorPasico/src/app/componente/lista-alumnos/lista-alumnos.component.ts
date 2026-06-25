import {
  Component,
  OnInit,
  WritableSignal,
  Signal,
  signal,
} from '@angular/core';
import { nextSortDir } from '@swimlane/ngx-datatable';
import { AsignaturasService } from 'src/app/servicios/asignaturas.service';
import { CursosService } from 'src/app/servicios/cursos.service';
import { PersonasService } from 'src/app/servicios/personas.service';
import { DataTablesOptions, URL } from 'src/app/logica/constantes';

@Component({
  selector: 'app-lista-alumnos',
  templateUrl: './lista-alumnos.component.html',
  styleUrls: ['./lista-alumnos.component.css'],
  standalone: false,
})
export class ListaAlumnosComponent implements OnInit {
  enlaceFicha: string = URL.URL_FRONT_END + '/ficha_matricula_profesor/';

  lista_cursos: any;
  lista_asignaturas: any;

  $lista_personas: WritableSignal<any[]> = signal([]);
  $id_tabla_personas: Signal<string> = signal('tabla_personas');
  cabecera_personas: any[] = [
    { title: 'Nombre', data: 'nombre' },
    { title: 'Primer Apellido', data: 'primer_apellido' },
    { title: 'Segundo Apellido', data: 'segundo_apellido' },
    { title: 'Email', data: 'correo_electronico' },
    { title: 'Teléfono', data: 'telefono' },
  ];

  bCargadoCursos: boolean = false;
  bCargadasAsignaturas: boolean = false;
  bObtenidoUltimoCurso: boolean = false;

  curso_seleccionado: string = '';
  asignatura_seleccionada: string = '0';
  alumno_activo: string = '1';

  persona_seleccionada: any;

  constructor(
    private cursoService: CursosService,
    private personasService: PersonasService,
    private asignaturasService: AsignaturasService,
    private cursosService: CursosService,
  ) {}

  peticion_obtener_cursos = {
    next: (respuesta: any) => {
      this.lista_cursos = respuesta.cursos;
      this.bCargadoCursos = true;
    },
  };

  peticion_obtener_asignaturas = {
    next: (respuesta: any) => {
      this.lista_asignaturas = respuesta.asignaturas;
      this.bCargadasAsignaturas = true;
    },
  };

  ngOnInit(): void {
    this.cursosService
      .obtener_nid_ultimo_curso()
      .subscribe(this.peticion_obtener_ultimo_curso);
    this.cursoService.obtener_cursos().subscribe(this.peticion_obtener_cursos);
    this.asignaturasService
      .obtener_asignaturas_rol_profesor()
      .subscribe(this.peticion_obtener_asignaturas);
  }

  click_persona(data: any) {
    this.persona_seleccionada = data;
  }

  peticion_obtener_personas = {
    next: (respuesta: any) => {
      this.$lista_personas.set(respuesta.alumnos);
    },
  };

  peticion_obtener_ultimo_curso = {
    next: (respuesta: any) => {
      this.curso_seleccionado = respuesta['nid_ultimo_curso'];
      this.bObtenidoUltimoCurso = true;
      this.cambia_seleccion_curso();
    },
  };

  cambia_seleccion_curso() {
    this.personasService
      .obtener_alumnos_rol_profesor(
        this.asignatura_seleccionada,
        this.alumno_activo,
        this.curso_seleccionado,
      )
      .subscribe(this.peticion_obtener_personas);
  }

  obtenerUrlFicha() {
    return this.enlaceFicha + this.persona_seleccionada.nid_matricula;
  }
}
