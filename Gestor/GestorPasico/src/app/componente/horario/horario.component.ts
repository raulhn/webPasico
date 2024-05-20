import { Component, Input, OnInit } from '@angular/core';
import { HorariosService } from 'src/app/servicios/horarios.service';

@Component({
  selector: 'app-horario',
  templateUrl: './horario.component.html',
  styleUrls: ['./horario.component.css']
})
export class HorarioComponent implements OnInit {

  @Input() nid_horario: string = ""

  constructor(private horariosServices: HorariosService)
  {
  }

  dias = [1, 2, 3, 4, 5, 6, 7];
  horas:Array<number> = [];
  minutos = [0, 15, 30, 45]

  horario:string[][] = [];

  horarios_recuperados: any;

  hora_minima: number = 0;
  hora_maxima: number = 0;

  horarios_recuperados_dia: any[] = [];

  bCargado_horario: boolean = false;

  recuperar_horario =
  {
    next: (respuesta: any) =>
      {
        for(let i = this.hora_minima; i < this.hora_maxima + 1; i++)
        {
          this.horas.push(i);
        }

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
          console.log(this.horarios_recuperados[i])
          this.horarios_recuperados_dia.push(this.horarios_recuperados[i]);
       }


       this.bCargado_horario = true;
      }
  }

  ngOnInit(): void {
    this.horariosServices.obtener_horario(this.nid_horario).subscribe(this.recuperar_horario)
  }

  obtener_valor(dia: number, hora: number, minutos:number)
  {
    
    let v_minutos_entrada = Number(minutos);
    let v_hora_entrada = Number(hora);

    let v_total_minutos_entrada = v_minutos_entrada + (v_hora_entrada * 60)

    for(let i=0; i < this.horarios_recuperados_dia[dia].length; i++)
    {

      let v_hora_inicio = Number(this.horarios_recuperados_dia[dia][i].hora_inicio);
      let v_minutos_inicio = Number(this.horarios_recuperados_dia[dia][i].minutos_inicio);

      let v_total_minutos_inicio = v_minutos_inicio + (v_hora_inicio * 60);

      let v_duracion = (Number(this.horarios_recuperados_dia[dia][i].duracion) / 60);

      let v_hora_fin = v_hora_inicio + (v_duracion / 60);
      let v_minutos_fin = (v_minutos_inicio + v_duracion) % 60;

      let v_total_minutos_fin = v_minutos_fin + (v_hora_fin * 60);

      if (v_total_minutos_entrada == v_total_minutos_inicio)
      {
        return v_duracion / 15;
      }
      else if (v_total_minutos_inicio < v_total_minutos_entrada &&
               v_total_minutos_fin >= v_total_minutos_entrada)
      {
        return 0; 
      }
    }
    return 1;
  }
}
