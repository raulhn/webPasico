import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  WritableSignal,
  Signal,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CursosService } from 'src/app/servicios/cursos.service';
import { EvaluacionService } from 'src/app/servicios/evaluacion.service';
import { MatriculasService } from 'src/app/servicios/matriculas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ficha-matricula-profesor',
  templateUrl: './ficha-matricula-profesor.component.html',
  styleUrls: ['./ficha-matricula-profesor.component.css'],
  standalone: false,
})
export class FichaMatriculaProfesorComponent implements OnInit {
  nid_matricula: string = '';

  $lista_asignaturas: WritableSignal<any> = signal([]);
  $id_tabla_asignaturas: Signal<string> = signal('dataTableAsignaturas');
  cabecera_asignaturas: any[] = [
    { title: 'Asignatura', data: 'descripcion' },
    { title: 'Profesor', data: 'nombre_profesor' },
    { title: 'Fecha Alta', data: 'fecha_alta' },
    { title: 'Fecha_baja', data: 'fecha_baja' },
  ];

  bCargadasAsignaturas: boolean = false;

  matricula_asignatura_seleccionada: any;

  bCargadasEvaluciones: boolean = false;
  bCargadosTrimestres: boolean = false;

  lista_trimestres: any;
  trimestre_seleccionado: string = '';

  $evaluaciones: WritableSignal<any> = signal([]);
  $id_tabla_evaluaciones: Signal<string> = signal('tabla_evaluaciones');
  cabecera_evaluaciones: any[] = [
    { title: 'Trimestre', data: 'trimestre' },
    { title: 'Notas', data: 'nota' },
    { title: 'Progreso', data: 'progreso' },
    { title: 'Comentarios', data: 'comentario' },
  ];

  @ViewChild('instancia_sustituir') instancia_sustituir!: ElementRef;

  constructor(
    private matriculasService: MatriculasService,
    private rutaActiva: ActivatedRoute,
    private cursosService: CursosService,
    private evaluacionesService: EvaluacionService,
  ) {
    this.nid_matricula = rutaActiva.snapshot.params['nid_matricula'];
  }

  peticion_obtener_asignaturas = {
    next: (respuesta: any) => {
      this.$lista_asignaturas.set(respuesta.matriculas_asignaturas);
    },
  };

  peticion_obtener_evaluaciones = {
    next: (respuesta: any) => {
      this.$evaluaciones.set(respuesta.evaluaciones);
    },
  };

  recuperar_trimestres = {
    next: (respuesta: any) => {
      this.lista_trimestres = respuesta.trimestres;
      this.bCargadosTrimestres = true;
    },
  };

  descargarFichero(fichero: string) {
    const contenidoFichero = fichero;
    const blob = new Blob([contenidoFichero], { type: 'application/msword' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'boletin.doc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  peticion_generar_boletin = {
    next: (respuesta: any) => {
      let fichero = respuesta.fichero;
      this.descargarFichero(fichero);
      Swal.fire({
        icon: 'success',
        title: 'Boletín generado',
        text: 'Se ha generado el boletín',
      });
    },
    error: (respuesta: any) => {
      console.log(respuesta);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Se ha producido un error al generar el boletín',
      });
    },
  };

  ngOnInit(): void {
    this.matriculasService
      .obtener_asignatura_matriculas_rol_profesor(this.nid_matricula)
      .subscribe(this.peticion_obtener_asignaturas);
    this.evaluacionesService
      .obtener_evaluacion_matricula_asignatura_profesor(this.nid_matricula)
      .subscribe(this.peticion_obtener_evaluaciones);
    this.evaluacionesService
      .obtener_trimestres()
      .subscribe(this.recuperar_trimestres);
  }

  generar_boletin() {
    Swal.fire({
      title: 'Generar boletín',
      html: this.instancia_sustituir.nativeElement,
      confirmButtonText: 'Generar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        this.evaluacionesService
          .generar_boletin_profesor(
            this.nid_matricula,
            this.trimestre_seleccionado,
          )
          .subscribe(this.peticion_generar_boletin);
      }
    });
  }

  compareTrimestre(item: any, selected: any) {
    return item['nid_trimestre'] == selected;
  }
}
