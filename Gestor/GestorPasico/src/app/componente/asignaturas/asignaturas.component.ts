import {
  Component,
  OnInit,
  signal,
  WritableSignal,
  Signal,
} from '@angular/core';
import { AsignaturasService } from 'src/app/servicios/asignaturas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignaturas',
  templateUrl: './asignaturas.component.html',
  styleUrls: ['./asignaturas.component.css'],
  standalone: false,
})
export class AsignaturasComponent implements OnInit {
  message: string = '';
  asignatura_seleccionada: any = '';

  bSelecionada_asignatura: boolean = false;

  nueva_asignatura: string = '';

  constructor(private asignaturasServices: AsignaturasService) {}

  $asignaturas: WritableSignal<any[]> = signal([]);
  cabeceras_asignaturas: any[] = [{ title: 'Asignatura', data: 'descripcion' }];
  $id_tabla_asignaturas: Signal<string> = signal('tabla_asignaturas');

  refrescar_asignaturas = {
    next: (respuesta: any) => {
      this.$asignaturas.set(respuesta.asignaturas);
    },
  };

  recuperar_asignaturas = {
    next: (respuesta: any) => {
      this.$asignaturas.set(respuesta.asignaturas);
    },
  };

  click_asignatura(asignatura_marcada: any) {
    this.asignatura_seleccionada = asignatura_marcada;
    this.bSelecionada_asignatura = true;
  }

  ngOnInit(): void {
    this.asignaturasServices
      .obtener_asignaturas()
      .subscribe(this.recuperar_asignaturas);
  }

  registro = {
    next: (respuesta: any) => {
      Swal.fire({
        icon: 'success',
        title: 'Registro correcto',
        text: 'Se ha registrado correctamente',
      });
      this.asignaturasServices
        .obtener_asignaturas()
        .subscribe(this.refrescar_asignaturas);
    },
    error: (respuesta: any) => {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Se ha producido un error',
      });
    },
  };

  url_ficha_asignatura() {
    return '/ficha_asignatura/' + this.asignatura_seleccionada.nid;
  }

  addAsignatura() {
    //https://sweetalert2.github.io/
    Swal.fire({
      title: 'Crear asignatura',
      html: `<input type="text" id="nombre_asignatura" class="swal2-input" placeholder="Username">
             `,
      confirmButtonText: 'Crear',
      showCancelButton: true,
      preConfirm: () => {
        this.nueva_asignatura = (<HTMLInputElement>(
          document.getElementById('nombre_asignatura')
        )).value;
      },
    }).then((results: any) => {
      if (results.isConfirmed) {
        this.asignaturasServices
          .registrar_asignatura(this.nueva_asignatura)
          .subscribe(this.registro);
      }
    });
  }
}
