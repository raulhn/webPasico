import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/sercicios/usuarios.service';

@Component({
  selector: 'app-cabecera',
  templateUrl: './cabecera.component.html',
  styleUrls: ['./cabecera.component.css']
})
export class CabeceraComponent implements OnInit {

  usuario = "";
  logueado = false;

  constructor(private usuariosService: UsuariosService, private router: Router) { }

  ngOnInit(): void {
    this.usuariosService.logueado().subscribe(
      (res:any) =>
      {
        console.log(res.logueado);
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
        console.log(res);
        if(!res.error)
        {
          this.logueado = false;
          this.usuario = "";
          this.router.navigate(['login']);
        }
      }
    )
  }
}
