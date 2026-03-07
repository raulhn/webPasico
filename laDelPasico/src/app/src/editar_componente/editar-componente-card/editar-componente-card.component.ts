import { Component, Input, OnInit } from '@angular/core';
import { ComponenteService } from 'src/app/servicios/componente.service';

@Component({
  selector: 'app-editar-componente-card',
  imports: [],
  templateUrl: './editar-componente-card.component.html',
  styleUrl: './editar-componente-card.component.css',
})
export class EditarComponenteCardComponent implements OnInit {
  componente_card: any = null;
  constructor(private serviceComponente: ComponenteService) {}
  @Input() nid_componente_card: string = '';

  peticion_obtiene_componente = {
    error: (respuesta: any) => {},
    next: (respuesta: any) => {
      this.componente_card = respuesta.componente_card;
    },
  };

  ngOnInit(): void {
    this.serviceComponente
      .obtener_componente_card(this.nid_componente_card)
      .subscribe(this.peticion_obtiene_componente);
  }
}
