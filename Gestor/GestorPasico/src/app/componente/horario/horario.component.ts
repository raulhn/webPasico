import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { HorariosService } from 'src/app/servicios/horarios.service';
import { faFloppyDisk, faPen, faX} from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';
import { URL } from 'src/app/logica/constantes';

@Component({
  selector: 'app-horario',
  templateUrl: './horario.component.html',
  styleUrls: ['./horario.component.css']
})
export class HorarioComponent implements OnInit {

  @ViewChild('instancia_sustituir') instancia_sustituir!: ElementRef;

  faXmark = faX;
  faPen = faPen;

  nid_horario: string = "";

  formulario_dia: string = "";
  formulario_hora_inicio: string = "";
  formulario_hora_fin: string = "";
  duracion_clase: string = "";

  constructor(private horariosServices: HorariosService, private rutaActiva: ActivatedRoute)
  {
    this.nid_horario = rutaActiva.snapshot.params['nid_horario'];
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


  horarios: any = new Array(8);

  nid_asignatura: string ="";
  nid_profesor: string = "";

  enlaceHorario: string = URL.URL_FRONT_END + "/horario_clase/";


  recuperar_horario =
  {

    next: (respuesta: any) =>
      {
        this.horarios_recuperados = respuesta.horarios_clase;

        this.nid_asignatura = respuesta.horarios[0]['nid_asignatura'];
        this.nid_profesor = respuesta.horarios[0]['nid_profesor'];

        for(let i=0; i<8; i++)
        {
          this.horarios_recuperados_dia[i] = [];
          this.horarios[i] = {};
        }

        for(let i=0; i < this.horarios_recuperados.length; i++)
        {
          this.horarios[this.horarios_recuperados[i].dia][Number(this.horarios_recuperados[i].minutos_inicio) + (Number(this.horarios_recuperados[i].hora_inicio) * 60)] = this.horarios_recuperados[i];

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

    for (let i=0; i < this.horarios_recuperados_dia[dia].length; i++)
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

        if (v_total_minutos_entrada == v_total_minutos_inicio && this.obtener_nid_horario_clase(dia, hora) === null)
        {
          return 'Clase libre ' + v_hora_inicio + ':' + desc_minutos_inicio + ' - ' + v_hora_fin + ':' + desc_minutos_fin; 
        }
        else if(v_total_minutos_entrada == v_total_minutos_inicio && this.obtener_nid_horario_clase(dia, hora) !== null)
        {
          return 'Clase asignada ' + v_hora_inicio + ':' + desc_minutos_inicio + ' - ' + v_hora_fin + ':' + desc_minutos_fin; 
        }
    }
    return '';
  }


  obtener_nid_horario_clase(dia:number, hora:number)
  {
    let v_minutos_entrada = (Number(hora) % 4) * 15;
    let v_hora_entrada = Math.trunc(Number(hora) / 4) + this.hora_minima;

    let total_minutos = v_minutos_entrada + (v_hora_entrada * 60);

    if (this.horarios[dia][total_minutos] !== undefined)
    {
      return this.horarios[dia][total_minutos]['nid_horario_clase'];
    }
    return null;
  }

    


  respuesta_elimina_clase =
  {
    next: (respuesta: any) =>
    {
      Swal.fire({
        icon: 'success',
        title: 'Clase eliminada',
        text: 'Se ha eliminado la clase',
      }).then(() => {  window.location.reload();});
    },
    error: (respuesta: any) =>
    {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Se ha producido un error'
      })
    }
  }

  eliminar_clase(dia: number, hora: number)
  {
    Swal.fire({
      title: "Eliminar clase",
      text: "Se eliminará la clase seleccionada",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar"
    }).then(
      (results: any) =>
        {
        if(results.isConfirmed)
        {
          let nid_horario_clase = this.obtener_nid_horario_clase(dia, hora);
          var data = {nid_horario_clase: nid_horario_clase};
          this.horariosServices.eliminar_horario_clase(data).subscribe(this.respuesta_elimina_clase)
        }
      }
    )
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

   
  registrar_horario()
  {
    var horario_inicio_array = this.formulario_hora_inicio.split(':');
    var horario_fin_array = this.formulario_hora_fin.split(':');

    let peticion = {dia: this.formulario_dia, hora_inicio: horario_inicio_array[0], minutos_inicio: horario_inicio_array[1], hora_fin: horario_fin_array[0],
        minutos_fin: horario_fin_array[1], nid_asignatura: this.nid_asignatura, nid_profesor: this.nid_profesor, duracion_clase: this.duracion_clase
    }

    this.horariosServices.registrar_horario(peticion).subscribe(this.peticion_registrar_horario);
  }


  add_horario()
  {
    Swal.fire({
      title: 'Crear profesor',
      html: this.instancia_sustituir.nativeElement,
      confirmButtonText: 'Crear',
      showCancelButton: true,
    }).then(
      (results: any) =>
        {
        if(results.isConfirmed)
        {
          this.registrar_horario();
        }
      }
    )
  }

  obtenerUrlHorario(dia: number, hora: number)
  {
    return this.enlaceHorario + this.obtener_nid_horario_clase(dia, hora);
  }
}
