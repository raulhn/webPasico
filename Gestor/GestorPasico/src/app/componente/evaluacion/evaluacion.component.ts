import { Component, OnInit } from '@angular/core';
import { AsignaturasService } from 'src/app/servicios/asignaturas.service';
import { CursosService } from 'src/app/servicios/cursos.service';
import { EvaluacionService } from 'src/app/servicios/evaluacion.service';
import { MatriculasService } from 'src/app/servicios/matriculas.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-evaluacion',
  templateUrl: './evaluacion.component.html',
  styleUrls: ['./evaluacion.component.css']
})
export class EvaluacionComponent implements OnInit{

  lista_asignaturas: any;
  asignatura_seleccionada: string = "";
  bCargada_asignaturas: boolean = false;

  lista_profesores: any;
  bCargados_profesores: boolean = false;
  profesor_seleccionado: string = "";



  lista_alumnos: any;

  lista_notas: any = {};
  lista_progreso: any = {};
  lista_matriculas: any = {};
  lista_comentarios: any = {};

  bCargados_alumnos: boolean = false;

  lista_trimestres: any;
  trimestre_seleccionado: any = "";
  bCargados_trimestres: boolean = false;

  constructor(private asignaturasService: AsignaturasService, private matriculasService: MatriculasService, 
              private cursosService: CursosService, private evaluacionesService: EvaluacionService)
  {

  }

  recuperar_trimestres =
  {
    next: (respuesta: any) =>
    {
      this.lista_trimestres = respuesta.trimestres;
      this.bCargados_trimestres = true;
    }
  }

  ngOnInit(): void {
    this.asignaturasService.obtener_asignaturas().subscribe(this.recupera_asignaturas);

    this.evaluacionesService.obtener_trimestres().subscribe(this.recuperar_trimestres);
  }


  recupera_profesores = 
  {
    next: (respuesta: any) =>
    {
      this.profesor_seleccionado = "";
      this.lista_profesores = respuesta.profesores;
      this.bCargados_profesores = true;
    }
  }


  recupera_asignaturas  =
  {
    next: (respuesta: any) =>
    {
      this.lista_asignaturas = respuesta.asignaturas;
      this.bCargada_asignaturas = true;
    }
  }


  recupera_evaluaciones = 
  {
    next: (respuesta: any) =>
    {
      let evaluaciones_matriculas = respuesta.evaluaciones_matriculas;

      for(let evaluacion_matricula of evaluaciones_matriculas)
      {
        let nid_alumno = evaluacion_matricula['nid_alumno'];

        this.lista_progreso[nid_alumno] = evaluacion_matricula['nid_tipo_progreso'];
        this.lista_comentarios[nid_alumno]  = evaluacion_matricula['comentario'];
        this.lista_notas[nid_alumno] = evaluacion_matricula['nota'];
      }

    }
  }

  recupera_alumnos = 
  {
    next: (respuesta: any) =>
    {
      this.lista_alumnos = respuesta.matriculas;

      this.bCargados_alumnos = true;

      for (let i = 0; i < this.lista_alumnos.length; i++)
      {
        this.lista_progreso[this.lista_alumnos[i]['nid']] = "0";
        this.lista_matriculas[this.lista_alumnos[i]['nid']] = this.lista_alumnos[i]['nid_matricula_asignatura'];
        this.lista_comentarios[this.lista_alumnos[i]['nid']] = "";
        this.lista_notas[this.lista_alumnos[i]['nid']] = "0";
      }
      this.evaluacionesService.obtener_evaluacion(this.trimestre_seleccionado, this.asignatura_seleccionada, this.profesor_seleccionado).subscribe(this.recupera_evaluaciones);
    }
    
  }
  
  cambia_asignatura()
  {
    this.asignaturasService.obtener_profesores_asignatura(this.asignatura_seleccionada).subscribe(this.recupera_profesores);
    this.bCargados_alumnos = false;
  }

  cambia_profesor()
  {

    delete this.lista_progreso;
    delete this.lista_comentarios;
    delete this.lista_notas;
    delete this.lista_matriculas;

    this.lista_notas = {};
    this.lista_progreso = {};
    this.lista_matriculas = {};
    this.lista_comentarios = {};


    this.matriculasService.obtener_matriculas_profesor(this.asignatura_seleccionada, this.profesor_seleccionado).subscribe(this.recupera_alumnos);

  }

  cambia_trimestre()
  {
    this.bCargados_alumnos = false;
    this.asignatura_seleccionada = "";
    this.profesor_seleccionado = "";
  }

  compare_asignatura(item: any, selected: any) {
    return item['nid'] == selected;
  }

  compare_profesor(item: any, selected: any) {
    return item['nid_persona'] == selected;
  }

  peticion_evaluacion =
  {
    next: (respuesta: any) =>
    {
      Swal.fire({
        icon: 'success',
        title: 'Evaluación registrada',
        text: 'Se ha registrado la evaluación'
      });
    },
    error: (respuesta: any) =>
    {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Se ha producido un error'
      })
    }
  }

  guardar()
  {
    this.evaluacionesService.registrar_evaluacion(this.trimestre_seleccionado, this.asignatura_seleccionada, this.profesor_seleccionado, JSON.stringify(this.lista_notas), JSON.stringify(this.lista_progreso), JSON.stringify(this.lista_matriculas),
                                                JSON.stringify(this.lista_comentarios)).subscribe(this.peticion_evaluacion);
  }
}
