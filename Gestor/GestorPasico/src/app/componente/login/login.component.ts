import { Component, OnInit } from '@angular/core';
import { UsuariosService } from 'src/app/sercicios/usuarios.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private usuarioService:UsuariosService, private router:Router) { }

  usuario = "";
  password = "";

  error = false;
  mensajeError = "";
  ngOnInit(): void {
    this.usuarioService.logueado().subscribe(
      (res:any) =>
      {
        console.log(res.logueado);
        if(res.logueado)
        {
          this.router.navigate(['']);
        }
      }
    )
  }

  redirectTo(uri:string){
    this.router.navigateByUrl('/', {skipLocationChange: true}).then(()=>
    this.router.navigate([uri]));
 }

  login()
  {
    console.log(this.usuario);
    this.usuarioService.login(this.usuario, this.password).subscribe(
      (res: any) =>
      {
        console.log(res);

        this.usuarioService.logueado().subscribe(
          (res: any) =>
          {
            console.log(res);
            if(res.logueado)
            {
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate(['/login']);
            }); 
            }
            else{
              this.error = true;
              this.mensajeError = "Usuario o contraseña incorrectos";
            }
          })
      }
    )
   
  }

  limpiaError()
  {
    this.error = false;
    this.mensajeError = "";
  }
}
