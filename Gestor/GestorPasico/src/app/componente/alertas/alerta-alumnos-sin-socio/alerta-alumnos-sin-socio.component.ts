import { Component, OnInit, signal } from '@angular/core';
import { AlertasService } from '../../../servicios/alertas.service';

@Component({
  selector: 'app-alerta-alumnos-sin-socio',
  imports: [],
  templateUrl: './alerta-alumnos-sin-socio.component.html',
  styleUrl: './alerta-alumnos-sin-socio.component.css',
})
export class AlertaAlumnosSinSocioComponent implements OnInit {
  constructor(private alertasService: AlertasService) {}
  alumnosSinSocio = signal([]);

  peticion_alumnos_sin_socios = {
    next: (res: any) => {
      console.log(res);
      this.alumnosSinSocio.set(res.alumnos_sin_socio);
    },
    error: (err: any) => {
      console.log(err);
    },
  };

  ngOnInit(): void {
    this.alertasService
      .obtener_alumnos_sin_socios()
      .subscribe(this.peticion_alumnos_sin_socios);
  }
}
