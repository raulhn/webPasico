import { Component, OnInit, Input } from '@angular/core';
import { CursosService } from 'src/app/servicios/cursos.service';

@Component({
  selector: 'app-cursos-profesor',
  templateUrl: './cursos-profesor.component.html',
  styleUrls: ['./cursos-profesor.component.css']
})
export class CursosProfesorComponent implements OnInit {

  lista_cursos: any[] = [];
  bCargado: boolean = false;

  @Input() nid_profesor: string = "";

  constructor(private cursosService: CursosService)
  {

  }

  recuperar_cursos =
  {
    next: (respuesta: any) =>
    {
      this.lista_cursos = respuesta.cursos;
      this.bCargado = true;
    }
  }

  ngOnInit(): void {
    this.cursosService.obtener_cursos_profesor(this.nid_profesor).subscribe(this.recuperar_cursos)
  }

  obtiene_url_ficha()
  {
    return '/ficha_profesor/' + this.nid_profesor;
  }
}
