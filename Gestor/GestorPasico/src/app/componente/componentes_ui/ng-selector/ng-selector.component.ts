import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'ng-selector',
  templateUrl: './ng-selector.component.html',
  styleUrl: './ng-selector.component.css',
  standalone: false,
})
export class NgSelectorComponent implements OnInit {
  @Input() opciones: any[] = [];
  @Input() opcionSeleccionada: any;

  opcionesFiltradas: any[] = [];
  entrada: String = '';

  isFocus: boolean = false;

  ngOnInit(): void {
    this.opcionesFiltradas = this.opciones;
  }

  constructor() {}

  seleccionarOpcion(opcion: any) {
    console.log('xx');
    this.opcionSeleccionada = opcion;
    this.entrada = opcion.etiqueta;
    this.filtrarOpciones();
  }

  filtrarOpciones() {
    console.log(this.entrada);
    const valor = this.entrada.toLowerCase();
    this.opcionesFiltradas = this.opciones.filter((opcion) =>
      opcion.etiqueta.toLowerCase().includes(valor),
    );
  }

  onActivar() {
    this.isFocus = true;
  }

  onDesactivar() {
    setTimeout(() => {
      this.isFocus = false;
    }, 200);
  }
}
