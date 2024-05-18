import { Component } from '@angular/core';

@Component({
  selector: 'app-horario',
  templateUrl: './horario.component.html',
  styleUrls: ['./horario.component.css']
})
export class HorarioComponent {

  horario:string[][] = [];

  horarios_recuperados: any;

  hora_minima: number = 0;
  hora_maxima: number = 0;

  recuperar_horario =
  {
    next: (respuesta: any) =>
      {
        this.horarios_recuperados = respuesta.horarios_clase;

        for(let i=0; i < this.horarios_recuperados.length; i++)
        {
          if(this.hora_minima == 0 || this.hora_minima > this.horarios_recuperados[i].hora_inicio)
          {
            this.hora_minima = this.horarios_recuperados[i].hora_inicio;
          }

          let hora_fin =  this.horarios_recuperados[i].hora_inicio + (this.horarios_recuperados[i].duracion_clase) / 60;
          if(this.hora_maxima == 0 || this.hora_maxima < hora_fin)
          {
            this.hora_maxima = hora_fin;
          }
       }
        console.log('Respuesta')
        console.log(respuesta)
      }
  }

}
