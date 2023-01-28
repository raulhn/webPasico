import { Component, OnInit, Input, ElementRef, AfterViewInit } from '@angular/core';
import { ComponenteService } from 'src/app/servicios/componente.service';
import { Constantes } from '../logica/constantes';

import {NgxGalleryOptions} from '@kolkov/ngx-gallery';
import {NgxGalleryImage} from '@kolkov/ngx-gallery';
import {NgxGalleryAnimation} from '@kolkov/ngx-gallery';

//https://www.npmjs.com/package/@kolkov/ngx-gallery
@Component({
  selector: 'app-componente-galeria',
  templateUrl: './componente-galeria.component.html',
  styleUrls: ['./componente-galeria.component.css']
})
export class ComponenteGaleriaComponent implements OnInit {

 

  @Input() id_componente:string ="";

  imagenes: string [] = [];


  items: any[] = [];

  galleryOptions: NgxGalleryOptions[] = [];
  galleryImages: NgxGalleryImage[] = [];

  bCargadaGaleria: Promise<boolean>|null = null;

  constructor(private componenteService: ComponenteService, private _elementRef: ElementRef) { }

  ngOnInit(): void {
    this.componenteService.obtiene_imagenes_galeria(this.id_componente).subscribe(
      (res:any) =>
      {
        if (!res.error)
        {
        
          for(let i=0; i<res['imagenes'].length; i++)
          {
            this.imagenes[i] = Constantes.General.URL_BACKED + "/imagen_url/" + res['imagenes'][i]['nid_imagen'];
            this.galleryImages.push({small: Constantes.General.URL_BACKED + "/imagen_url/" + res['imagenes'][i]['nid_imagen'], 
                            medium: Constantes.General.URL_BACKED + "/imagen_url/" + res['imagenes'][i]['nid_imagen'],
                            big: Constantes.General.URL_BACKED + "/imagen_url/" + res['imagenes'][i]['nid_imagen']});
          }
          window.onload = function () 
          {

          
              (<any>$('.pgwSlideshow')).pgwSlideshow();
          }
        

    
            this.galleryOptions = [
              {
                width: '70%',
                height: '500px',
                thumbnailsColumns: 4,
                imageAnimation: NgxGalleryAnimation.Slide,
                
                
              },
              // max-width 800
              {
                breakpoint: 600,
                width: '60%',
                height: '300px',
                imagePercent: 80,
                thumbnailsPercent: 20,
                thumbnailsMargin: 20,
                thumbnailMargin: 20
              },
              // max-width 400
              {
                breakpoint: 400,
                width: '100%',
                height: '300px',
                imagePercent: 80,
                thumbnailsPercent: 20,
                thumbnailsMargin: 20,
                thumbnailMargin: 20
              }
            ];
      
       
          this.bCargadaGaleria = Promise.resolve(true);
      }
    }
    )
  }


}
