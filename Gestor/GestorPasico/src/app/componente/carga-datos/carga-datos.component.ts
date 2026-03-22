import { Component } from '@angular/core';
import { CargaDatosService } from 'src/app/servicios/carga-datos.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carga-datos',
  imports: [],
  templateUrl: './carga-datos.component.html',
  styleUrl: './carga-datos.component.css',
})
export class CargaDatosComponent {
  formData = new FormData();

  constructor(
    private cargaDatosService: CargaDatosService,
    private router: Router,
  ) {}

  onChange(event: any) {
    const datos: File = event.target.files[0];

    if (datos) {
      this.formData.append('datos', datos);
    }
  }

  peticion_guardar = {
    next: (respuesta: any) => {
      Swal.fire({
        icon: 'success',
        title: 'Inventario guardado',
        text: 'Se han guardados los cambios del inventario',
      }).then(() => {
        this.router
          .navigateByUrl('/', { skipLocationChange: true })
          .then(() => {
            this.router.navigate(['/carga_lote/' + respuesta.lote]);
          });
      });
    },
    error: (respuesta: any) => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Se ha producido un error',
      });
    },
  };

  guardar() {
    this.cargaDatosService
      .cargarDatos(this.formData)
      .subscribe(this.peticion_guardar);
  }
}
