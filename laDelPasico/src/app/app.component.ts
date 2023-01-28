import { Component, OnInit} from '@angular/core';
import { UsuariosService } from './servicios/usuarios.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit{
  title = 'Banda del Pasico';
  usuario: any;
  nombreUsuario: string = '';

  usuarioService: UsuariosService;
  constructor(usuarioService: UsuariosService) {
    this.usuarioService = usuarioService;
  }

  ngOnInit()
  {

  }
 
}
