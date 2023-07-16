import { Component } from '@angular/core';
import { AsignaturasService } from 'src/app/servicios/asignaturas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignaturas',
  templateUrl: './asignaturas.component.html',
  styleUrls: ['./asignaturas.component.css']
})
export class AsignaturasComponent {

  constructor(private asignaturasServices: AsignaturasService)
  {

  }

  nueva_asignatura: string = "";



  registro =
  {
    next: (respuesta: any) =>
    {
      Swal.fire({
        icon: 'success',
        title: 'Registro correcto',
        text: 'Se ha registrado correctamente'
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


  addAsignatura()
  {
    //https://sweetalert2.github.io/
    Swal.fire({
      title: 'Crear asignatura',
      html : `<input type="text" id="descripcion_asignatura" class="swal2-input" placeholder="Username">
             `,
      confirmButtonText: 'Crear',
      showCancelButton: true,
      preConfirm: () => {
        this.nueva_asignatura = (<HTMLInputElement>document.getElementById("descripcion_asignatura")).value;
      }
    }).then(
      (results) =>
        {
        if(results.isConfirmed)
        {
          this.asignaturasServices.registrar_asignatura(this.nueva_asignatura).subscribe(this.registro);
        }
      }
    )
   }


}
