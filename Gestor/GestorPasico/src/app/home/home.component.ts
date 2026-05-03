import { Component, OnInit, signal } from '@angular/core';
import { UsuariosService } from '../servicios/usuarios.service';
import { AlertasService } from '../servicios/alertas.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: false,
})
export class HomeComponent implements OnInit {
  constructor(
    private usuariosService: UsuariosService,
    private router: Router,
    private alertasService: AlertasService,
  ) {}
  usuario = '';

  alumnos_sin_profesor = signal<any[]>([]);
  alumnos_sin_pago = signal<any[]>([]);
  alumnos_sin_socios = signal<any[]>([]);
  socios_sin_pago = signal<any[]>([]);

  peticion_alumnos_sin_profesor = {
    next: (res: any) => {
      console.log(res);
      this.alumnos_sin_profesor.set(res.alumnos_sin_profesor);
    },
    error: (err: any) => {
      console.log(err);
    },
  };

  peticion_alumnos_sin_pago = {
    next: (res: any) => {
      console.log(res);
      this.alumnos_sin_pago.set(res.alumnos_sin_pago);
    },
    error: (err: any) => {
      console.log(err);
    },
  };

  peticion_alumnos_sin_socios = {
    next: (res: any) => {
      console.log(res);
      this.alumnos_sin_socios.set(res.alumnos_sin_socios);
    },
    error: (err: any) => {
      console.log(err);
    },
  };

  peticion_socios_sin_pago = {
    next: (res: any) => {
      console.log(res);
      this.socios_sin_pago.set(res.socios_sin_pago);
    },
    error: (err: any) => {
      console.log(err);
    },
  };

  ngOnInit(): void {
    this.usuariosService.logueado().subscribe((res: any) => {
      console.log(res.logueado);
      if (!res.logueado) {
        this.router.navigate(['login']);
      } else {
        this.usuario = res.login;
      }
    });

    this.alertasService
      .obtener_alumnos_sin_profesor()
      .subscribe(this.peticion_alumnos_sin_profesor);

    this.alertasService
      .obtener_alumnos_sin_pago()
      .subscribe(this.peticion_alumnos_sin_pago);

    this.alertasService
      .obtener_alumnos_sin_socios()
      .subscribe(this.peticion_alumnos_sin_socios);

    this.alertasService
      .obtener_socios_sin_pago()
      .subscribe(this.peticion_socios_sin_pago);
  }
}
