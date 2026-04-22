import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';

@Component({
  selector: 'ng-selector',
  templateUrl: './ng-selector.component.html',
  styleUrl: './ng-selector.component.css',
  standalone: false,
})
export class NgSelectorComponent implements OnInit {
  @Input() opciones: any[] = [];
  @Input() opcionSeleccionada: any = null;
  @Output() opcionSeleccionadaChange = new EventEmitter<any>();
  @Input() width: String = '200px';

  opcionesFiltradas: any[] = [];
  entrada: String = '';

  isFocus: boolean = false;

  ngOnInit(): void {
    this.opcionesFiltradas = this.opciones;

    const etiquetaSeleccionada = this.opciones.find(
      (opcion) => opcion.valor === this.opcionSeleccionada,
    )?.etiqueta;
    if (etiquetaSeleccionada) {
      this.entrada = etiquetaSeleccionada;
    }

    this.filtrarOpciones();
  }

  constructor() {}

  seleccionarOpcion(opcion: any) {
    this.opcionSeleccionada = opcion.valor;
    this.entrada = opcion.etiqueta;

    this.filtrarOpciones();
    this.opcionSeleccionadaChange.emit(this.opcionSeleccionada);
  }

  filtrarOpciones() {
    console.log(this.entrada);
    if (!this.entrada) {
      this.opcionSeleccionada = null;
      this.opcionSeleccionadaChange.emit(this.opcionSeleccionada);
    }
    const valor = this.entrada.toLowerCase();
    this.opcionesFiltradas = this.opciones.filter(
      (opcion, index: number) =>
        opcion.etiqueta.toLowerCase().includes(valor) && index < 5,
    );
  }

  onActivar() {
    this.isFocus = true;
  }

  onDesactivar() {
    // Da un margen en caso de seleccionar una opción
    setTimeout(() => {
      this.isFocus = false;
    }, 200);
  }
}
