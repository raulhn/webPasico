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
  bCargadas_fichas_asistencias: boolean = false;

  lista_ficha_asistencias: any;

  bTipo_creacion: string = "";

  ficha_seleccionada: string= "";

  constructor(private fichaAsistenciaService: FichaAsistenciaService, private asignaturaService: AsignaturasService)
  {}

  ngOnInit(): void {
    this.asignaturaService.obtener_asignaturas_rol_profesor().subscribe(this.recuperar_asignaturas);
    this.fichaAsistenciaService.obtener_fichas_asistencias().subscribe(this.recuperar_fichas_asistencias)
  }

  recuperar_fichas_asistencias =
  {
    next: (respuesta: any) =>
    {
      this.lista_ficha_asistencias = respuesta['fichas_asistencias'];
      this.bCargadas_fichas_asistencias = true;
    }
  }

  compare_ficha(item: any, selected: any) {
    return item['nid_ficha_asistencia'] == selected;
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
      if (this.bTipo_creacion == 'N')
      {
        this.fichaAsistenciaService.crear_ficha(this.nombre, this.fecha, this.asignatura_seleccionada).subscribe(this.peticion_crear_ficha);
      }
      else{
        this.fichaAsistenciaService.copiar_ficha(this.nombre, this.fecha, this.ficha_seleccionada).subscribe(this.peticion_crear_ficha);
      }
    }
  }
}
