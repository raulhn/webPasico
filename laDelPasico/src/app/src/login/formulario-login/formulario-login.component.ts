import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Usuario } from '../../logica/usuario';
import { of } from 'rxjs';
import { Router } from '@angular/router';



@Component({
  selector: 'app-formulario-login',
  templateUrl: './formulario-login.component.html',
  styleUrls: ['./formulario-login.component.css']
})


export class FormularioLoginComponent   {

  resultado: string[] = [];

  mostrarError()
  {
    console.log('Mostrar Error');
  }

  observer = {
    complete: ()=>{console.log('x'); },
    error: (err : Error)=>{console.log('Peazo Error: ' + err); this.mostrarError();},
    next: (res: any) => {
                        console.log(res); 
                        console.log(res['message']);
                        if (res['error'])
                        {
                          console.log('Error');
                        }
                        else{
                          console.log('Logueado');
                          this.router.navigate(['']);
                        }}
  };

  login ='';
  password = '';

  mensaje = '';

  constructor(private usuarioService: UsuariosService, private usuario:Usuario, private router:Router) {
 
  }
    
  loguearse() {

    console.log(this.login);
    console.log(this.password);

    this.usuario.usuario = this.login;
    this.usuario.pass = this.password;

    this.usuarioService.login(this.usuario).subscribe(this.observer);
    }
  
}
