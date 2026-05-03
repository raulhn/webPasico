import { Component, OnInit, signal } from '@angular/core';
import { AlertasService } from '../../../servicios/alertas.service';

@Component({
  selector: 'app-alerta-alumnos-sin-pago',
  imports: [],
  templateUrl: './alerta-alumnos-sin-pago.component.html',
  styleUrl: './alerta-alumnos-sin-pago.component.css',
})
export class AlertaAlumnosSinPagoComponent implements OnInit {
  alumnosSinPago = signal([]);

  constructor(private alertasService: AlertasService) {}

  peticion_alumnos_sin_pago = {
    next: (res: any) => {
      console.log(res);
      this.alumnosSinPago.set(res.alumnos_sin_pago);
    },
    error: (err: any) => {
      console.log(err);
    },
  };

  ngOnInit(): void {
    this.alertasService
      .obtener_alumnos_sin_pago()
      .subscribe(this.peticion_alumnos_sin_pago);
  }
}
