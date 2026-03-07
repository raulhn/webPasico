import { Component, OnInit, Input } from '@angular/core';
import { ComponenteService } from 'src/app/servicios/componente.service';

@Component({
  selector: 'app-componente-card',
  templateUrl: './componente-card.component.html',
  styleUrl: './componente-card.component.css',
  standalone: false,
})
export class ComponenteCardComponent implements OnInit {
  componente_card: any = { nid_componente_card: '', texto: '', color: '' };
  cargado: boolean = false;
  constructor(private serviceComponente: ComponenteService) {}
  @Input() nid_componente_card: string = '';

  peticion_obtiene_componente = {
    error: (respuesta: any) => {
      this.cargado = true;
    },
    next: (respuesta: any) => {
      console.log(
        '--------------------------------------------------------------------------',
      );
      console.log(respuesta);
      console.log(
        '--------------------------------------------------------------------------',
      );
      this.componente_card = respuesta.componente;
      this.cargado = true;
    },
  };

  ngOnInit(): void {
    this.serviceComponente
      .obtener_componente_card(this.nid_componente_card)
      .subscribe(this.peticion_obtiene_componente);
  }
}
