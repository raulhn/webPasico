import { Component, OnInit } from '@angular/core';
import { CancionesEuService } from 'src/app/servicios/canciones-eu.service';

@Component({
  selector: 'app-lista-ordenada',
  templateUrl: './lista-ordenada.component.html',
  styleUrls: ['./lista-ordenada.component.css']
})
export class ListaOrdenadaComponent implements OnInit {

  constructor(private cancionesService: CancionesEuService) { }

  canciones: any;
  bCargadas_canciones: boolean = false;

  filas: number = 0;

  votaciones: any;

  orden_votaciones: any = {};

  recupera_canciones = 
  {
    next:(respuesta: any) =>
    {
      let mitad = respuesta.canciones.length / 2;
      let impar = respuesta.canciones.length % 2;

      this.filas = mitad + impar + 1;

      // Se inicializa el array bidimensional
      this.canciones = [this.filas];
      for (let i=0; i< this.filas; i++)
      {
        this.canciones[i] = [2];
      }

      // Se asignan las canciones
      for (let i=0; i < respuesta.canciones.length; i++)
      {
        let fila_actual = Number(i % 2);
        let columna_actual = Number(Math.round(i / this.filas));
        console.log('[' + fila_actual + ']' + '[' +  columna_actual + ']')
        this.canciones[fila_actual][columna_actual] = respuesta.canciones[i];
      }

      console.log(this.canciones);
      console.log(this.canciones[0]);
      this.bCargadas_canciones = true;
    }
  }

  ngOnInit(): void {
    this.cancionesService.obtener_canciones().subscribe(this.recupera_canciones);
  }

  add()
  {
    let desplazamiento = [{transform: "translate(0, 100%)"}, {easing: "ease-in-out"}]
    let duracion = {duration: 1000}

    $('#Beech').addClass('pushdown');
    let comefromtop = document.querySelector(".comefromtop");
    comefromtop?.setAttribute("style", "transform: translate(0, -100%); transition-duration: 1s; transition-timing-function: ease-in-out; transition-property: transform;");

  }

  add_2()
  {
    $('#Beech').addClass('pushdown');
    let comefromtop = document.querySelector(".comefromtop");
    comefromtop?.setAttribute("style", "transform: translate(0, -200%); transition-duration: 1s; transition-timing-function: ease-in-out; transition-property: transform;");

  }

  reset()
  {
    $('#Beech').removeClass('pushdown');
    let comefromtop = document.querySelector(".comefromtop");
    comefromtop?.setAttribute("style", "transform: translate(0, 0); transition-duration: 1s; transition-timing-function: ease-in-out; transition-property: transform;");

  }

  convertir_numero(value: string)
  {
    return Number.parseInt(value);
  }


  ordenar_votos()
  {
    for(let i = 0; i < this.filas; i++)
    {
      for(let j = 0; j < 2; j++)
      {

        if (this.canciones[i][j])
        {
          let id_cancion_eu = this.canciones[i][j]['nid_cancion_eu'];

          let fila_nueva = Number(Number(this.orden_votaciones[id_cancion_eu]) % 2);
          let columna_nueva = Number(Math.round(Number(this.orden_votaciones[id_cancion_eu])  / this.filas));

          let nombre_clase = '.c_' + id_cancion_eu;

          let clase = document.querySelector(nombre_clase);

          let dif_columna = (columna_nueva - j) * 100;
          let dif_fila = (fila_nueva - i) * 100;

          let transformacion = "transform: translate(" + dif_columna + "%, "+  dif_fila + "%); transition-duration: 1s; transition-timing-function: ease-in-out; transition-property: transform;";

          console.log(nombre_clase);
          console.log(transformacion);

          clase?.setAttribute("style", transformacion);
        }
        
      }
    }
  }

  obtener_clase(nid_cancion: string)
  {
    return 'c_' + nid_cancion;
  }

  recupera_votaciones =
  {
    next: (respuesta: any) =>
    {
      this.votaciones = respuesta.votaciones;

      for (let i = 0; i < this.votaciones.length; i++)
      {
        this.orden_votaciones[this.votaciones[i]['nid_cancion_eu']] = i;
      }

      this.ordenar_votos();
      console.log(this.orden_votaciones);
    }
  }

  actualizar_votos()
  {
    this.cancionesService.obtener_votaciones().subscribe(this.recupera_votaciones);

  }

}
