import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { faUser as faUser } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {

  usuario = "";
  logueado = false;

  faUser = faUser;

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
          console.log(this.usuario)
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
