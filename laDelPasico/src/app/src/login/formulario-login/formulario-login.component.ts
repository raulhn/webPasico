import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Usuario } from '../../logica/usuario';
import { of } from 'rxjs';
import { Router } from '@angular/router';



@Component({
    selector: 'app-formulario-login',
    templateUrl: './formulario-login.component.html',
    styleUrls: ['./formulario-login.component.css'],
    standalone: false
})


export class FormularioLoginComponent   {

  resultado: string[] = [];


  observer = {
    complete: ()=>{},
    error: (err : Error)=>{ },
    next: (res: any) => {
     
                          this.router.navigate(['']);
                        }
  };

  login ='';
  password = '';

  mensaje = '';

  constructor(private usuarioService: UsuariosService, private usuario:Usuario, private router:Router) {
 
  }
    
  loguearse() {



    this.usuario.usuario = this.login;
    this.usuario.pass = this.password;

    this.usuarioService.login(this.usuario).subscribe(this.observer);
    }
  
}
