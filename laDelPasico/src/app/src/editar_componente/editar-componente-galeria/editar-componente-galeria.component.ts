import { Component, OnInit, Input } from '@angular/core';
import { ComponenteService } from 'src/app/servicios/componente.service';
import { faCirclePlus, faFloppyDisk, faX } from '@fortawesome/free-solid-svg-icons';
import { Constantes } from '../../logica/constantes';


@Component({
  selector: 'app-editar-componente-galeria',
  templateUrl: './editar-componente-galeria.component.html',
  styleUrls: ['./editar-componente-galeria.component.css']
})
export class EditarComponenteGaleriaComponent implements OnInit {
  @Input() id_componente:string ="";
  imagenes: string[] = [];

  nuevoTitulo: string = "";

  faAdd = faCirclePlus;
  faXmark = faX;


  modoNueva: boolean = false;
  bPendienteSubir: boolean = false;

  constructor(private componenteService: ComponenteService) { }

  items: any[] = [];

  imagenesArchivos:File[] = [];

  ngOnInit(): void {
    this.componenteService.obtiene_imagenes_galeria(this.id_componente).subscribe(
      (res:any) =>
      {
        if (!res.error)
        {
        
          for(let i=0; i<res['imagenes'].length; i++)
          {
            this.imagenes[i] =  res['imagenes'][i]['nid_imagen'];
 
          }
        }
      }
    )
  }


  obtiene_url_imagen(id: string): string
  {
    return  Constantes.General.URL_BACKED + "/imagen_url/" + id;
  }

  add()
  {
    if(this.modoNueva)
    {
      this.modoNueva = false;
    }
    else{
      this.modoNueva = true;
    }
  }

   guardar()
  {
    if(this.bPendienteSubir)
    {
      for (var i=0; i < this.imagenesArchivos.length; i++)
      {
        var iteraciones = 1;
        var formData = new FormData();
        formData.append("imagen", this.imagenesArchivos[i]);
        formData.append("id_componente", this.id_componente);
        formData.append("titulo", this.nuevoTitulo + "_" + i);

        this.componenteService.add_imagen_galeria(formData).subscribe(
          (res: any) =>
          {
            iteraciones = iteraciones + 1;
            if(!res.error && iteraciones == this.imagenesArchivos.length)
            {
              setTimeout(() => {window.location.reload();}, 1000);
            }
          }
        );
      }
      
      ;
    }
  }

  eliminar(id_imagen: string)
  {
    console.log('eliminar');
    this.componenteService.eliminar_imagen_galeria(this.id_componente, id_imagen).subscribe(
      (res: any) =>
      {
        console.log(res);
        
        if(!res.error)
        {
         window.location.reload();
        }
      }
    )
  }
  
  onChange(event:any)
  {
    this.imagenesArchivos = event.target.files;

    this.imagenesArchivos.length;

    if(this.imagenesArchivos.length > 0)
    {
      this.bPendienteSubir = true;
    }
    /*
    const imagen:File =  event.target.files[0];
    if(imagen)
    {
      this.bPendienteSubir = true;
      this.formData.append("imagen", imagen);
      this.formData.append("id_componente", this.id_componente);
      this.formData.append("titulo", this.nuevoTitulo);
    }*/
  }
}
