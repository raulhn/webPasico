import { Component, Input } from '@angular/core';

@Component({
  selector: 'alerta-general',
  templateUrl: './alerta-general.component.html',
  styleUrl: './alerta-general.component.css',
  standalone: false,
})
export class AlertaGeneralComponent {
  @Input() infoAlerta = { titulo: '', cantidad: 0 };
}
