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

  dias = [0, 1, 2, 3, 4, 5, 6, 7];
  horas:Array<number> = [];
  minutos = [0, 15, 30, 45]

  horario:string[][] = [];

  horarios_recuperados: any;

  hora_minima: number = 0;
  hora_maxima: number = 0;

  horarios_recuperados_dia:any = {};

  bCargado_horario: boolean = false;

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

          let hora_fin = Number(this.horarios_recuperados[i].hora_inicio) + (Number(this.horarios_recuperados[i].duracion_clase) / 60);
          hora_fin = Math.trunc(hora_fin);

          if(this.hora_maxima == 0 || this.hora_maxima < hora_fin)
          {
            this.hora_maxima = hora_fin;
          }
          console.log('Dia')
          console.log(Number(this.horarios_recuperados[i].dia))
          this.horarios_recuperados_dia[Number(this.horarios_recuperados[i].dia)] = this.horarios_recuperados[i];
       }
       console.log('comparacion')
       console.log(this.hora_maxima)
       console.log(this.hora_minima)
       for(let i = 0; i < ((this.hora_maxima - this.hora_minima) * 4) + 1; i++)
        {
          this.horas.push(i);
        }

        console.log(this.horas)
       this.bCargado_horario = true;
      }
  }

  ngOnInit(): void {
    this.horariosServices.obtener_horario(this.nid_horario).subscribe(this.recuperar_horario)
  }

  obtener_valor(dia: number, hora: number)
  {
    
    let v_minutos_entrada = (Number(hora) % 4) * 15;
    let v_hora_entrada = Number(hora) / 4;

    let v_total_minutos_entrada = v_minutos_entrada + (v_hora_entrada * 60)


      if (typeof this.horarios_recuperados_dia[dia] !== 'undefined')
      {
        let v_hora_inicio = Number(this.horarios_recuperados_dia[dia].hora_inicio);
        let v_minutos_inicio = Number(this.horarios_recuperados_dia[dia].minutos_inicio);

        let v_total_minutos_inicio = v_minutos_inicio + (v_hora_inicio * 60);

        let v_duracion = (Number(this.horarios_recuperados_dia[dia].duracion) / 60);

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
      else
      {
        return 1;
      }
    
    return 1;
  }
}
