import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-lista-ordenada',
  templateUrl: './lista-ordenada.component.html',
  styleUrls: ['./lista-ordenada.component.css']
})
export class ListaOrdenadaComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  add()
  {
    let desplazamiento = [{transform: "translate(0, 100%)"}, {easing: "ease-in-out"}]
    let duracion = {duration: 1000}

    $('#Beech').addClass('pushdown');
  //  $('#Cedar').addClass('comefromtop');
    let comefromtop = document.querySelector(".comefromtop");
    comefromtop?.setAttribute("style", "transform: translate(0, -100%); transition-duration: 1s; transition-timing-function: ease-in-out; transition-property: transform;");

  }

  reset()
  {
    $('#Beech').removeClass('pushdown');
    let comefromtop = document.querySelector(".comefromtop");
    comefromtop?.setAttribute("style", "transform: translate(0, 0); transition-duration: 1s; transition-timing-function: ease-in-out; transition-property: transform;");

  }
}
