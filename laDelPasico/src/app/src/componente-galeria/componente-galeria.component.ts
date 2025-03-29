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
  bCargadGaleria: boolean = false;
  modalAbierto: boolean = false; // Estado del modal

  indice: number = 0;

  constructor(private componenteService: ComponenteService, private _elementRef: ElementRef) { }

  ngOnInit(): void {
    this.componenteService.obtiene_imagenes_galeria(this.id_componente).subscribe(
      (res:any) =>
      {
        this.galeriaImagenes = res['imagenes'];
        this.bCargadGaleria = true;
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
    }
  }

  anterior_imagen(): void {
    if (this.indice > 0) {
      this.indice--;
      this.imagenPrincipal = this.galeriaImagenes[this.indice]; // Cambia la imagen principal
    }
  }

  abrirModal(): void {
    this.modalAbierto = true; // Abre el modal
  }

  cerrarModal(): void {
    this.modalAbierto = false; // Cierra el modal
  }

}
