import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-desplegable',
  imports: [],
  templateUrl: './desplegable.component.html',
  styleUrl: './desplegable.component.css',
})
export class DesplegableComponent {
  @Input() lista: any = { titulos: [], hijos: [] };
}
