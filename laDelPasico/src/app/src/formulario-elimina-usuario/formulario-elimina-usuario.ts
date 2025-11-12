import { Component } from '@angular/core';
import { ReCaptchaV3Service } from 'ngx-captcha';
import { ServiceSolicitudEliminaUsuario } from 'src/app/servicios/solicitud-elimina-usuario';


@Component({
  selector: 'app-formulario-elimina-usuario',
  imports: [],
  templateUrl: './formulario-elimina-usuario.html',
  styleUrl: './formulario-elimina-usuario.css',
})
export class FormularioEliminaUsuario {

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
  function lanzaPeticion()
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
          (token) => {
            this.token = token;
            let data = { token: this.token, correo_electronico: this.correo_electronico };
            this.servicioSolicitudEliminaUsuario.solicita_elimina_usuario(data).subscribe(this.peticion_elimina_usuario);
          });
      }
  }
}
