import {
  Component,
  OnInit,
  WritableSignal,
  signal,
  Signal,
} from '@angular/core';
import { CursosService } from 'src/app/servicios/cursos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-curso',
  templateUrl: './registro-curso.component.html',
  styleUrls: ['./registro-curso.component.css'],
  standalone: false,
})
export class RegistroCursoComponent implements OnInit {
  $cursos: WritableSignal<any[]> = signal([]);
  $id_tabla_cursos: Signal<string> = signal('tabla_cursos');
  cabecera_cursos: any[] = [
    { title: 'Curso', data: 'descripcion' },
    { title: 'Seleccionado', data: 'seleccionado' },
  ];

  nuevo_curso: string = '';

  bCargado: boolean = false;
  curso_seleccionado: any;

  constructor(private cursosService: CursosService) {}

  recuperar_cursos = {
    next: (respuesta: any) => {
      this.$cursos.set(respuesta.cursos);
    },
  };

  ngOnInit(): void {
    this.cursosService.obtener_cursos().subscribe(this.recuperar_cursos);
  }

  refrescar_cursos = {
    next: (respuesta: any) => {
      this.$cursos.set(respuesta.cursos);
    },
  };

  registrar_curso = {
    next: (respuesta: any) => {
      Swal.fire({
        icon: 'success',
        title: 'Registro correcto',
        text: 'Se ha registrado correctamente',
      });
      this.cursosService.obtener_cursos().subscribe(this.refrescar_cursos);
    },
    error: (respuesta: any) => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Se ha producido un error',
      });
    },
  };

  addCurso() {
    //https://sweetalert2.github.io/
    Swal.fire({
      title: 'Crear asignatura',
      html: `<input type="text" id="nombre_curso" class="swal2-input" placeholder="Username">
             `,
      confirmButtonText: 'Crear',
      showCancelButton: true,
      preConfirm: () => {
        this.nuevo_curso = (<HTMLInputElement>(
          document.getElementById('nombre_curso')
        )).value;
      },
    }).then((results: any) => {
      if (results.isConfirmed) {
        this.cursosService
          .registrar_curso(this.nuevo_curso)
          .subscribe(this.registrar_curso);
      }
    });
  }

  click_curso(curso_marcado: any) {
    this.curso_seleccionado = curso_marcado;
  }

  activar_curso() {
    this.cursosService
      .activar_curso(this.curso_seleccionado.nid_curso)
      .subscribe({
        next: (respuesta: any) => {
          Swal.fire({
            icon: 'success',
            title: 'Curso activado',
            text: 'Se ha activado correctamente',
          });
          this.cursosService.obtener_cursos().subscribe(this.refrescar_cursos);
        },
        error: (respuesta: any) => {
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Se ha producido un error',
          });
        },
      });
  }
}
