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

        for(let i=0; i<8; i++)
        {
          this.horarios_recuperados_dia[i] = [];
        }

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
          this.horarios_recuperados_dia[Number(this.horarios_recuperados[i].dia)].push(this.horarios_recuperados[i]);
       }
       for(let i = 0; i < ((this.hora_maxima - this.hora_minima + 2) * 4) ; i++)
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
    let v_hora_entrada = Math.trunc(Number(hora) / 4);

    let v_total_minutos_entrada = v_minutos_entrada + (v_hora_entrada * 60)

    for (let i=0; i<this.horarios_recuperados_dia[dia].length; i++)
    {

        let v_hora_inicio = Number(this.horarios_recuperados_dia[dia][i].hora_inicio);
        let v_minutos_inicio = Number(this.horarios_recuperados_dia[dia][i].minutos_inicio);


        let v_total_minutos_inicio = v_minutos_inicio + Math.trunc((Math.abs((this.hora_minima - v_hora_inicio))) * 60);

        let v_duracion = (Number(this.horarios_recuperados_dia[dia][i].duracion_clase));

        let v_hora_fin = v_hora_inicio + (v_duracion / 60);
        let v_minutos_fin = (v_minutos_inicio + v_duracion) % 60;

        let v_total_minutos_fin = v_total_minutos_inicio + v_duracion;

        console.log('------')
        console.log(hora)
        console.log(v_hora_entrada + ':' + v_minutos_entrada)
        console.log(Math.abs((this.hora_minima - v_hora_inicio))+ ':' + v_minutos_inicio)

        console.log(v_total_minutos_entrada)
        console.log(v_total_minutos_inicio)
        console.log(v_total_minutos_fin)

        if (v_total_minutos_entrada == v_total_minutos_inicio)
        {
          console.log('Retorno' + (v_duracion / 15))
          return v_duracion / 15;
        }
        else if (v_total_minutos_inicio < v_total_minutos_entrada &&
                v_total_minutos_fin > v_total_minutos_entrada)
        {
          console.log('Retorno 0')
          return 0; 
        }
      }
    if(dia == 0 && v_minutos_entrada == 0)
    {
      return 4;
    }
    else if(dia == 0)
    {
      return 0;
    }
    return 1;
  }
}
