import { Component, OnInit, Input } from '@angular/core';
import { MatriculasService } from 'src/app/servicios/matriculas.service';

@Component({
  selector: 'app-matriculas-alumno',
  templateUrl: './matriculas-alumno.component.html',
  styleUrls: ['./matriculas-alumno.component.css']
})
export class MatriculasAlumnoComponent implements OnInit {

  matriculas: any[] = [];
  bCargado: boolean = false;

  constructor(private matriculasService: MatriculasService)
  {}

  @Input() nid_alumno: string =""

  recuperar_matriculas =
  {
    next: (respuesta: any) =>
    {
      this.matriculas = respuesta['matriculas'];
      this.bCargado = true;
    }
  }

  ngOnInit(): void {
    this.matriculasService.obtener_matriculas_alumno(this.nid_alumno).subscribe(this.recuperar_matriculas);
  }

  obtener_url(nid_matricula: string)
  {
    return '/ficha_matricula/' + nid_matricula;
  }
}
