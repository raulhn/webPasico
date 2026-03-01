import { Component, Input } from '@angular/core';
import { faCouch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
@Component({
  selector: 'app-butaca',
  imports: [FontAwesomeModule],
  templateUrl: './butaca.component.html',
  styleUrl: './butaca.component.css',
})
export class ButacaComponent {
  @Input() fila = 0;
  @Input() butaca: number = 0;

  faCouch = faCouch;
}
