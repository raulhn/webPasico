import { Component, OnInit, Input } from '@angular/core';
import { AsignaturasService } from 'src/app/servicios/asignaturas.service';
import { CursosService } from 'src/app/servicios/cursos.service';
import { MatriculasService } from 'src/app/servicios/matriculas.service';
import { PersonasService } from 'src/app/servicios/personas.service';

@Component({
  selector: 'app-registro-matricula',
  templateUrl: './registro-matricula.component.html',
  styleUrls: ['./registro-matricula.component.css']
})
export class RegistroMatriculaComponent implements OnInit{

  @Input() nid_asignatura: string ="";

  lista_personas: any[] = [];
  cursos: any[] = [];

  alumno: any;
  curso: any;

  constructor(private personasServices: PersonasService, private cursosServices: CursosService, private matriculasServices: MatriculasService)
  {}


  obtener_personas =
  {
    next: (respuesta: any) =>
    {
      this.lista_personas = respuesta.personas;
    }
  }

  obtener_cursos = 
  {
    next: (respuesta: any) =>
    {
      this.cursos = respuesta.cursos;
    }
  }

  ngOnInit(): void {
    this.personasServices.obtener_lista_personas().subscribe(this.obtener_personas);
    this.cursosServices.obtener_cursos().subscribe(this.obtener_cursos);
  }

  comparePersona_alumno(item: any, selected: any) {
    return item['nid'] == selected;
  }

  compareCursos(item: any, selected: any)
  {
    return item['nid'] == selected
  }

  registrar_alumno = 
  {
    next: (respuesta: any) =>
    {

    },
    error: (respuesta: any) =>
    {

    }
  }

  registrar()
  {
    this.matriculasServices.registrar_matricula(this.alumno, this.curso, this.nid_asignatura).subscribe(this.registrar_alumno)
  }
}
