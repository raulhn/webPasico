import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AsignaturasService } from 'src/app/servicios/asignaturas.service';
import { HorariosService } from 'src/app/servicios/horarios.service';

@Component({
  selector: 'app-horarios-profesor',
  templateUrl: './horarios-profesor.component.html',
  styleUrls: ['./horarios-profesor.component.css']
})
export class HorariosProfesorComponent {

  nid_profesor: string = "";

  asignaturas: any;

  nid_asignatura: string = "";

  recuperar_asignaturas =
  {
    next: (respuesta: any) =>
      {
        this.asignaturas = respuesta.asignaturas;
      }
  }

  constructor(private horariosService: HorariosService, private asignaturasService: AsignaturasService, private rutaActiva: ActivatedRoute)
  {
    this.nid_profesor = rutaActiva.snapshot.params['nid_profesor'];

    asignaturasService.obtener_asignaturas_profesor(this.nid_profesor);
  }

  compare_asignatura(item: any, selected: any) {
    return item['nid'] == selected;
  }

}
