import { Component,  ElementRef, OnInit, ViewChild , Input } from '@angular/core';
import { AsignaturasService } from 'src/app/servicios/asignaturas.service';
import { CursosService } from 'src/app/servicios/cursos.service';
import { MatriculasService } from 'src/app/servicios/matriculas.service';
import { PersonasService } from 'src/app/servicios/personas.service';
import { ActivatedRoute } from '@angular/router';
import { DataTablesOptions } from 'src/app/logica/constantes';
import { URL } from 'src/app/logica/constantes';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-matricula',
  templateUrl: './registro-matricula.component.html',
  styleUrls: ['./registro-matricula.component.css']
})
export class RegistroMatriculaComponent implements OnInit{
  bCargado: boolean = false;
  bCargado_cursos: boolean = false;
  bCargadocompleto: boolean = false;

  enlaceFicha: string = URL.URL_FRONT_END + "/ficha_persona/";
  nid_asignatura: string ="";

  nuevo_alummno: string = "";

  lista_personas: any[] = [];
  cursos: any[] = [];

  alumno: any ;
  curso: any = '3';
  asignatura: any;

  listaAlumnos: any[] = [];

  dtOptions: any;


  @ViewChild('instancia_alumno') instancia_alumno!: ElementRef;

  obtener_cursos = 
  {
    next: (respuesta: any) =>
    {
      this.cursos = respuesta.cursos.map((elemento: any) => {return {descripcion: elemento.descripcion, clave_curso: elemento.nid}});
      this.bCargado_cursos = true;
      this.curso = respuesta.cursos[0]['nid']
      this.matriculasServices.obtener_alumnos_asignaturas(this.cursos[0]['clave_curso'], this.nid_asignatura).subscribe(this.obtener_alumnos);
      this.bCargadocompleto = true;
    }
  }

  constructor(private rutaActiva: ActivatedRoute,private personasServices: PersonasService, private cursosServices: CursosService, private matriculasServices: MatriculasService, private asignaturasServices: AsignaturasService)
  {
    this.nid_asignatura =  rutaActiva.snapshot.params['nid_asignatura'];
  }


  obtener_personas =
  {
    next: (respuesta: any) =>
    {
      this.lista_personas = respuesta.personas.map((elemento: any) => {return {etiqueta: elemento.etiqueta, clave_persona: elemento.nid}});
      this.alumno="";
    }
  }


  obtener_asignatura =
  {
    next: (respuesta: any) =>
    {
      console.log(respuesta);
      this.asignatura = respuesta.asignatura;
    }
  }

  obtener_alumnos = 
  {
    next: (respuesta: any) =>
    {
      this.listaAlumnos = respuesta.alumnos;
      this.dtOptions =
      {
        language: DataTablesOptions.spanish_datatables,
        data: this.listaAlumnos,
        dom: 'Bfrtip',
        buttons: [{extend: 'excel', text: 'Generar Excel', className: 'btn btn-dark mb-3'}],
        columns:
        [
          {title: 'Nombre',
            data: 'nombre'
          },
          {title: 'Primer apellido',
            data: 'primer_apellido'
          },
          {title: 'Segundo apellido',
            data: 'segundo_apellido'
          },
          {title: 'Teléfono',
            data: 'telefono'
          }]
      }
      this.bCargado = true;
    }
  }

  refrescar_alumnos =
  {
    next: (respuesta: any) =>
    {
      var datatable = $('#tabla_alumnos').DataTable();
      datatable.destroy();
      this.listaAlumnos = respuesta.alumnos;

      this.dtOptions = {
        data: this.listaAlumnos,
        dom: 'Bfrtip',
        buttons: [{extend: 'excel', text: 'Generar Excel', className: 'btn btn-dark mb-3'}],
        columns:
        [
          {title: 'Nombre',
            data: 'nombre'
          },
          {title: 'Primer apellido',
            data: 'primer_apellido'
          },
          {title: 'Segundo apellido',
            data: 'segundo_apellido'
          },
          {title: 'Teléfono',
            data: 'telefono'
          },
        ],
      }
      $('#tabla_alumnos').DataTable(this.dtOptions);
    }

  }
  

  ngOnInit(): void {
    this.personasServices.obtener_lista_personas().subscribe(this.obtener_personas);
    this.asignaturasServices.obtener_asignatura(this.nid_asignatura).subscribe(this.obtener_asignatura);
    this.cursosServices.obtener_cursos().subscribe(this.obtener_cursos);
  }

  comparePersona_alumno(item: any, selected: any) {
    return item['clave_persona'] == selected
  }

  compareCursos(item: any, selected: any)
  {
    return item['clave_curso'] == selected
  }

  registrar_alumno = 
  {
    next: (respuesta: any) =>
    {
      Swal.fire({
        icon: 'success',
        title: 'Registro correcto',
        text: 'Se ha registrado correctamente'
      })
      this.matriculasServices.obtener_alumnos_asignaturas(this.curso, this.nid_asignatura).subscribe(this.refrescar_alumnos);
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

  registrar()
  {
    this.matriculasServices.registrar_matricula(this.alumno, this.curso, this.nid_asignatura).subscribe(this.registrar_alumno)
  }

  obtenerEnlaceFicha(nid: string)
  {
    return this.enlaceFicha + nid;
  }

  onChangeCurso(evento: any)
  {
    this.matriculasServices.obtener_alumnos_asignaturas(this.curso, this.nid_asignatura).subscribe(this.refrescar_alumnos)
  }

  add_alumno()
  {
    Swal.fire({
      title: 'Registrar alumno',
      html: this.instancia_alumno.nativeElement,
      confirmButtonText: 'Crear',
      showCancelButton: true
    }).then(
      (results: any) =>
        {
        if(results.isConfirmed)
        {
           this.matriculasServices.registrar_matricula(this.alumno, this.curso, this.nid_asignatura).subscribe(this.registrar_alumno)
        }
      }
    )
  }

}
