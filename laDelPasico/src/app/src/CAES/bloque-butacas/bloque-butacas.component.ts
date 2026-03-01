import { Component, OnInit } from '@angular/core';
import { Input } from '@angular/core';
import { ButacaComponent } from '../butaca/butaca.component';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-bloque-butacas',
  imports: [ButacaComponent, CommonModule],
  templateUrl: './bloque-butacas.component.html',
  styleUrl: './bloque-butacas.component.css',
})
export class BloqueButacasComponent implements OnInit {
  @Input() filas = 0;
  @Input() butacas: number = 0;
  @Input() desplazamientoIzquierdo: number = 0;
  @Input() desplazamientoDerecho: number = 0;
  @Input() indice: number = 1;
  @Input() reverse: number = 0;
  @Input() tamIconos: number = 15;
  @Input() tamGap: number = 5;

  arrayFilas: number[] = [];
  arrayButacas: number[] = [];
  butacasSeleccionadas: any[] = [];

  margenIzquierdo: number = 0;
  margenDerecho: number = 0;

  clickButaca(data: any) {
    console.log(data);
    if (data.seleccionado) {
      this.butacasSeleccionadas.push(data.asiento);
    } else {
      const index = this.butacasSeleccionadas.indexOf(data.asiento);
      this.butacasSeleccionadas.splice(index, 1);
    }
    console.log(this.butacasSeleccionadas);
  }

  ngOnInit(): void {
    this.margenIzquierdo =
      (this.tamIconos + this.tamGap + 4) * this.desplazamientoIzquierdo;
    this.margenDerecho =
      (this.tamIconos + this.tamGap) * this.desplazamientoDerecho;

    console.log('desplazamientoIzquierdo', this.desplazamientoIzquierdo);
    console.log('desplazamientoDerecho', this.desplazamientoDerecho);
    console.log('margenDerecho', this.margenDerecho);
    console.log('margenIzquierdo', this.margenIzquierdo);
    for (let i = 0; i < this.filas; i++) {
      this.arrayFilas[i] = this.filas - i + (this.indice - 1);
      console.log(this.filas - i + (this.indice - 1));
    }
    for (let j = 0; j < this.butacas; j++) {
      this.arrayButacas[j] = j + 1;
    }
  }
}
