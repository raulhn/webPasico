import { Component, OnInit, signal } from '@angular/core';
import { AlertasService } from '../../../servicios/alertas.service';

@Component({
  selector: 'app-alerta-alumnos-sin-profesor',
  imports: [],
  templateUrl: './alerta-alumnos-sin-profesor.component.html',
  styleUrl: './alerta-alumnos-sin-profesor.component.css',
})
export class AlertaAlumnosSinProfesorComponent implements OnInit {
  constructor(private alertaService: AlertasService) {}

  alumnosSinProfesor = signal([]);
  peticion_alumnos_sin_profesor = {
    next: (res: any) => {
      console.log(res);
      this.alumnosSinProfesor.set(res.alumnos_sin_profesor);
    },
    error: (err: any) => {
      console.log(err);
    },
  };

  ngOnInit(): void {
    this.alertaService
      .obtener_alumnos_sin_profesor()
      .subscribe(this.peticion_alumnos_sin_profesor);
  }
}
