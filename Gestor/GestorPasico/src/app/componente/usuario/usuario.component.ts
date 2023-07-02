import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent implements OnInit {


  constructor(private usuarioService:UsuariosService, private router:Router) { }

  usuario = "";
  password = "";

  error = false;
  mensajeError = "";
  ngOnInit(): void {
  }

  
  registrar()
  {
    console.log(this.usuario);
    this.usuarioService.registrar(this.usuario, this.password).subscribe(
      (res: any) =>
      {
        console.log(res);
      }
    )
   
  }

  limpiaError()
  {
    this.error = false;
    this.mensajeError = "";
  }

}
