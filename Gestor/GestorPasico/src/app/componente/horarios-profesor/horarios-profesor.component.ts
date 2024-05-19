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
  horarios: any;

  nid_asignatura: string = "";

  bCargado_asignaturas: boolean = false;

  num_horarios: number = 0;

  formulario_dia: string = "";
  formulario_hora_inicio: string = "";

  formulario_hora_fin: string = "";

  duracion_clase: string = "";

  recuperar_asignaturas =
  {
    next: (respuesta: any) =>
      {
        this.asignaturas = respuesta.asignaturas;
      }
  }

  recuperar_horario =
  {
    next: (respuesta: any) =>
      {
        this.horarios = respuesta.horarios;
        this.num_horarios = this.horarios.length;
        console.log('Respuesta')
        console.log(respuesta)
      }
  }

  peticion_registrar_horario =
  {
    next: (respuesta: any) =>
      {
        console.log('Funciona')
      },
    error: (respuesta: any) =>
      {
        console.log('No funciona')
      }
  }


  constructor(private horariosService: HorariosService, private asignaturasService: AsignaturasService, private rutaActiva: ActivatedRoute)
  {
    this.nid_profesor = rutaActiva.snapshot.params['nid_profesor'];

    asignaturasService.obtener_asignaturas_profesor(this.nid_profesor).subscribe(this.recuperar_asignaturas);
    this.bCargado_asignaturas = true;
  }

  compare_asignatura(item: any, selected: any) {
    return item['nid'] == selected;
  }
  
  actualizar_asignatura()
  {
    this.horariosService.obtener_horarios(this.nid_profesor, this.nid_asignatura).subscribe(this.recuperar_horario)
  }

  registrar_horario()
  {
    var horario_inicio_array = this.formulario_hora_inicio.split(':');
    var horario_fin_array = this.formulario_hora_fin.split(':');

    let peticion = {dia: this.formulario_dia, hora_inicio: horario_inicio_array[0], minutos_inicio: horario_inicio_array[1], hora_fin: horario_fin_array[0],
        minutos_fin: horario_fin_array[1], nid_asignatura: this.nid_asignatura, nid_profesor: this.nid_profesor, duracion_clase: this.duracion_clase
    }

    this.horariosService.registrar_horario(peticion).subscribe(this.peticion_registrar_horario);
  }

}
