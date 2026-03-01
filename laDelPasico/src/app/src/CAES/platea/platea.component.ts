import { Component } from '@angular/core';
import { BloqueButacasComponent } from '../bloque-butacas/bloque-butacas.component';
import { Constantes } from '../../logica/constantes';
@Component({
  selector: 'app-platea',
  imports: [BloqueButacasComponent],
  templateUrl: './platea.component.html',
  styleUrl: './platea.component.css',
})
export class PlateaComponent {
  tamGap: number = Constantes.CAES.gap;
  tamIconos: number = Constantes.CAES.tamIconos;
}
