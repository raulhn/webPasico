import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})



export class UsuariosComponent implements OnInit {

  constructor(private usuarioService:UsuariosService, private router:Router) { }

  lista_usuarios: String [] = [];
  lista_password: String [] = [];

  error_cambio: boolean = false
  cambio_realizado: boolean = false

  /**
   * Procedimiento que carga la lista de usuarios existentes en la base de datos
   * @returns 
   */
  cargar_lista_usuarios(): Promise<any>
  {
    return new Promise(
      (resolve, reject) =>
      {
        this.usuarioService.obtener_usuarios().subscribe(
          {
            next: (usuarios: any) =>
            {
              console.log(usuarios);
              if(!usuarios.error)
              {
                for(let i=0; i < usuarios.usuarios.length; i++)
                {
                  console.log(usuarios.usuarios[i].usuario);
                  this.lista_usuarios[i] = usuarios.usuarios[i].usuario;
                  resolve(true);
                }
              }
            },
            error: () =>
            {
              reject();
            }
          }
        )
      }
      )
  }

  async peticion_carga_lista_usuarios()
  {
    await this.cargar_lista_usuarios();
    //console.log('Terminada petición');
  }

  cambiar_contraseña(usuario: String, password: String): Promise<any>
  {
    return new Promise(
      (resolve, reject) =>
      {
        this.usuarioService.actualizar_password(password).subscribe(
          {
            next: (respuesta: any) =>
            {
              if(!respuesta.error)
              {
                resolve(true);
              }
            },
            error: () =>
            {
              resolve(false);
            }
          }
        )
      }
    )
  }

  async peticion_cambiar_pass(indice: number)
  {
    // Se recupera los valores para la contraseña y usuario //
    let usuario = this.lista_usuarios[indice]
    let password = this.lista_password[indice]

    let bResultado: Boolean = await this.cambiar_contraseña(usuario, password);
    if (bResultado)
    {
      console.log('Cambio de contraseña realizado')
      this.cambio_realizado = true
    }
    else{
      console.log('Se ha producido un error al cambiar la contraseña')  
      this.error_cambio = true
    }
  }

  limpiaError()
  {
    this.error_cambio = false;
  }

  limpiaCambioRealizado()
  {
    this.cambio_realizado = false;
  }

  ngOnInit(): void {
    this.peticion_carga_lista_usuarios();
  }

}
