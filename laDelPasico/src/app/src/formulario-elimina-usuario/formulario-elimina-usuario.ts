import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReCaptchaV3Service } from 'ngx-captcha';
import { SolicitudEliminaUsuario } from 'src/app/servicios/solicitud-elimina-usuario';
import Swal from 'sweetalert2';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-formulario-elimina-usuario',
  imports: [FormsModule],
  templateUrl: './formulario-elimina-usuario.html',
  styleUrl: './formulario-elimina-usuario.css',
})

export class FormularioEliminaUsuario {

  constructor(private recaptchaV3Service: ReCaptchaV3Service, private solicitudEliminaUsuario: SolicitudEliminaUsuario) { }

  correo_electronico: string = "";

  peticion_elimina_usuario =
  {
    next: (respuesta: any) =>
    {
      Swal.fire({
      icon: 'success',
      title: 'Registro correcto',
      text: 'Gracias por su solicitud, nos pondremos en contacto con usted lo antes posible'
    })
  },
  error: (respuesta: any) =>
  {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Se ha producido un error',
    })
  }
  }

  lanzaPeticion()
  {
    try
      {
      if (!this.correo_electronico || this.correo_electronico.length == 0)
      {
         Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: "Es necesario incluir un correo electrónico"
        })
      }
      else
      {
        this.recaptchaV3Service.execute(environment.recaptcha.siteKey, 'importantAction',
          (token: string) => {
            let data = { token: token, correo_electronico: this.correo_electronico };
            this.solicitudEliminaUsuario.solicita_elimina_usuario(data).subscribe(this.peticion_elimina_usuario);
          });
      }
    }
    catch (error)
    {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Se ha producido un error inesperado',
      })
    }
  }
}
