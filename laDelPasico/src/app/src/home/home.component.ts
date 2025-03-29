import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { QuillModule } from 'ngx-quill';
import { Pagina_componente } from '../logica/componentes/pagina_componente';
import { ComponenteService } from 'src/app/servicios/componente.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Title } from '@angular/platform-browser';
import { OwlOptions } from 'ngx-owl-carousel-o';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    standalone: false
})

export class HomeComponent implements OnInit {

  id_pagina: string = '0';
  pagina_componentes: Pagina_componente[] = [];


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
      450: {
        items: 3
      }
    },
    nav: false
  }


  observer = {
    next: (res: any) => 
      {
          this.pagina_componentes = res.data;

         
      }
  };

  constructor(private usuarioService: UsuariosService, private componenteService: ComponenteService, private titleService: Title) { 
      
   
  }

  ngOnInit(): void {

    this.componenteService.obtener_componentes(this.id_pagina).subscribe(this.observer);
    this.titleService.setTitle("Banda del Pasico");
    
  }

 

}
