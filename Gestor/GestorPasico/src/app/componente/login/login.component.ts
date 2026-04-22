import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: false,
})
export class LoginComponent implements OnInit {
  elemento: any = 1;

  opciones = [
    {
      etiqueta: 'Usuario',
      valor: 1,
    },
    {
      etiqueta: 'Contraseña',
      valor: 2,
    },
    {
      etiqueta: 'Iniciar sesión',
      valor: 3,
    },
    {
      etiqueta: 'Registrarse',
      valor: 4,
    },
    {
      etiqueta: 'Olvidé mi contraseña',
      valor: 5,
    },
    {
      etiqueta: 'Cerrar sesión',
      valor: 6,
    },
  ];
  constructor(
    private usuarioService: UsuariosService,
    private router: Router,
  ) {}

  usuario = '';
  password = '';

  error = false;
  mensajeError = '';

  ngOnInit(): void {
    this.usuarioService.logueado().subscribe((res: any) => {
      if (res.logueado) {
        this.router.navigate(['']);
      }
    });
  }

  redirectTo(uri: string) {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([uri]));
  }

  login_web = {
    next: (res: any) => {
      console.log('Logueado en web');
    },
    error: (res: any) => {
      console.log('Error al loguear en web');
    },
  };

  login() {
    // Se loguea en la web para poder consultar las preinscripciones
    this.usuarioService
      .login_web(this.usuario, this.password)
      .subscribe(this.login_web);

    this.usuarioService
      .login(this.usuario, this.password)
      .subscribe((res: any) => {
        this.usuarioService.logueado().subscribe((res: any) => {
          if (res.logueado) {
            this.router
              .navigateByUrl('/', { skipLocationChange: true })
              .then(() => {
                this.router.navigate(['/login']);
              });
          } else {
            this.error = true;
            this.mensajeError = 'Usuario o contraseña incorrectos';
          }
        });
      });
  }

  limpiaError() {
    this.error = false;
    this.mensajeError = '';
  }
}
