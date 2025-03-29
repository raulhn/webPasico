import { Component, OnInit } from '@angular/core';
import { CancionesEuService } from 'src/app/servicios/canciones-eu.service';

@Component({
    selector: 'app-lista-ordenada',
    templateUrl: './lista-ordenada.component.html',
    styleUrls: ['./lista-ordenada.component.css'],
    standalone: false
})
export class ListaOrdenadaComponent implements OnInit {

  constructor(private cancionesService: CancionesEuService) { }

  tiempo_animacion_contador: number = 1;
  tiempo_animacion_traslado: number = 1;


  canciones: any;
  bCargadas_canciones: boolean = false;

  filas: number = 0;

  votaciones: any;

  orden_votaciones: any = {};
  votos: any = {};

  recupera_canciones = 
  {
    next:(respuesta: any) =>
    {
      let mitad = Math.trunc(respuesta.canciones.length / 2);
      let impar = respuesta.canciones.length % 2;

      this.filas = mitad + impar;

      // Se inicializa el array bidimensional
      this.canciones = [this.filas];
      for (let i=0; i< this.filas; i++)
      {
        this.canciones[i] = [2];
      }

      // Se asignan las canciones
      for (let i=0; i < respuesta.canciones.length; i++)
      {
        let columna_actual = Number(i % 2);
        let fila_actual = Number(Math.round(i % this.filas));
        this.canciones[fila_actual][columna_actual] = respuesta.canciones[i];
      }


      this.bCargadas_canciones = true;
    }
  }

  ngOnInit(): void {
    this.cancionesService.obtener_canciones().subscribe(this.recupera_canciones);
  }


  convertir_numero(value: string)
  {
    return Number.parseInt(value);
  }



   lanzar_contador(clase: string, votos: number)
  {

        const clase_contador = document.querySelectorAll("." + clase);

        // https://codepen.io/JasVidal/pen/yLrZapR //
        clase_contador.forEach((counter) => {
            if(counter)
            {
              const updateCounter = () => {
              var target = votos;
              var count = + Number(counter.innerHTML);
              var increment = target / 500;
              if (count < target) {
                counter.innerHTML = `${Math.ceil(count + increment)}`;
                setTimeout(updateCounter, 5);
              } 
              else {
                counter.innerHTML = target.toString()
              }
              ;
            };
            updateCounter();
          }
          });
}


  async ordenar_votos()
  {
    for(let i = 0; i < this.filas; i++)
    {
      for(let j = 0; j < 2; j++)
      {

        if (this.canciones[i][j] !== undefined)
        {
          let id_cancion_eu = this.canciones[i][j]['nid_cancion_eu'];

          let fila_nueva = Number(Math.trunc(Number(this.orden_votaciones[id_cancion_eu]) % this.filas));

          let columna_nueva = Math.trunc(this.orden_votaciones[id_cancion_eu] / this.filas)

          let nombre_clase = this.obtener_clase(id_cancion_eu)
          let nombre_clase_contador = this.obtener_clase_contador(id_cancion_eu);

          let clase = document.querySelector('.' + nombre_clase);


          let dif_columna = (columna_nueva - j) * 100;
          let dif_fila = (fila_nueva - i) * 100;
          this.lanzar_contador(nombre_clase_contador, Number(this.votos[id_cancion_eu]));

          let transformacion = "transform: translate(" + dif_columna + "%, "+  dif_fila + "%); transition-duration: " + this.tiempo_animacion_traslado +
                               "s; transition-timing-function: ease-in-out; transition-property: transform; transition-delay: "+ this.tiempo_animacion_contador + "s";

          clase?.setAttribute("style", transformacion);


        }
        
      }
    }
  }

  obtener_clase(nid_cancion: string)
  {
    return 'c_' + nid_cancion;
  }

  obtener_clase_contador(nid_cancion: string)
  {
    return 'counter_' + nid_cancion;
  }

  recupera_votaciones =
  {
    next: (respuesta: any) =>
    {
      this.votaciones = respuesta.votaciones;

      for (let i = 0; i < this.votaciones.length; i++)
      {
        this.orden_votaciones[this.votaciones[i]['nid_cancion_eu']] = i;
        this.votos[this.votaciones[i]['nid_cancion_eu']] = this.votaciones[i]['votos'];
      }

      this.ordenar_votos();

    }
  }

  actualizar_votos()
  {
    this.cancionesService.obtener_votaciones().subscribe(this.recupera_votaciones);

  }

}
