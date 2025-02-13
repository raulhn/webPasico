import { Component,  ElementRef, OnInit, ViewChild , Input } from '@angular/core';
import { AsignaturasService } from 'src/app/servicios/asignaturas.service';
import { CursosService } from 'src/app/servicios/cursos.service';
import { MatriculasService } from 'src/app/servicios/matriculas.service';
import { PersonasService } from 'src/app/servicios/personas.service';
import { ActivatedRoute } from '@angular/router';
import { DataTablesOptions } from 'src/app/logica/constantes';
import { URL } from 'src/app/logica/constantes';
import Swal from 'sweetalert2';

// https://www.angularjswiki.com/angular/how-to-use-font-awesome-icons-in-angular-applications/
import { faX } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-registro-matricula',
  templateUrl: './registro-matricula.component.html',
  styleUrls: ['./registro-matricula.component.css']
})
export class RegistroMatriculaComponent implements OnInit{
  bCargado: boolean = false;
  bCargado_cursos: boolean = false;
  bCargadocompleto: boolean = false;

  alumno_seleccionado: any;

  faXmark = faX

  enlaceFicha: string = URL.URL_FRONT_END + "/ficha_persona/";
  nid_asignatura: string ="";

  nuevo_alummno: string = "";

  lista_personas: any[] = [];
  cursos: any[] = [];

  alumno: any ;
  curso: any = '3';
  profesor: any;
  asignatura: any;

  listaAlumnos: any[] = [];
  lista_profesores: any[] = [];

  fecha_baja: string ="";

  dtOptions: any;

  activo: string = "1";

  @ViewChild('instancia_alumno') instancia_alumno!: ElementRef;
  @ViewChild('instancia_baja') instancia_baja!: ElementRef;
  @ViewChild('instancia_cambio_profesor') instancia_cambio_profesor!: ElementRef;

  obtener_cursos = 
  {
    next: (respuesta: any) =>
    {
      this.cursos = respuesta.cursos.map((elemento: any) => {return {descripcion: elemento.descripcion, clave_curso: elemento.nid}});
      this.bCargado_cursos = true;
      this.curso = respuesta.cursos[0]['nid']
      this.matriculasServices.obtener_alumnos_asignaturas(this.cursos[0]['clave_curso'], this.nid_asignatura, this.activo).subscribe(this.obtener_alumnos);
      this.bCargadocompleto = true;
    }
  }

  constructor(private rutaActiva: ActivatedRoute,private personasServices: PersonasService, private cursosServices: CursosService, 
              private matriculasServices: MatriculasService, private asignaturasServices: AsignaturasService)
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

  obtener_profesores = 
  {
    next: (respuesta: any) =>
    {
      this.lista_profesores = respuesta.profesores.map((elemento: any) =>{
        return{etiqueta_profesor: elemento.etiqueta, clave_profesor: elemento.nid_persona}});
    }
  }


  obtener_asignatura =
  {
    next: (respuesta: any) =>
    {
      this.asignatura = respuesta.asignatura;
    }
  }

  click_alumno(alumno: any)
  {
    this.alumno_seleccionado = alumno;
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
          }],
          rowCallback: (row: Node, data: any[] | Object, index: number) => {
            $('td', row).off('click');
            $('td', row).on('click', () => {
              this.click_alumno(data);
              $('#tabla_alumnos tr').removeClass('selected')
              $(row).addClass('selected');
            });
            return row;
        }
          /* Incluir botones en datatable */
          /* https://stackblitz.com/edit/angular-hxdbgi-t371wf?file=app%2Ftab-nav-bar-basic-example.ts
          {
            title: '',
            data: null,
            render: (e: any) =>{ return '<button class="btn btn-danger"> <fa-icon _ngcontent-irg-c51="" class="ng-fa-icon"><svg role="img" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="x" class="svg-inline--fa fa-x" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z"></path></svg></fa-icon> Eliminar </button>'}
            
          }*/
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
          }
        ],
          rowCallback: (row: Node, data: any[] | Object, index: number) => {
            $('td', row).off('click');
            $('td', row).on('click', () => {
              this.click_alumno(data);
              $('#tabla_alumnos tr').removeClass('selected')
              $(row).addClass('selected');
            });
            return row;
        }
      }
      $('#tabla_alumnos').DataTable(this.dtOptions);
    }

  }
  

  ngOnInit(): void {
    this.personasServices.obtener_lista_personas().subscribe(this.obtener_personas);
    this.asignaturasServices.obtener_asignatura(this.nid_asignatura).subscribe(this.obtener_asignatura);
    this.cursosServices.obtener_cursos().subscribe(this.obtener_cursos);
    this.asignaturasServices.obtener_profesores_asignatura(this.nid_asignatura).subscribe(this.obtener_profesores);
  }

  comparePersona_alumno(item: any, selected: any) {
    return item['clave_persona'] == selected
  }

  compareCursos(item: any, selected: any)
  {
    return item['clave_curso'] == selected
  }

  comparePersona_profesor(item: any, selected: any)
  {
    return item['clave_profesor'] == selected
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
      this.matriculasServices.obtener_alumnos_asignaturas(this.curso, this.nid_asignatura, this.activo).subscribe(this.refrescar_alumnos);
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



  onChangeCurso(evento: any)
  {
    this.matriculasServices.obtener_alumnos_asignaturas(this.curso, this.nid_asignatura, this.activo).subscribe(this.refrescar_alumnos)
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
            this.matriculasServices.registrar_matricula(this.alumno, this.curso, this.nid_asignatura, this.profesor).subscribe(this.registrar_alumno)
          }
      }
    )
  }

  registrar_baja =
  {
    next: (respuesta: any) =>
    {
      Swal.fire({
        icon: 'success',
        title: 'Baja registrada',
        text: 'Se ha registrado la baja correctamente'
      })
      this.fecha_baja = "";
    },
    error: (respuesta: any) =>
    {
      Swal.fire(
        {
          icon: 'error',
          title: 'Oops...',
          text: 'Se ha producido un error'
        }
      )
    }
  }

  registrar_cambio_profesor =
  {
    next: (respuesta: any) =>
    {
      Swal.fire({
        icon: 'success',
        title: 'Cambio realizado',
        text: 'Se ha registrado el cambio correctamente'
      })
      this.fecha_baja = "";
    },
    error: (respuesta: any) =>
    {
      Swal.fire(
        {
          icon: 'error',
          title: 'Oops...',
          text: 'Se ha producido un error'
        }
      )
    }
  }

  dar_baja_alumno()
  {
    Swal.fire(
      {
        title: 'Dar de baja',
        html: this.instancia_baja.nativeElement,
        confirmButtonText: 'Dar de baja',
        showCancelButton: true
      }
    ).then(
      (results: any) =>
      {
        if(results.isConfirmed)
        {
          this.matriculasServices.dar_baja_alumno(this.alumno_seleccionado.nid_matricula_asignatura, this.alumno_seleccionado.nid_matricula, this.nid_asignatura, this.fecha_baja).subscribe(this.registrar_baja)
        }
      }
    )
  }

  cambia_seleccion()
  {
    this.matriculasServices.obtener_alumnos_asignaturas(this.curso, this.nid_asignatura, this.activo).subscribe(this.refrescar_alumnos);
  }

  obtener_url_ficha_alumno()
  {
    return this.enlaceFicha + this.alumno_seleccionado.nid
  }

  cambiar_profesor()
  {
    Swal.fire(
      {
        title: 'Cambiar Profesor',
        html: this.instancia_cambio_profesor.nativeElement,
        confirmButtonText: 'Actualizar',
        showCancelButton: true
      }
    ).then(
      (results: any) =>
      {
        if(results.isConfirmed)
        {
          this.matriculasServices.sustituir_profesor_alumno(this.profesor, this.alumno_seleccionado.nid_matricula_asignatura, this.nid_asignatura).subscribe(this.registrar_cambio_profesor)
        }
      }
    )
  }
}
