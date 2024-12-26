import { Component, OnInit } from '@angular/core';
import { AsignaturasService } from 'src/app/servicios/asignaturas.service';
import { CursosService } from 'src/app/servicios/cursos.service';
import { MatriculasService } from 'src/app/servicios/matriculas.service';

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

  nid_ultimo_curso: string = "";

  alumnos: any;

  constructor(private asignaturasService: AsignaturasService, private matriculasService: MatriculasService, private cusrsosService: CursosService)
  {

  }




  ngOnInit(): void {
    this.asignaturasService.obtener_asignaturas().subscribe(this.recupera_asignaturas);
    this.cusrsosService.obtener_nid_ultimo_curso().subscribe(this.recupera_nid_ultimo_curso);
  }

  recupera_nid_ultimo_curso =
  {
    next: (respuesta: any) =>
    {
      this.nid_ultimo_curso = respuesta.nid_ultimo_curso;
    }
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

  recupera_alumnos = 
  {
    next: (respuesta: any) =>
    {
      this.alumnos = respuesta.alumnos;
    }
  }
  
  cambia_asignatura()
  {
    this.asignaturasService.obtener_profesores_asingatura(this.asignatura_seleccionada).subscribe(this.recupera_profesores);
  }

  cambia_profesor()
  {
    this.matriculasService.obtener_alumnos_profesores(this.profesor_seleccionado, this.nid_ultimo_curso, this.asignatura_seleccionada, "1").subscribe(this.recupera_alumnos);
  }

  compare_asignatura(item: any, selected: any) {
    return item['nid'] == selected;
  }

  compare_profesor(item: any, selected: any) {
    return item['nid_persona'] == selected;
  }

}
