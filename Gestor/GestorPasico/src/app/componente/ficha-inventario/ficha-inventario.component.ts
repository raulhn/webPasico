import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { InventarioService } from 'src/app/servicios/inventario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ficha-inventario',
  templateUrl: './ficha-inventario.component.html',
  styleUrls: ['./ficha-inventario.component.css']
})
export class FichaInventarioComponent implements OnInit{

  nid_inventario: string = "";
  descripcion: string = "";
  cantidad: string = "";
  modelo: string = "";
  num_serie: string = "";
  comentarios: string = "";

  bCargada_ficha: boolean = false;

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
      this.cantidad = respuesta.inventario.cantidad;
      this.modelo = respuesta.inventario.modelo;
      this.num_serie = respuesta.inventario.num_serie;
      this.comentarios = respuesta.inventario.comentarios;

      this.bCargada_ficha = true;
    }
  }

  ngOnInit(): void {
    this.inventarioService.obtener_inventario(this.nid_inventario).subscribe(this.recuperar_inventario)
  }


  peticion_guardar =
  {
    next: (respuesta: any) =>
    {
      Swal.fire({
        icon: 'success',
        title: 'Inventario guardado',
        text: 'Se han guardados los cambios del inventario'
      })
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
    let datos = {nid_inventario: this.nid_inventario, descripcion: this.descripcion, cantidad: this.cantidad, modelo: this.modelo, num_serie: this.num_serie,
                 comentarios: this.comentarios};

    this.inventarioService.registrar_inventario(datos).subscribe(this.peticion_guardar)
  }

  
}
