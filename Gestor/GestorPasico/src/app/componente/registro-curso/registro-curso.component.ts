import { Component, OnInit } from '@angular/core';
import { CursosService } from 'src/app/servicios/cursos.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-curso',
  templateUrl: './registro-curso.component.html',
  styleUrls: ['./registro-curso.component.css']
})
export class RegistroCursoComponent implements OnInit{
 
  cursos: any[] = [];
  dtOptions: any;

  nuevo_curso: string = "";

  bCargado: boolean = false;

  constructor(private cursosService: CursosService)
  {}

  recuperar_cursos = 
  {
    next: (respuesta: any) =>
    {
      this.cursos = respuesta.cursos;

      this.dtOptions = {
        data: this.cursos,
        columns:
        [
          {title: 'Curso',
            data: 'descripcion'}]
      };

      this.bCargado = true;
    }
  }

  ngOnInit(): void {
    this.cursosService.obtener_cursos().subscribe(this.recuperar_cursos);
  }


  refrescar_cursos = 
  {
    next: (respuesta: any) =>
    {
      var datatable = $('#tabla_cursos').DataTable();
      datatable.destroy();
      this.cursos = respuesta.cursos;

      this.dtOptions = {
        data: this.cursos,
        columns:
        [
          {title: 'Curso',
            data: 'descripcion'
          }]
      };

      $('#tabla_cursos').DataTable(this.dtOptions);
    }
  }

  registrar_curso = 
  {
    next: (respuesta: any) =>
    {
        Swal.fire({
          icon: 'success',
          title: 'Registro correcto',
          text: 'Se ha registrado correctamente'
        })
        this.cursosService.obtener_cursos().subscribe(this.refrescar_cursos);
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



  addCurso()
  {
    //https://sweetalert2.github.io/
    Swal.fire({
      title: 'Crear asignatura',
      html : `<input type="text" id="nombre_curso" class="swal2-input" placeholder="Username">
             `,
      confirmButtonText: 'Crear',
      showCancelButton: true,
      preConfirm: () => {
        this.nuevo_curso = (<HTMLInputElement>document.getElementById("nombre_curso")).value;
      }
    }).then(
      (results: any) =>
        {
        if(results.isConfirmed)
        {
          this.cursosService.registrar_curso(this.nuevo_curso).subscribe(this.registrar_curso);
        }
      }
    )
   }
}
