import { Component, Input, OnInit } from '@angular/core';
import { ComponenteService } from 'src/app/servicios/componente.service';

@Component({
    selector: 'app-componente-imagen',
    templateUrl: './componente-imagen.component.html',
    styleUrls: ['./componente-imagen.component.css'],
    standalone: false
})
export class ComponenteImagenComponent implements OnInit {

  @Input() nid: string = "";


  constructor(private componenteService: ComponenteService) { }

  ngOnInit(): void {
   
  }

}
