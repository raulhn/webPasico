import { Component, Input, OnInit, ViewChild, Pipe, PipeTransform } from '@angular/core';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { QuillModule } from 'ngx-quill';
import { Pagina_componente } from '../logica/componentes/pagina_componente';
import { ComponenteService } from 'src/app/servicios/componente.service';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Title } from '@angular/platform-browser';
import { OwlOptions } from 'ngx-owl-carousel-o';


@Component({
  selector: 'app-componente-carusel',
  templateUrl: './componente-carusel.component.html',
  styleUrls: ['./componente-carusel.component.css']
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
      450: {
        items: 3
      }
    },
    nav: false
  }


  constructor() { }
 

  ngOnInit(): void {
  }

}
