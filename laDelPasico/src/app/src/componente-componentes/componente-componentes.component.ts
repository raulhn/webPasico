import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ComponenteComponentesService } from 'src/app/servicios/componente-componentes.service';

@Component({
    selector: 'app-componente-componentes',
    templateUrl: './componente-componentes.component.html',
    styleUrls: ['./componente-componentes.component.css'],
    standalone: false
})
export class ComponenteComponentesComponent implements OnInit {

  @Input() id_componente: string="";
  
  esLogueado: boolean = false;
  esAdministrador: boolean = false;

  num_componentes_definidos: number = 0;
  componentes: string[] = [];
  tipo_componentes: string[] = [];

  bCargado: Promise<boolean>|null = null;

  nContador_cargados: number = 0;

  constructor(private componenteComponentesServicie: ComponenteComponentesService) {


     
  }

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
              }
              this.nContador_cargados++; 
              if (this.nContador_cargados == this.num_componentes_definidos)
              {
                this.bCargado = Promise.resolve(true);
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
