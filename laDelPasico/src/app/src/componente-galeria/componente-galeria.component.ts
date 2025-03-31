import { Component, OnInit, Input, ElementRef, AfterViewInit } from '@angular/core';
import { ComponenteService } from 'src/app/servicios/componente.service';
import { Constantes } from '../logica/constantes';


//https://www.npmjs.com/package/@kolkov/ngx-gallery
@Component({
    selector: 'app-componente-galeria',
    templateUrl: './componente-galeria.component.html',
    styleUrls: ['./componente-galeria.component.css'],
    standalone: false
})
export class ComponenteGaleriaComponent implements OnInit {

 

  @Input() id_componente:string ="";

  imagenes: string [] = [];
  galeriaImagenes: any[] = [];

  imagenPrincipal: any = null; 
  bCargadaGaleria: boolean = false;
  modalAbierto: boolean = false; // Estado del modal

  indice: number = 0;
  primera_imagen: number = 0; 
  ultima_imagen: number = 3; 


  constructor(private componenteService: ComponenteService, private _elementRef: ElementRef) { }

  ngOnInit(): void {
    this.componenteService.obtiene_imagenes_galeria(this.id_componente).subscribe(
      (res:any) =>
      {
        this.galeriaImagenes = res['imagenes'];
        this.bCargadaGaleria = true;
        this.imagenPrincipal = this.galeriaImagenes[this.indice]; // Establece la primera imagen como principal

    }
    )
  }



  seleccionarImagen(imagen: any, i:number): void {
    this.indice = i;
    this.imagenPrincipal = imagen; // Cambia la imagen principal

  }


  obtener_url_imagen(id_imagen: number): String
  {
    return Constantes.General.URL_BACKED + "/imagen_url/" + id_imagen;
  }

  siguiente_imagen(): void {
    if (this.indice < this.galeriaImagenes.length - 1) {
      this.indice++;
      this.imagenPrincipal = this.galeriaImagenes[this.indice]; // Cambia la imagen principal
      this.trasladar();
    }
  }

  anterior_imagen(): void {
    if (this.indice > 0) {
      this.indice--;
      this.imagenPrincipal = this.galeriaImagenes[this.indice]; // Cambia la imagen principal
      this.trasladar();
    }
  }

  abrirModal(): void {
    this.modalAbierto = true; // Abre el modal
  }

  cerrarModal(): void {
    this.modalAbierto = false; // Cierra el modal
  }

  trasladar()
  {
    const imagenes = document.querySelectorAll('.slide');

    console.log("imagenes: " + imagenes.length);
    console.log("indice: " + this.indice + " ultima_imagen: " + this.ultima_imagen);
    console.log("primera_imagen: " + this.primera_imagen);
    imagenes.forEach((imagen: any) =>
    {
      if (this.indice < this.primera_imagen )
      {
        let traslado;
        if(this.indice < 3)
        {
           traslado = 0;
        }
        else
        {
           traslado = (this.indice - 3) * 100;
        }
        imagen.style.transform = 'translateX(' + traslado + '%)';
      }
      else if (this.indice > this.ultima_imagen )
      {
        let traslado;
        if(this.indice > this.galeriaImagenes.length - 4)
        {
          traslado = (this.galeriaImagenes.length - 4) * 100
        }
        else
        {
          traslado = (this.indice - 3) * 100;
        }
        imagen.style.transform = 'translateX(-' + traslado + '%)';
      }

    });

    if(this.indice < this.primera_imagen)
    {
      this.primera_imagen--;
      this.ultima_imagen--;
    }
    else if (this.indice > this.ultima_imagen)
    {
      this.primera_imagen++;
      this.ultima_imagen++;
    }
  }

}
