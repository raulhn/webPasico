import { Component, Input, OnInit, ViewChild, Pipe, PipeTransform } from '@angular/core';
import { ComponenteService } from 'src/app/servicios/componente.service';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { Constantes } from '../logica/constantes';

@Component({
    selector: 'app-componente-carusel',
    templateUrl: './componente-carusel.component.html',
    styleUrls: ['./componente-carusel.component.css'],
    standalone: false
})
export class ComponenteCaruselComponent implements OnInit {
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: false,
    dots: true,
    margin:10,
    autoplay: true,
    autoWidth:true,
    navSpeed: 700,
    merge:true,
    responsive: {
      0: {
        items: 1
      },
      600: {
        items: 3
      }
    },
    nav: false
  }

  @Input() id_componente: string = "";
  imagenes:any [] = [];

  constructor(private componenteService: ComponenteService) { }
 
  inicializa_carrusel =
  {
    next: (respuesta: any) =>
    {
      let elementos_simultaneos = respuesta["componente_carusel"][0]["elementos_simultaneos"];
      this.imagenes = respuesta["elementos_carusel"];

      this.customOptions = {
        loop: true,
        mouseDrag: true,
        touchDrag: true,
        pullDrag: false,
        dots: true,
        margin:10,
        autoplay: true,
        autoWidth:true,
        navSpeed: 700,
        merge:true, 
        responsive: {
          0: {
            items: 1
          },
          600: {
            items: elementos_simultaneos
          }
        },
        nav: false
      }
    }
  }

  obtiene_url_imagen(id: string): string
  {
    return  Constantes.General.URL_BACKED + "/imagen_url/" + id;
  }

  ngOnInit(): void {
    this.componenteService.obtener_carrusel(this.id_componente).subscribe(
      this.inicializa_carrusel
    )
  }

}
