import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FichaAsistenciaService } from 'src/app/servicios/fichaasistencia.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ficha-asistencia',
  templateUrl: './ficha-asistencia.component.html',
  styleUrls: ['./ficha-asistencia.component.css']
})
export class FichaAsistenciaComponent implements OnInit{

  nid_ficha_asistencia: string = "";
  ficha_asistencia: any;
  bCargada_ficha: boolean  = false;

  lista_alumnos: any;
  bCargados_alumnos: boolean = false;
  alumno_seleccionado: string = "";

  lista_ficha_asistencia_alumno: any;
  bCargadas_fichas: boolean = false;

  constructor(private router: Router, private rutaActiva: ActivatedRoute, private fichaAsistenciaService: FichaAsistenciaService)
  {
    this.nid_ficha_asistencia = rutaActiva.snapshot.params['nid_ficha_asistencia'];
  }

  recupera_fichas_asistencias_alumno =
  {
    next: (respuesta: any) =>
    { 
      this.lista_ficha_asistencia_alumno = respuesta['fichas_asistencias_alumno'];
      this.bCargadas_fichas = true;
    }
  }

  recupera_alumnos =
  {
    next: (respuesta: any) =>
    {
      this.lista_alumnos = respuesta['alumnos_seleccion'];
      this.bCargados_alumnos = true;
    }
  }

  recupera_ficha_asistencia = 
  {
    next: (respuesta: any) =>
    {
      this.ficha_asistencia = respuesta['ficha_asistencia'][0];
      this.bCargada_ficha = true;
    }
  }

  ngOnInit(): void {
    this.fichaAsistenciaService.obtener_alumnos_ficha_seleccion(this.nid_ficha_asistencia).subscribe(this.recupera_alumnos);
    this.fichaAsistenciaService.obtener_fichas_asistencias_alumnos(this.nid_ficha_asistencia).subscribe(this.recupera_fichas_asistencias_alumno);
    this.fichaAsistenciaService.obtener_ficha_asistencia(this.nid_ficha_asistencia).subscribe(this.recupera_ficha_asistencia);
  }



  compare_alumno(item: any, selected: any) {
    return item['nid'] == selected;
  }

  peticion_registrar_ficha_alumno =
  {
    next: (respuesta: any) =>
    {
      Swal.fire({
        icon: 'success',
        title: 'Registro correcto',
        text: 'Se ha registrado correctamente'
      }).then(
        () => { 
         window.location.reload(); }
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

  peticion_eliminar_ficha_alumno =
  {
    next: (respuesta: any) =>
    {
      Swal.fire({
        icon: 'success',
        title: 'Eliminación corrrecta',
        text: 'Se ha eliminado correctamente'
      }).then(
       () => { 
        window.location.reload(); }
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

  registrar_ficha_alumno()
  {
    this.fichaAsistenciaService.registrar_ficha_asistencia_alumno(this.nid_ficha_asistencia, this.alumno_seleccionado).subscribe(this.peticion_registrar_ficha_alumno)
  }

  eliminar_ficha_asistencia_alumno(nid_ficha_asistencia_alumno: string)
  {

      Swal.fire(
        {
          title: 'Quitar alumno',
          text: 'Se eliminará el alumno de la ficha',
          confirmButtonText: 'Eliminar',
          showCancelButton: true
        }
      ).then(
        (results: any) =>
        {
          if(results.isConfirmed)
          {
            this.fichaAsistenciaService.eliminar_ficha_asistencia_alumno(nid_ficha_asistencia_alumno).subscribe(this.peticion_eliminar_ficha_alumno);
          }
        }
      )
      
  }

  peticion_actualiza_ficha_asistencia_alumno =
  {
    next: (respuesta: any) =>
    {
      Swal.fire({
        icon: 'success',
        title: 'Actualización correcta',
        text: 'Se ha actualizado correctamente'
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

  actualizar_ficha_asistencia_alumno()
  {
    this.fichaAsistenciaService.actualizar_ficha_asistencia_alumnos(JSON.stringify(this.lista_ficha_asistencia_alumno)).subscribe(this.peticion_actualiza_ficha_asistencia_alumno);
  }

}
