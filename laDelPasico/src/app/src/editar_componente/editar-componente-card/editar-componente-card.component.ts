import { Component, Input, OnInit } from '@angular/core';
import { ComponenteService } from 'src/app/servicios/componente.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-componente-card',
  templateUrl: './editar-componente-card.component.html',
  styleUrl: './editar-componente-card.component.css',
  standalone: false,
})
export class EditarComponenteCardComponent implements OnInit {
  componente_card: any = { nid_componente_card: '', texto: '', color: '' };
  cargado: boolean = false;

  constructor(private serviceComponente: ComponenteService) {}
  @Input() nid_componente_card: string = '';

  peticion_obtiene_componente = {
    error: (respuesta: any) => {
      this.cargado = true;
    },
    next: (respuesta: any) => {
      this.componente_card = respuesta.componente;
      this.cargado = true;
    },
  };

  ngOnInit(): void {
    this.serviceComponente
      .obtener_componente_card(this.nid_componente_card)
      .subscribe(this.peticion_obtiene_componente);
  }

  guardar() {
    console.log('Guardando componente card...', this.componente_card);
    this.serviceComponente
      .actualizar_componente_card(
        this.componente_card.nid_componente_card,
        this.componente_card.texto,
        this.componente_card.color,
      )
      .subscribe({
        error: (respuesta: any) => {
          console.log(respuesta);
        },
        next: (respuesta: any) => {
          console.log(respuesta);
          window.location.reload();
        },
      });
  }
}
