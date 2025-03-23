import { Component,  Input, OnInit } from '@angular/core';

import { faCirclePlus, faFloppyDisk, faX } from '@fortawesome/free-solid-svg-icons';
import { ComponenteService } from 'src/app/servicios/componente.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Constantes } from '../../logica/constantes';

@Component({
    selector: 'app-nuevo-componente-componentes',
    templateUrl: './nuevo-componente-componentes.component.html',
    styleUrls: ['./nuevo-componente-componentes.component.css'],
    standalone: false
})
export class NuevoComponenteComponentesComponent implements OnInit {

  @Input() id_componente: string="";
  @Input() nOrden: string="";

  faAdd = faCirclePlus;
  faXmark = faX;

  insert: boolean = false;
  faSave = faFloppyDisk;

  esAdministrador: boolean = false;

  desplegable: string = "";

  // Componente imagen
  titulo_imagen: string = "";

  // Componente de componentes
  num_columnas: string = "";

  // Componente de video
  url: string = "";

  constructor(private usuarioService: UsuariosService, private componenteService: ComponenteService) { }

  ngOnInit(): void {
    this.usuarioService.logueado_administrador().subscribe((res) =>{
      console.log('Admin');
      console.log("nOrden " + this.nOrden);
      console.log(res);
      this.esAdministrador = res.administrador;
    });
  }

  add()
  {
    this.insert = true;
  }

  cancelar()
  {
    this.insert = false;
  }

  guardar()
  {

    if (this.desplegable == Constantes.TipoComponente.TEXTO)
    {
      this.componenteService.crear_componente_componentes_texto(this.id_componente, this.desplegable, this.nOrden).subscribe((res) =>
      {
        window.location.reload();
      });
    }
    else if(this.desplegable == Constantes.TipoComponente.IMAGEN)
    {
      this.componenteService.crear_componente_componentes_imagen(this.id_componente, this.desplegable, this.titulo_imagen, this.nOrden).subscribe(
        (res) =>
        {
          window.location.reload();
        }
      )
    }
    else if(this.desplegable == Constantes.TipoComponente.COMPONENTES)
    {
      this.componenteService.crear_componente_componentes_componentes(this.id_componente, this.desplegable, this.num_columnas, this.nOrden).subscribe(
        (res) =>
        {
          window.location.reload();
        }
      )
    }
    else if(this.desplegable == Constantes.TipoComponente.VIDEO)
    {
      this.componenteService.crear_componente_componentes_video(this.id_componente, this.desplegable, this.url, this.nOrden).subscribe(
        (res) =>
        {
          window.location.reload();
        }
      )
    }
  }

}
