import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InventarioService } from 'src/app/servicios/inventario.service';
import Swal from 'sweetalert2';
import { URL } from 'src/app/logica/constantes';

@Component({
    selector: 'app-ficha-inventario',
    templateUrl: './ficha-inventario.component.html',
    styleUrls: ['./ficha-inventario.component.css'],
    standalone: false
})
export class FichaInventarioComponent implements OnInit{

  nid_inventario: string = "";
  descripcion: string = "";
  modelo: string = "";
  num_serie: string = "";
  comentarios: string = "";

  nid_imagen: string = "";

  bCargada_ficha: boolean = false;

  formData = new FormData();

  constructor(private inventarioService: InventarioService, private rutaActiva: ActivatedRoute)
  {
    this.nid_inventario = rutaActiva.snapshot.params['nid_inventario'];
  }

  recuperar_inventario =
  {
    next: (respuesta: any) =>
    {

      this.nid_inventario = respuesta.inventario.nid_inventario;
      this.descripcion = respuesta.inventario.descripcion;
      this.modelo = respuesta.inventario.modelo;
      this.num_serie = respuesta.inventario.num_serie;
      this.comentarios = respuesta.inventario.comentarios;

      this.nid_imagen = respuesta.inventario.nid_imagen;

      this.bCargada_ficha = true;
    }
  }

  ngOnInit(): void {
    this.inventarioService.obtener_inventario(this.nid_inventario).subscribe(this.recuperar_inventario)
  }


  peticion_actualizar_imagen =
  {
    next: (respuesta: any) =>
      {
        Swal.fire({
          icon: 'success',
          title: 'Inventario guardado',
          text: 'Se han guardados los cambios del inventario'
        }).then(
          () => {window.location.reload();}
        )
        
      },
      error: (respuesta: any) =>
      {
        Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Se ha producido un error',
              })
      }
  }

  peticion_guardar =
  {
    next: (respuesta: any) =>
    {
      if (this.formData.has("imagen"))
      {
        this.inventarioService.actualizar_imagen(this.formData).subscribe(this.peticion_actualizar_imagen)
      }
      else{
        Swal.fire({
          icon: 'success',
          title: 'Inventario guardado',
          text: 'Se han guardados los cambios del inventario'
        })
      }
    },
    error: (respuesta: any) =>
    {
      Swal.fire({
              icon: 'error',
              title: 'Oops...',
              text: 'Se ha producido un error',
            })
    }
  }

  guardar()
  {
    let datos = {nid_inventario: this.nid_inventario, descripcion: this.descripcion, modelo: this.modelo, num_serie: this.num_serie,
                 comentarios: this.comentarios};
    
    this.inventarioService.registrar_inventario(datos).subscribe(this.peticion_guardar);
  }


  onChange(event:any)
  {
    const imagen:File =  event.target.files[0];

    if (imagen)
    {
      this.formData.append("imagen", imagen);
      this.formData.append("nid_inventario", this.nid_inventario)
    }
  }

  obtener_url_imagen()
  {
    return URL.URL_SERVICIO + '/imagen/' + this.nid_imagen;
  }
  
}
