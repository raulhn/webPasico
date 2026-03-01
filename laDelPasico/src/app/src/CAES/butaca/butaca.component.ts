import { Component, Input, EventEmitter, Output } from '@angular/core';
import { faCouch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-butaca',
  imports: [FontAwesomeModule, CommonModule],
  templateUrl: './butaca.component.html',
  styleUrl: './butaca.component.css',
})
export class ButacaComponent {
  @Input() fila = 0;
  @Input() butaca: number = 0;
  @Output() clickButaca = new EventEmitter<any>();

  seleccionado: boolean = false;

  faCouch = faCouch;

  click() {
    console.log('x');
    console.log('Se ha hecho click: ', this.fila, this.butaca);
    this.seleccionado = !this.seleccionado;
    console.log('seleccionado', this.seleccionado);
    this.clickButaca.emit({
      asiento: { fila: this.fila, butaca: this.butaca },
      seleccionado: this.seleccionado,
    });
  }
}
