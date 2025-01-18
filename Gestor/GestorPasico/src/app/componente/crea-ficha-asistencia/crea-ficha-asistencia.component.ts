import { Component, OnInit } from '@angular/core';
import { AsignaturasService } from 'src/app/servicios/asignaturas.service';
import { FichaAsistenciaService } from 'src/app/servicios/fichaasistencia.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-crea-ficha-asistencia',
  templateUrl: './crea-ficha-asistencia.component.html',
  styleUrls: ['./crea-ficha-asistencia.component.css']
})
export class CreaFichaAsistenciaComponent implements OnInit{
  nombre: string = "";
  fecha: string = "";

  lista_asignaturas: any;
  asignatura_seleccionada: string= "";

  constructor(private fichaAsistenciaService: FichaAsistenciaService, private asignaturaService: AsignaturasService)
  {}

  ngOnInit(): void {
    this.asignaturaService.obtener_asignaturas_rol_profesor().subscribe(this.recuperar_asignaturas);
  }

  peticion_crear_ficha =
  {
    next: (respuesta: any) =>
    {
      Swal.fire({
        icon: 'success',
        title: 'Registro correcto',
        text: 'Se ha creado la ficha correctamente'
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

  recuperar_asignaturas =
  {
    next: (respuesta: any) =>
    {
      this.lista_asignaturas = respuesta['asignaturas'];
    }
  }


  crear_ficha_asistencia()
  {
    if(this.asignatura_seleccionada == "0")
    {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Es obligatorio indicar la asignatura',
      })
    }
    else
    {
      this.fichaAsistenciaService.crear_remesa(this.nombre, this.fecha, this.asignatura_seleccionada).subscribe(this.peticion_crear_ficha);
    }
  }
}
