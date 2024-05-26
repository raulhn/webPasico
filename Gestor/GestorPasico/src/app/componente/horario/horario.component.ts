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

  minutos_maximo: number = 0;

  horarios_recuperados_dia:any = {};

  bCargado_horario: boolean = false;

  horarios_asignados: any = {};


  recuperar_horario =
  {
    next: (respuesta: any) =>
      {

        this.horarios_recuperados = respuesta.horarios_clase;

        for(let i=0; i<8; i++)
        {
          this.horarios_recuperados_dia[i] = [];
          this.horarios_asignados[i] = [];
        }

        for(let i=0; i < this.horarios_recuperados.length; i++)
        {
          if(this.hora_minima == 0 || this.hora_minima > this.horarios_recuperados[i].hora_inicio)
          {
            this.hora_minima = this.horarios_recuperados[i].hora_inicio;
          }

          let hora_fin = ((Number(this.horarios_recuperados[i].hora_inicio) * 60) + Number(this.horarios_recuperados[i].minutos_inicio) + (Number(this.horarios_recuperados[i].duracion_clase))) / 60;
      
          let minutos_fin_ =  ((Number(this.horarios_recuperados[i].hora_inicio) * 60) + Number(this.horarios_recuperados[i].minutos_inicio) + (Number(this.horarios_recuperados[i].duracion_clase))) % 60;

          hora_fin = Math.trunc(hora_fin);

          if(this.hora_maxima == hora_fin)
          {
            this.hora_maxima = hora_fin;

            if(minutos_fin_ > 0)
            {
                this.hora_maxima = this.hora_maxima + 1;
            }
          }
          else if(this.hora_maxima == 0 || this.hora_maxima < hora_fin)
          {
            this.hora_maxima = hora_fin;
            if(minutos_fin_ > 0)
              {
                  this.hora_maxima = this.hora_maxima + 1;
              }
          }

          this.horarios_recuperados_dia[Number(this.horarios_recuperados[i].dia)].push(this.horarios_recuperados[i]);
       }

       for (let i = 0; i < respuesta.horarios_asignados.length; i++)
       {
          this.horarios_asignados[Number(respuesta.horarios_asignados[i].dia)].push(respuesta.horarios_asignados[i]);
       }

       for(let i = 0; i < ((this.hora_maxima - this.hora_minima) * 4) ; i++)
       {
          this.horas.push(i);
       }

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
        let v_total_minutos_fin = v_total_minutos_inicio + v_duracion;

        if (v_total_minutos_entrada == v_total_minutos_inicio)
        {
          return v_duracion / 15;
        }
        else if (v_total_minutos_inicio < v_total_minutos_entrada &&
                v_total_minutos_fin > v_total_minutos_entrada)
        {
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

  descripcion_clase(dia: number, hora: number)
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

        let v_total_minutos_fin = v_total_minutos_inicio + v_duracion;

        let v_hora_fin = Math.trunc(v_total_minutos_fin / 60) + this.hora_minima;
        let v_minutos_fin = v_total_minutos_fin % 60;

        let desc_minutos_fin;

        if (v_minutos_fin < 10)
        {
          desc_minutos_fin = '0' + v_minutos_fin;
        }
        else
        {
          desc_minutos_fin = v_minutos_fin;
        }

        let desc_minutos_inicio;

        if(v_minutos_inicio < 10)
        {
          desc_minutos_inicio = '0' + v_minutos_inicio;
        }
        else
        {
          desc_minutos_inicio = v_minutos_inicio;
        }

        if (v_total_minutos_entrada == v_total_minutos_inicio && this.es_asignado(dia, hora) == '')
        {
          return 'Clase libre ' + v_hora_inicio + ':' + desc_minutos_inicio + ' - ' + v_hora_fin + ':' + desc_minutos_fin; 
        }
        else if(v_total_minutos_entrada == v_total_minutos_inicio && this.es_asignado(dia, hora) != '')
        {
          return 'Clase asignada ' + v_hora_inicio + ':' + desc_minutos_inicio + ' - ' + v_hora_fin + ':' + desc_minutos_fin; 
        }
    }
    return '';
  }

  es_asignado(dia: number, hora: number)
  {
    let v_minutos_entrada = (Number(hora) % 4) * 15;
    let v_hora_entrada = Math.trunc(Number(hora) / 4);

    let v_total_minutos_entrada = v_minutos_entrada + (v_hora_entrada * 60)

    for (let i=0; i<this.horarios_asignados[dia].length; i++)
    {
        let v_hora_inicio = Number(this.horarios_recuperados_dia[dia][i].hora_inicio);
        let v_minutos_inicio = Number(this.horarios_recuperados_dia[dia][i].minutos_inicio);


        let v_total_minutos_inicio = v_minutos_inicio + Math.trunc((Math.abs((this.hora_minima - v_hora_inicio))) * 60);

      if (v_total_minutos_entrada == v_total_minutos_inicio)
      {
        return 'Asignada';
      }
    }
    
    return '';
  }
}
