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

  ngOnInit(): void {
    this.componenteService.obtener_elemento_blog(this.id_componente).subscribe(
      (res: any) =>
      {
        if(!res.error)
        {
          this.elementos_blog = res.componente_blog;
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

}
