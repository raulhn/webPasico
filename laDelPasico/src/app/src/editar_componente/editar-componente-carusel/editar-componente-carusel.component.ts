import { Component, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { faX, faCirclePlus} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-editar-componente-carusel',
  templateUrl: './editar-componente-carusel.component.html',
  styleUrls: ['./editar-componente-carusel.component.css']
})
export class EditarComponenteCaruselComponent implements OnInit {
  
  faXmark = faX;
  faAdd = faCirclePlus;

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
