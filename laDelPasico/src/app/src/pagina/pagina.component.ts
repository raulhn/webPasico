import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ComponenteService } from 'src/app/servicios/componente.service';
import { of } from 'rxjs';

import { Title } from '@angular/platform-browser';

import { Pagina_componente } from '../logica/componentes/pagina_componente';
import { Menu } from '../logica/menu';
import { MenuService } from 'src/app/servicios/menu.service';

@Component({
  selector: 'app-pagina',
  templateUrl: './pagina.component.html',
  styleUrls: ['./pagina.component.css']
})
export class PaginaComponent implements OnInit {
  
  id_pagina: string= "";

  pagina_componentes: Pagina_componente[] = [];
  titulo: string = "";
  
  observer = {
    next: (res: any) => 
      {console.log(res)
          this.pagina_componentes = res.data;
          console.log(this.pagina_componentes);
      }
  };

  constructor(private rutaActiva: ActivatedRoute, 
              private componenteServicio: ComponenteService,
              private menuService: MenuService,
              private titleService: Title) {
      this.id_pagina = rutaActiva.snapshot.params['id'];
   
  }

  ngOnInit(): void {
    this.componenteServicio.obtener_componentes(this.id_pagina).subscribe(this.observer);
    this.menuService.obtener_titulo_menu(Number(this.id_pagina)).subscribe((res:any) => {console.log('Titulo'); console.log(res.titulo); this.titulo = res.titulo
    this.titleService.setTitle("Banda del Pasico | " +this.titulo);});

  }

}
