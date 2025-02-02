import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InventarioService } from 'src/app/servicios/inventario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crear-ficha-inventario',
  templateUrl: './crear-ficha-inventario.component.html',
  styleUrls: ['./crear-ficha-inventario.component.css']
})
export class CrearFichaInventarioComponent {

    nid_inventario: string = "";
    descripcion: string = "";
    cantidad: string = "";
    modelo: string = "";
    num_serie: string = "";
    comentarios: string = "";
  
  
    constructor(private inventarioService: InventarioService,  private router:Router)
    {

    }
  

  
  
    peticion_guardar =
    {
      next: (respuesta: any) =>
      {
        Swal.fire({
          icon: 'success',
          title: 'Inventario registrado',
          text: 'Se ha registrado el inventario'
        }
        ).then( () =>
            {
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
                {
                  this.router.navigate(['/ficha_inventario/' + respuesta.nid_inventario]);
                }
              )
            }
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
  
    guardar()
    {
      let datos = {nid_inventario: this.nid_inventario, descripcion: this.descripcion, cantidad: this.cantidad, modelo: this.modelo, num_serie: this.num_serie,
                   comentarios: this.comentarios};
  
      this.inventarioService.registrar_inventario(datos).subscribe(this.peticion_guardar)
    }
  
}
