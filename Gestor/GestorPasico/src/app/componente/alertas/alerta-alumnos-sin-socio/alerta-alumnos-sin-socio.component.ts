import { Component, OnInit, signal } from '@angular/core';
import { AlertasService } from '../../../servicios/alertas.service';
import { URL } from 'src/app/logica/constantes';

@Component({
  selector: 'app-alerta-alumnos-sin-socio',
  templateUrl: './alerta-alumnos-sin-socio.component.html',
  styleUrl: './alerta-alumnos-sin-socio.component.css',
  standalone: false,
})
export class AlertaAlumnosSinSocioComponent implements OnInit {
  constructor(private alertasService: AlertasService) {}
  enlaceFicha: string = URL.URL_FRONT_END + '/ficha_persona/';

  $alumnosSinSocio = signal([]);
  $idTablaAlumnosSinSocio = signal('tabla_personas');
  cabecera_tabla_alumnos_sin_socio = [
    { title: 'Nombre', data: 'nombre' },
    { title: 'Primer Apellido', data: 'primer_apellido' },
    { title: 'Segundo Apellido', data: 'segundo_apellido' },
    { title: 'Email', data: 'correo_electronico' },
    { title: 'Teléfono', data: 'telefono' },
  ];

  alumnoSeleccionado: any;

  bCargadosAlumnos: boolean = false;

  clickAlumno(data: any) {
    this.alumnoSeleccionado = data;
  }

  peticion_alumnos_sin_socios = {
    next: (res: any) => {
      this.$alumnosSinSocio.set(res.alumnos_sin_socio);
      this.bCargadosAlumnos = true;
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

  obtenerUrlFicha() {
    return this.enlaceFicha + this.alumnoSeleccionado.nid;
  }
}
