import { Component, OnInit, signal } from '@angular/core';
import { AlertasService } from '../../../servicios/alertas.service';
import { DataTablesOptions, URL } from 'src/app/logica/constantes';

@Component({
  selector: 'app-alerta-alumnos-sin-pago',
  templateUrl: './alerta-alumnos-sin-pago.component.html',
  styleUrl: './alerta-alumnos-sin-pago.component.css',
  standalone: false,
})
export class AlertaAlumnosSinPagoComponent implements OnInit {
  $alumnosSinPago = signal([]);
  $idTablaAlumnosSinPago = signal('tabla_personas');
  cabecera_tabla_alumnos_sin_pago = [
    { title: 'Nombre', data: 'nombre' },
    { title: 'Primer Apellido', data: 'primer_apellido' },
    { title: 'Segundo Apellido', data: 'segundo_apellido' },
    { title: 'Email', data: 'correo_electronico' },
    { title: 'Teléfono', data: 'telefono' },
  ];

  alumnoSeleccionado: any;

  bCargadosAlumnos: boolean = false;

  constructor(private alertasService: AlertasService) {}
  enlaceFicha: string = URL.URL_FRONT_END + '/ficha_persona/';

  clickAlumno(data: any) {
    this.alumnoSeleccionado = data;
  }

  peticion_alumnos_sin_pago = {
    next: (res: any) => {
      console.log(res);
      this.$alumnosSinPago.set(res.alumnos_sin_pago);

      this.bCargadosAlumnos = true;
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

  obtenerUrlFicha() {
    return this.enlaceFicha + this.alumnoSeleccionado.nid;
  }
}
