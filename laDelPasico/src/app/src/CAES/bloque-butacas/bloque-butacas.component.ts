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
  @Input() margenIzquierdo: number = 0;
  @Input() margenDerecho: number = 0;
  @Input() indice: number = 1;
  @Input() reverse: number = 0;

  arrayFilas: number[] = [];
  arrayButacas: number[] = [];
  ngOnInit(): void {
    for (let i = 0; i < this.filas; i++) {
      this.arrayFilas[i] = i + 1;
    }
    for (let j = 0; j < this.butacas; j++) {
      this.arrayButacas[j] = j + 1;
    }
  }
}
