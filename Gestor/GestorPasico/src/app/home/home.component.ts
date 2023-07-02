import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../servicios/usuarios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private usuariosService: UsuariosService, private router: Router) { }
  usuario = '';

  
  

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
        }
      }
    )
  }

 

}
