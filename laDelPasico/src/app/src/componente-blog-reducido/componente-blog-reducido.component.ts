import { Component, OnInit, Input } from '@angular/core';
import { ComponenteService } from 'src/app/servicios/componente.service';
import { Constantes } from '../logica/constantes';

@Component({
  selector: 'app-componente-blog-reducido',
  templateUrl: './componente-blog-reducido.component.html',
  styleUrls: ['./componente-blog-reducido.component.css']
})
export class ComponenteBlogReducidoComponent implements OnInit {

  elementos_blog:any[] = [];
  NUM_PAGINAS: number = 6;
  pagina_actual: number = 0;

  constructor(private componenteService: ComponenteService) { }

  @Input() id_componente: string="";
  
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
    let mes = dFecha.getMonth() + 1;
    return dFecha.getDate() + '/' + mes + '/' + dFecha.getFullYear();
  }

  obtiene_paginacion(id_pagina: number)
  {
    return Math.trunc(id_pagina / this.NUM_PAGINAS);
  }

}
