
import { Component,  Input, OnInit } from '@angular/core';

import { faCirclePlus, faFloppyDisk, faX } from '@fortawesome/free-solid-svg-icons';
import { ComponenteService } from 'src/app/servicios/componente.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Constantes } from '../../logica/constantes';


@Component({
    selector: 'app-nuevo-componente',
    templateUrl: './nuevo-componente.component.html',
    styleUrls: ['./nuevo-componente.component.css'],
    standalone: false
})
export class NuevoComponenteComponent implements OnInit {

  @Input() id_pagina: string="";

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
  url: string ="";

  // Componente de galeria
  titulo_galeria: string = "";
  descripcion_galeria: string = ";"

  // Componente de paginas
  titulo_paginas: string = "";

  // Componente de carusel
  elementos_simultaneos: string = "";

  // Componente de blog
  titulo_blog: string = "";
  fecha: string = "";

  constructor(private usuarioService: UsuariosService, private componenteService: ComponenteService) { }

  ngOnInit(): void {
    this.usuarioService.logueado_administrador().subscribe((res) =>{

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
      this.componenteService.crear_componente(this.id_pagina, this.desplegable).subscribe((res) =>
      {
        window.location.reload();
      });
    }
    else if(this.desplegable == Constantes.TipoComponente.IMAGEN)
    {
      this.componenteService.crear_componente_imagen(this.id_pagina, this.desplegable, this.titulo_imagen).subscribe(
        (res) =>
        {
          window.location.reload();
        }
      )
    }
    else if(this.desplegable == Constantes.TipoComponente.COMPONENTES)
    {
      this.componenteService.crear_componente_componentes(this.id_pagina, this.desplegable, this.num_columnas).subscribe(
        (res) =>
        {
          window.location.reload();
        }
      )
    }
    else if(this.desplegable == Constantes.TipoComponente.VIDEO)
    {
      this.componenteService.crear_componente_video(this.id_pagina, this.desplegable, this.url).subscribe(
      (res) =>
      {
        window.location.reload();
      }
      )
    }
    else if(this.desplegable == Constantes.TipoComponente.GALERIA)
    {
      this.componenteService.crear_componente_galeria(this.id_pagina, this.desplegable, this.titulo_galeria, this.descripcion_galeria).subscribe(
        (res) =>
        {
          window.location.reload();
        }
      )
    }
    else if(this.desplegable == Constantes.TipoComponente.PAGINAS)
    {
      this.componenteService.crear_componente_paginas(this.id_pagina, this.desplegable, this.titulo_paginas).subscribe(
        (res) =>
        {
          window.location.reload();
        }
      )
    }
    else if(this.desplegable == Constantes.TipoComponente.CARUSEL)
    {
      this.componenteService.crear_componente_carusel(this.id_pagina, this.desplegable, this.elementos_simultaneos).subscribe(
        (res) =>
        {

          window.location.reload();
        }
      )
    }
    else if(this.desplegable == Constantes.TipoComponente.BLOG)
    {
      this.componenteService.crear_componente_blog(this.id_pagina, this.desplegable).subscribe(
        (res: any) =>
        {
          window.location.reload();
        }
      )
    }

  }

}
