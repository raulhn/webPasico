import { Component, OnInit, signal } from '@angular/core';
import { AlertasService } from '../../../servicios/alertas.service';
import { URL } from 'src/app/logica/constantes';
@Component({
  selector: 'app-alerta-alumnos-sin-profesor',
  templateUrl: './alerta-alumnos-sin-profesor.component.html',
  styleUrl: './alerta-alumnos-sin-profesor.component.css',
  standalone: false,
})
export class AlertaAlumnosSinProfesorComponent implements OnInit {
  constructor(private alertaService: AlertasService) {}
  enlaceFicha: string = URL.URL_FRONT_END + '/ficha_persona/';
  alumnoSeleccionado: any;

  bCargadosAlumnos: boolean = false;

  $alumnosSinProfesor = signal([]);
  $idTablaAlumnosSinProfesor = signal('tabla_personas');
  cabecera_tabla_alumnos_sin_profesor = [
    { title: 'Nombre', data: 'nombre' },
    { title: 'Primer Apellido', data: 'primer_apellido' },
    { title: 'Segundo Apellido', data: 'segundo_apellido' },
    { title: 'Email', data: 'correo_electronico' },
    { title: 'Teléfono', data: 'telefono' },
  ];

  clickAlumno(data: any) {
    this.alumnoSeleccionado = data;
  }

  peticion_alumnos_sin_profesor = {
    next: (res: any) => {
      this.$alumnosSinProfesor.set(res.alumnos_sin_profesor);
      this.bCargadosAlumnos = true;
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

  obtenerUrlFicha() {
    return this.enlaceFicha + this.alumnoSeleccionado.nid;
  }
}
