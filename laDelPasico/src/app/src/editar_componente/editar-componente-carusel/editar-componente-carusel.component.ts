import { Component, OnInit, Input } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { faX, faCirclePlus} from '@fortawesome/free-solid-svg-icons';
import { ComponenteService } from 'src/app/servicios/componente.service';
import { Constantes } from '../../logica/constantes';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-componente-carusel',
  templateUrl: './editar-componente-carusel.component.html',
  styleUrls: ['./editar-componente-carusel.component.css']
})
export class EditarComponenteCaruselComponent implements OnInit {
  
  @Input() id_componente: string="";

  faXmark = faX;
  faAdd = faCirclePlus;

  titulo: string = "";
  imagenesArchivos:File[] = [];
  bPendienteSubir: boolean = false;

  imagenes:any [] = [];

  elementos_simultaneos: number = 1;
  elementos_simultaneos_original: number = 1;

  customOptions: OwlOptions = {
      loop: true,
      mouseDrag: true,
      touchDrag: true,
      pullDrag: false,
      dots: true,
      margin:10,
      autoplay: true,
      autoWidth:true,
      navSpeed: 700,
      merge:true,
      
      responsive: {
        0: {
          items: 1
        },
        600: {
          items: 3
        }
      },
      nav: false
    }

  inicializa_carrusel = {
    next: (respuesta: any) =>
    {
      this.elementos_simultaneos = respuesta["componente_carusel"][0]["elementos_simultaneos"];
      this.elementos_simultaneos_original = this.elementos_simultaneos;
      this.imagenes = respuesta["elementos_carusel"];
      this.customOptions = {
              loop: true,
              mouseDrag: true,
              touchDrag: true,
              pullDrag: false,
              dots: true,
              margin:10,
              autoplay: true,
              autoWidth:true,
              navSpeed: 700,
              merge:true,
              
              responsive: {
                0: {
                  items: 1
                },
                600: {
                  items: this.elementos_simultaneos
                }
              },
              nav: false
            }
    }
    ,
    error: () =>
    {
      console.log('Error');
    }
  }
    
  constructor(private componentService: ComponenteService) { }

  ngOnInit(): void {
      this.componentService.obtener_carrusel(this.id_componente).subscribe(
        this.inicializa_carrusel
      )
  }

  
  obtiene_url_imagen(id: string): string
  {
    return  Constantes.General.URL_BACKED + "/imagen_url/" + id;
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
    console.log(this.bPendienteSubir)
    console.log(this.imagenesArchivos.length)
    if (this.bPendienteSubir && this.imagenesArchivos.length > 0)
    {
      var formData = new FormData();
      console.log(this.imagenesArchivos[0])
      formData.append("imagen", this.imagenesArchivos[0]);
      formData.append("id_componente", this.id_componente);
      formData.append("titulo", this.titulo);

      this.componentService.add_elemento_carrusel(formData).subscribe(
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

  guardar()
  {
    this.componentService.actualizar_elementos_simultaneos(this.id_componente, this.elementos_simultaneos).subscribe(
      (res: any) =>
      {
        console.log(res)
        if(!res.error)
        {
          this.customOptions = {
            loop: true,
            mouseDrag: true,
            touchDrag: true,
            pullDrag: false,
            dots: true,
            margin:10,
            autoplay: true,
            autoWidth:true,
            navSpeed: 700,
            merge:true,
            
            responsive: {
              0: {
                items: 1
              },
              600: {
                items: this.elementos_simultaneos
              }
            },
            nav: false
          }
          setTimeout(() => {window.location.reload();}, 1000);
        }
      }
    )
  }

  eliminar(id_imagen: string)
  {
    Swal.fire({
      title: 'Aviso',
      text: '¿Esta seguro de eliminar este elemento?',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'No'
    }).then((result) => {
      /* Read more about isConfirmed, isDenied below */
      if (result.isConfirmed) {
        this.componentService.eliminar_elemento_carrusel(this.id_componente, id_imagen).subscribe(
          (res:any) =>
          {
            if(!res.error)
            {
              window.location.reload();
            }
          }
        );
      } 
    })

  }
}
