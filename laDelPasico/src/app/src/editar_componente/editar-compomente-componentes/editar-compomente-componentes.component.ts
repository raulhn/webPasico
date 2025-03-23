import { Component, OnInit, Input } from '@angular/core';
import { ComponenteComponentesService } from 'src/app/servicios/componente-componentes.service';
import { ComponenteService } from 'src/app/servicios/componente.service';

@Component({
    selector: 'app-editar-compomente-componentes',
    templateUrl: './editar-compomente-componentes.component.html',
    styleUrls: ['./editar-compomente-componentes.component.css'],
    standalone: false
})
export class EditarCompomenteComponentesComponent implements OnInit {
  @Input() id_componente: string="";
  @Input() id_pagina: string="";

  num_componentes_definidos: number = 0;
  componentes: string[] = [];
  tipo_componentes: string[] = [];

  constructor(private componenteComponentesServicie: ComponenteComponentesService, private componenteService: ComponenteService) { }

  ngOnInit(): void {
    this.componenteComponentesServicie.obtiene_num_componente_componentes_definidos(this.id_componente).subscribe(
      (res:any) =>
      {
        this.num_componentes_definidos = res['num_componentes'];

        for(let i=0; i<this.num_componentes_definidos; i++)
        {
          this.componenteComponentesServicie.obtiene_componente_componentes(this.id_componente, i.toString()).subscribe(
            (res:any) =>
            {
              console.log('obtiene_',  res);
              if (!res.existe)
              {
                this.componentes[i] = '-1';
              }
              else{
                this.componentes[i] = res.data.nid_componente_hijo;
                this.tipo_componentes[i] = res.tipo_componente;
                
                console.log(this.componentes[i]);
                console.log('Existe');
              }
            }
          )
        }
    }
    );
  }

  contador_componentes_definidos()
  {
    return new Array(this.num_componentes_definidos);
  }
}
