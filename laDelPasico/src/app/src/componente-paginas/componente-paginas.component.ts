import { Component, OnInit, Input } from '@angular/core';
import { ComponenteService } from 'src/app/servicios/componente.service';
import { Paginas_componente } from '../logica/componentes/paginas_componente';
import { faX } from '@fortawesome/free-solid-svg-icons';
import { MenuService } from 'src/app/servicios/menu.service';
import { ifStmt } from '@angular/compiler/src/output/output_ast';
@Component({
  selector: 'app-componente-paginas',
  templateUrl: './componente-paginas.component.html',
  styleUrls: ['./componente-paginas.component.css']
})
export class ComponentePaginasComponent implements OnInit {
  @Input() id_componente: string="";
  pagina_componente: Paginas_componente[] = [];
  url_pagina: String [] = [];
  orden_pagina: number [] = [];
  titulo_pagina: String [] = [];

  faXmark = faX;

  pagina_actual = 0;
  NUM_PAGINAS: number = 10;

  numero_paginas: number = 0;

  constructor(private componenteService: ComponenteService, private menuService: MenuService) { }


  titulo: string = "";
  descripcion: string = "";

  ngOnInit(): void {
    this.componenteService.obtener_paginas_componente(this.id_componente).subscribe(
      (res:any) =>
      {
        this.pagina_componente = res.paginas;
        if (this.pagina_componente.length > 0)
        {
          this.numero_paginas = Math.trunc((this.pagina_componente.length - 1) / this.NUM_PAGINAS);
        }
      
        for(var i = 0; i < this.pagina_componente.length; i++)
        {
          this.orden_pagina[this.pagina_componente[i].nid_pagina] = this.pagina_componente[i].orden;
          console.log(this.pagina_componente[i].nid_pagina);
          this.menuService.obtiene_url(this.pagina_componente[i].nid_pagina).subscribe(
            (res_menu: any) =>
            {
              if(!res_menu.error)
              {
                this.url_pagina[res_menu.id_menu] = res_menu.url;
              }
            }
          );
          this.menuService.obtener_titulo_menu(this.pagina_componente[i].nid_pagina).subscribe(
            (res_titulo: any) =>
            {
              this.titulo_pagina[res_titulo.id] = res_titulo.titulo;
            }
          )
        }
       
      }
    )
  }

 

  obtiene_url_pagina(id_pagina: number)
  {
    return this.url_pagina[id_pagina];
  }

  obtiene_titulo_pagina(id_pagina: number)
  {
    return this.titulo_pagina[id_pagina];
  }

  obtiene_paginacion(id_pagina: number)
  {
    return Math.trunc(this.orden_pagina[id_pagina] / this.NUM_PAGINAS);
  }

  ultima_pagina()
  {
    if (this.pagina_componente.length == 0)
    {
      return 0;
    }
    return Math.trunc((this.pagina_componente.length - 1)/ this.NUM_PAGINAS);
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
    if(this.pagina_actual == 0)
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
    if(this.pagina_actual == 0)
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
    if(this.pagina_actual == 0)
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

  es_par(pagina: Paginas_componente): boolean
  {
    var resultado = pagina.orden % 2;
    return resultado == 0;
  }
}
