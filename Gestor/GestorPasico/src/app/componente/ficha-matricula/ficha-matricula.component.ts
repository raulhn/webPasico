import { Component, OnInit } from '@angular/core';
import { MatriculasService } from 'src/app/servicios/matriculas.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ficha-matricula',
  templateUrl: './ficha-matricula.component.html',
  styleUrls: ['./ficha-matricula.component.css']
})
export class FichaMatriculaComponent implements OnInit{

  nid_matricula: string = "";

  asignaturas: any;
  bCargado: boolean = false;

  constructor(private rutaActiva: ActivatedRoute, private matriculaService: MatriculasService)
  {
    this.nid_matricula = rutaActiva.snapshot.params['nid_matricula'];
  }

  obtener_matriculas =
  {
    next: (respuesta: any) =>
    {
      this.asignaturas = respuesta['asignaturas'];
      this.bCargado = true;
    }
  }  

  ngOnInit(): void {
    this.matriculaService.obtener_asignaturas_matriculas(this.nid_matricula).subscribe(this.obtener_matriculas);
  }
}
