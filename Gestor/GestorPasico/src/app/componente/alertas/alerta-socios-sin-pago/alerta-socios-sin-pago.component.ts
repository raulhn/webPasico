import { Component, OnInit, signal } from '@angular/core';
import { AlertasService } from '../../../servicios/alertas.service';
@Component({
  selector: 'app-alerta-socios-sin-pago',
  imports: [],
  templateUrl: './alerta-socios-sin-pago.component.html',
  styleUrl: './alerta-socios-sin-pago.component.css',
})
export class AlertaSociosSinPagoComponent implements OnInit {
  sociosSinPago = signal([]);

  constructor(private alertasService: AlertasService) {}

  peticion_socios_sin_pago = {
    next: (res: any) => {
      console.log(res);
      this.sociosSinPago.set(res.socios_sin_pago);
    },
    error: (err: any) => {
      console.log(err);
    },
  };

  ngOnInit(): void {
    this.alertasService
      .obtener_socios_sin_pago()
      .subscribe(this.peticion_socios_sin_pago);
  }
}
