import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { faUser as faUser } from '@fortawesome/free-regular-svg-icons';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  usuario = "";
  logueado = false;

  faUser = faUser;

  nuevo_password: string = "";

  @ViewChild('instancia_cambio_password') instancia_cambio_password!: ElementRef;

  constructor(private usuariosService: UsuariosService, private router: Router) { }

  ngOnInit(): void {
    this.usuariosService.logueado().subscribe(
      (res:any) =>
      {
        if(!res.logueado)
        {
          this.router.navigate(['login']);
        }
        else{
          this.usuario = res.login;
          this.logueado = res.logueado;
   //       this.router.navigate(['']);
        }
      }
    )
  }

  logout()
  {
    this.usuariosService.logout().subscribe(
      (res:any) =>
      {
        if(!res.error)
        {
          this.logueado = false;
          this.usuario = "";
          this.router.navigate(['login']);
        }
      }
    )
  }

  actualiza_password =
  {
    next: (respuesta: any) =>
    {
      Swal.fire({
        icon: 'success',
        title: 'Contraseña actualizada',
        text: 'Se ha actualizado la contraseña correctamente'
      })
    },
    error: (respuesta: any) =>
    {
      Swal.fire({
        icon: 'error',
        title: 'Error al actualizar contraseña',
        text: 'Se ha producido un error durante la actualización de la contraseña'
      })
    }
  }

  actualiza_password_web = 
  {
    next: (respuesta: any) =>
    {
      console.log('Actualizada contraseña en web')
    },
    error: (respuestas: any) =>
    {
      console.log('Error cambio contraseña web')
    }
  }

  cambiar_password()
  {
    Swal.fire({
      title: 'Cambiar contraseña',
      html: this.instancia_cambio_password.nativeElement,
      confirmButtonText: 'Guardar',
      showCancelButton: true,
    }).then(
      (results: any) =>
        {
        if(results.isConfirmed)
        {
          this.usuariosService.actualizar_password_web(this.nuevo_password).subscribe(this.actualiza_password_web)
          this.usuariosService.actualizar_password(this.nuevo_password).subscribe(this.actualiza_password);
        }
      }
    )
  }

}
