import { Component, Input, OnInit, ViewChild, Pipe, PipeTransform } from '@angular/core';
import { ComponenteService } from 'src/app/servicios/componente.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Componente_texto } from '../logica/componentes/componente_texto';
import { faFloppyDisk, faPen, faX, faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { EditarComponenteTextoComponent } from '../editar_componente/editar-componente-texto/editar-componente-texto.component';

//https://sweetalert2.github.io/#declarative-templates
import Swal from 'sweetalert2';
import { EditarComponenteImagenComponent } from '../editar_componente/editar-componente-imagen/editar-componente-imagen.component';
import { Constantes } from '../logica/constantes';

import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import { EditarComponenteGaleriaComponent } from '../editar_componente/editar-componente-galeria/editar-componente-galeria.component';
import { EditarComponentePaginasComponent } from '../editar_componente/editar-componente-paginas/editar-componente-paginas.component';

@Component({
  selector: 'app-componente',
  templateUrl: './componente.component.html',
  styleUrls: ['./componente.component.css']
})

export class ComponenteComponent implements OnInit {
  @Input() id: string="";
  @Input() id_pagina: string="";

  @ViewChild('instancia_texto') instancia_texto!: EditarComponenteTextoComponent;

  @ViewChild('instancia_imagen') instancia_imagen!: EditarComponenteImagenComponent;

  @ViewChild('instancia_galeria') instancia_galeria!: EditarComponenteGaleriaComponent;

  @ViewChild('instancia_paginas') instancia_paginas!: EditarComponentePaginasComponent;

 
  faPen = faPen;
  faXmark = faX;
  faSave = faFloppyDisk;

  faArrowDown = faArrowDown;
  faArrowUp = faArrowUp;

  esLogueado: boolean = false;
  esAdministrador: boolean = false;

  tipo: string = "-1";
  modo_edicion: boolean = false; 
  componente_texto: Componente_texto = new Componente_texto();

  numero_componentes_pagina: number = -1;
  orden: number = 0;

  bCargadoTexto: Promise<boolean>|null = null;


  constructor(private componenteService: ComponenteService, private usuarioService: UsuariosService, private sanitizer: DomSanitizer) {
      this.componente_texto.nid = -1;
      this.componente_texto.cTexto = '';

     
   }



  observer_texto = {
    next: (res:any) =>
    {
      if(!res.error)
      {
     
        this.componente_texto = res.componente;  
        console.log(res);
     
       
      }
    }
  }

  observer_eliminar = {
    next: (res:any) =>
    {
      console.log(res);
      if(!res.error)
      {
        console.log('Componente eliminado');
        window.location.reload();
      }
    }
  }

  obtiene_componente_texto()
  {
    this.componenteService.componente_texto(this.id).subscribe(this.observer_texto);

    this.bCargadoTexto = Promise.resolve(true);
  }
  
  observer = {
    complete: ()=>{},
    error: (err : Error)=>{console.log('Peazo Error: ' + err); },
    next: (res: any) => {
                        console.log(res); 
                        if (!res['error'])
                        {
                          this.tipo = res['nTipo'];
                          if (this.tipo == Constantes.TipoComponente.TEXTO)
                          {
                            this.obtiene_componente_texto();
                            
                          }
                        }
                       }
  };


  activa_edicion(): void
  {
    this.modo_edicion = true;
  }

  cancelar_edicion()
  {
    this.modo_edicion = false;
  }

  ngOnInit(): void {
    this.componenteService.obtiene_numero_componentes(this.id_pagina).subscribe((res:any) => {this.numero_componentes_pagina = res.numero});
    this.componenteService.obtiene_orden(this.id_pagina, this.id).subscribe((res:any) => {console.log('Orden ' + res.orden); this.orden = res.orden});

    this.componenteService.tipo_componente(this.id).subscribe(this.observer);

    this.usuarioService.logueado().subscribe(respuesta => {
      
      if (respuesta.logueado)
      {
        this.esLogueado = true;
        console.log(respuesta.usuario);
      }
     });

    
     this.usuarioService.logueado_administrador().subscribe((res) =>{

      console.log(res);
      this.esAdministrador = res.administrador;
    });

    
  }

  guardar()
  {
    console.log("Tipo " + this.tipo);
    if(this.tipo == Constantes.TipoComponente.TEXTO)
    {
      this.instancia_texto.guardar();
      this.componente_texto.cTexto = this.instancia_texto.htmlContent;
      this.modo_edicion = false;
    }
    else if(this.tipo == Constantes.TipoComponente.IMAGEN)
    {
      this.instancia_imagen.guardar();
    }
    else if(this.tipo == Constantes.TipoComponente.GALERIA)
    {
      this.instancia_galeria.guardar();
    }
    else if(this.tipo == Constantes.TipoComponente.PAGINAS)
    {

      this.instancia_paginas.guardar(this.id_pagina);
    }
  }

  eliminar()
  {
    Swal.fire({
      title: 'Aviso',
      text: '¿Esta seguro de eliminar el componente?',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        console.log('Eliminar');

        this.componenteService.eliminar_componente(this.id_pagina, this.id).subscribe(this.observer_eliminar);
       
      } 
    })
  }

  incrementa_orden()
  {
    this.componenteService.incrementa_orden(this.id_pagina, this.id).subscribe(() => {window.location.reload();});
  }

  decrementa_orden()
  {
    this.componenteService.decrementa_orden(this.id_pagina, this.id).subscribe(() => {window.location.reload();});
  }

  transform()
  {
    return this.sanitizer.bypassSecurityTrustHtml(this.componente_texto.cTexto);
  }
}
