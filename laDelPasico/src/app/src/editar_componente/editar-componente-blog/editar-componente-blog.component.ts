import { Component, OnInit, Input } from '@angular/core';
import { faX, faCirclePlus} from '@fortawesome/free-solid-svg-icons';
import { ComponenteService } from 'src/app/servicios/componente.service';
import { Constantes } from '../../logica/constantes';

@Component({
  selector: 'app-editar-componente-blog',
  templateUrl: './editar-componente-blog.component.html',
  styleUrls: ['./editar-componente-blog.component.css']
})
export class EditarComponenteBlogComponent implements OnInit {

  @Input() id_componente: string="";
  
  constructor(private componenteService: ComponenteService) { }

  faXmark = faX;
  faAdd = faCirclePlus;

  titulo: string = "";
  fecha: string = "";
  descripcion: string= "";
  imagenesArchivos:File[] = [];
  bPendienteSubir: boolean = false;

  elementos_blog:any[] = [];

  pagina_actual = 0;
  NUM_PAGINAS: number = 6;

  numero_paginas: number = 0;

  bError: boolean = false;
  mensaje_error: string = "";

  ngOnInit(): void {
    this.componenteService.obtener_elemento_blog(this.id_componente).subscribe(
      (res: any) =>
      {
        if(!res.error)
        {
          this.elementos_blog = res.componente_blog;
          this.numero_paginas = Math.trunc((this.elementos_blog.length - 1) / this.NUM_PAGINAS);
        }
      }

    )
  }

  obtiene_url_imagen(id: string): string
  {
    return  Constantes.General.URL_BACKED + "/imagen_url/" + id;
  }

  obtiene_url_pagina(id: string): string{
    return Constantes.General.URL_FRONTED + "/general/" + id;
  }

  obtiene_fecha(fecha: string)
  {
    let dFecha = new Date(fecha);
    return dFecha.getDate() + '/' + dFecha.getMonth() + '/' + dFecha.getFullYear();
  }

  cargar_imagen(event:any)
  {
    this.imagenesArchivos = event.target.files;

    this.imagenesArchivos.length;

    if(this.imagenesArchivos.length > 0)
    {
      this.bPendienteSubir = true;
    }
  }

  crear_elemento()
  {

    if (this.bPendienteSubir && this.imagenesArchivos.length > 0)
    {
      var formData = new FormData();
      console.log(this.imagenesArchivos[0])
      formData.append("imagen", this.imagenesArchivos[0]);
      formData.append("id_componente", this.id_componente);
      formData.append("titulo", this.titulo);
      formData.append("fecha", this.fecha);
      formData.append("descripcion", this.descripcion)

      this.componenteService.add_elemento_blog(formData).subscribe(
        (res: any) =>
        {
          console.log(res);
          if(!res.error)
          {
            setTimeout(() => {window.location.reload();}, 1000);
          }
        }
      )
    }
  }

  eliminar(id_imagen: string, id_menu: string)
  {
    this.componenteService.eliminar_elemento_blog(this.id_componente, id_imagen, id_menu).subscribe(
      {
      next: (res: any) =>
      {
        console.log(res);
        if(!res.error)
        {
          window.location.reload();
        }
      },
      error: (res) =>
      {
        if(res.error)
        {
          this.bError = true;
          console.log(res.error.info)
          this.mensaje_error = 'Error ' + res.error.info;
        }
      }

    },

    )
  }

  ultima_pagina()
  {
    if (this.elementos_blog.length == 0)
    {
      return 1;
    }
    return Math.trunc((this.elementos_blog.length - 1)/ this.NUM_PAGINAS) ;
  }


  pagina(num_pagina: number)
  {
    this.pagina_actual = num_pagina - 1;  
  }

  pagina_primera()
  {
    this.pagina_actual = 0;
  }

  pagina_ultima()
  {
    this.pagina_actual = this.ultima_pagina();
  }

  prev_pagina():number
  {
    if(this.pagina_actual == 0 || this.pagina_actual == 1)
    {
      return 1;
    }
    else if(this.pagina_actual  == this.ultima_pagina())
    {
      return this.pagina_actual - 1;
    }
    return this.pagina_actual;
  }

  cent_pagina():number
  {
    if(this.pagina_actual == 0 || this.pagina_actual == 1)
    {
      return  2;
    }
    else if(this.pagina_actual == this.ultima_pagina())
    {
      return this.pagina_actual;
    }
    return this.pagina_actual + 1;
  }
  
  post_pagina():number
  {
    if(this.pagina_actual == 0 || this.pagina_actual == 1)
    {
      return 3;
    }
    else if(this.pagina_actual  == this.ultima_pagina())
    {
      return this.pagina_actual + 1 ;
    }
    return this.pagina_actual + 2;
  }

  es_ultima():boolean
  {
    return this.ultima_pagina() == this.pagina_actual;
  }

  es_primera():boolean
  {
    return this.pagina_actual == 0;
  }

  obtiene_paginacion(id_pagina: number)
  {
    return Math.trunc(id_pagina / this.NUM_PAGINAS);
  }
}
