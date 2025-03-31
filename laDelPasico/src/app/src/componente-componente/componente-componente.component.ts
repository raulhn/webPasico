import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { ComponenteService } from 'src/app/servicios/componente.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';
import { Componente_texto } from '../logica/componentes/componente_texto';
import { faFloppyDisk, faPen, faX, faArrowDown, faArrowUp } from '@fortawesome/free-solid-svg-icons';
import { EditarComponenteTextoComponent } from '../editar_componente/editar-componente-texto/editar-componente-texto.component';

//https://sweetalert2.github.io/#declarative-templates
import Swal from 'sweetalert2';
import { EditarComponenteImagenComponent } from '../editar_componente/editar-componente-imagen/editar-componente-imagen.component';
import { Constantes } from '../logica/constantes';



@Component({
    selector: 'app-componente-componente',
    templateUrl: './componente-componente.component.html',
    styleUrls: ['./componente-componente.component.css'],
    standalone: false
})
export class ComponenteComponenteComponent implements OnInit {
  @Input() id_componente: string="";
  @ViewChild('instancia_texto') instancia_texto!: EditarComponenteTextoComponent;

  @ViewChild('instancia_imagen') instancia_imagen!: EditarComponenteImagenComponent;

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


  constructor(private componenteService: ComponenteService, private usuarioService: UsuariosService) {
      this.componente_texto.nid = -1;
      this.componente_texto.cTexto = '';

     
   }

  observer_texto = {
    next: (res:any) =>
    {
      if(!res.error)
      {
        this.componente_texto = res.componente;  
      }
    }
  }

  observer_eliminar = {
    next: (res:any) =>
    {
   
      if(!res.error)
      {

        window.location.reload();
      }
    }
  }

  obtiene_componente_texto()
  {
    this.componenteService.componente_texto(this.id_componente).subscribe(this.observer_texto);
  }
  
  observer = {
    complete: ()=>{},
    error: (err : Error)=>{},
    next: (res: any) => {
                   
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

    this.componenteService.tipo_componente(this.id_componente).subscribe(this.observer);

  
    this.usuarioService.logueado().subscribe(respuesta => {
      
      if (respuesta.logueado)
      {
        this.esLogueado = true;

      }
     });

    
     this.usuarioService.logueado_administrador().subscribe((res) =>{

      this.esAdministrador = res.administrador;
    });

    
  }

  guardar()
  {
    if(this.tipo == Constantes.TipoComponente.TEXTO)
    {
      this.instancia_texto.guardar();
      this.componente_texto.cTexto = this.instancia_texto.htmlContent;
      this.modo_edicion = false;
    }
    else if(this.tipo = Constantes.TipoComponente.IMAGEN)
    {
      this.instancia_imagen.guardar();
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
  
         this.componenteService.eliminar_componente_componentes(this.id_componente).subscribe(this.observer_eliminar);
    
      } 
    })
  }





}
