import { Component } from '@angular/core';
import { BloqueButacasComponent } from '../bloque-butacas/bloque-butacas.component';
import { Constantes } from '../../logica/constantes';
@Component({
  selector: 'app-patio-butacas',
  imports: [BloqueButacasComponent],
  templateUrl: './patio-butacas.component.html',
  styleUrl: './patio-butacas.component.css',
})
export class PatioButacasComponent {
  tamGap: number = Constantes.CAES.gap;
  tamIconos: number = Constantes.CAES.tamIconos;
}
