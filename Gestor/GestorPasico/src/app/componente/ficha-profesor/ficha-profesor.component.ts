import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { CursosService } from 'src/app/servicios/cursos.service';
import { ActivatedRoute } from '@angular/router';
import { DataTablesOptions } from 'src/app/logica/constantes';
import { MatriculasService } from 'src/app/servicios/matriculas.service';
import { PersonasService } from 'src/app/servicios/personas.service';
import { AsignaturasService } from 'src/app/servicios/asignaturas.service';
import { URL } from 'src/app/logica/constantes';
import { HorariosService } from 'src/app/servicios/horarios.service';
import Swal from 'sweetalert2';


@Component({
    selector: 'app-ficha-profesor',
    templateUrl: './ficha-profesor.component.html',
    styleUrls: ['./ficha-profesor.component.css'],
    standalone: false
})
export class FichaProfesorComponent implements OnInit{
  enlaceFicha: string = URL.URL_FRONT_END + "/ficha_persona/";
  enlaceHorario: string = URL.URL_FRONT_END + "/horario"

  @ViewChild('instancia_sustituir') instancia_sustituir!: ElementRef;

  lista_cursos: any[] = [];
  lista_alumnos: any[] = [];
  lista_asignaturas: any[] = [];

  bCargadoCursos: boolean = false;
  bCargadoAlumnos: boolean = false;
  bCargadasAsignaturas: boolean = false;

  curso_seleccionado: any;
  asignatura_seleccionada: any = "";
  activo: string = "1";

  nid_profesor: string = "";
  profesor: any;
  nombre_profesor: string = "";

  dtOptions_alumnos: any= {}

  alumno_seleccionado: string = "";

  bhorario_asignatura_recuperado: boolean = false;
  bNo_existe_horario: boolean = false;
  horario_asignatura: any;

  
  formulario_dia: string = "";
  formulario_hora_inicio: string = "";
  formulario_hora_fin: string = "";
  duracion_clase: string = "";


  constructor(private rutaActiva: ActivatedRoute, private cusosServices: CursosService, private matriculasService: MatriculasService,
              private personasService: PersonasService, private asignaturasService: AsignaturasService, private horarioService: HorariosService)
  {
    this.nid_profesor = rutaActiva.snapshot.params['nid_profesor'];
  }

  click_alumno(data: any)
  {

  }

  refrescar_alumnos =
  {
    next: (respuesta: any) =>
    {
      var datatable = $('#tabla_alumnos').DataTable();
      datatable.destroy();
      this.lista_alumnos = respuesta.alumnos;

      this.dtOptions_alumnos =
      {
        language: DataTablesOptions.spanish_datatables,
        data: this.lista_alumnos,
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
              $('#tabla_alumnos tr').removeClass('selected')
              this.click_alumno(data)
              $(row).addClass('selected');
            });
            return row;
            }
        }
        $('#tabla_alumnos').DataTable(this.dtOptions_alumnos);
        this.bCargadoAlumnos = true;
    }
  }

  obtener_cursos = 
  {
    next: (respuesta: any) =>
    {
      this.lista_cursos = respuesta.cursos;
      this.curso_seleccionado = this.lista_cursos[0]['nid'];
      this.bCargadoCursos = true;

      this.matriculasService.obtener_alumnos_profesores(this.nid_profesor, this.curso_seleccionado, this.asignatura_seleccionada, this.activo).subscribe(this.refrescar_alumnos);
    }
  }

  obtener_profesor =
  {
    next: (respuesta: any) =>
    {
       this.profesor = respuesta.persona;
       this.nombre_profesor = this.profesor.etiqueta;
    }
  }

  obtener_asignaturas = 
  {
    next: (respuesta: any) =>
    {
      this.lista_asignaturas = respuesta.asignaturas;
      this.bCargadasAsignaturas = true;
      this.asignatura_seleccionada = this.lista_asignaturas[0].nid;
      this.matriculasService.obtener_alumnos_profesores(this.nid_profesor, this.curso_seleccionado, this.asignatura_seleccionada, this.activo).subscribe(this.refrescar_alumnos);
      this.horarioService.obtener_horarios(this.nid_profesor, this.asignatura_seleccionada, "").subscribe(this.recuperar_horario);
    }
  }

  ngOnInit(): void {
    this.cusosServices.obtener_cursos().subscribe(this.obtener_cursos);
    this.personasService.obtener_persona(this.nid_profesor).subscribe(this.obtener_profesor);
    this.asignaturasService.obtener_asignaturas_profesor(this.nid_profesor).subscribe(this.obtener_asignaturas);
  }

  cambia_seleccion()
  {
    this.matriculasService.obtener_alumnos_profesores(this.nid_profesor, this.curso_seleccionado, this.asignatura_seleccionada, this.activo).subscribe(this.refrescar_alumnos);
    this.horarioService.obtener_horarios(this.nid_profesor, this.asignatura_seleccionada, "").subscribe(this.recuperar_horario);
  }

  obtiene_url_ficha()
  {
    return this.enlaceFicha + this.alumno_seleccionado;
  }


  recuperar_horario =
  {
    next: (respuesta: any) =>
    {
      this.horario_asignatura = respuesta.horarios;
      
      if ( this.horario_asignatura.length > 0)
      {
        this.bhorario_asignatura_recuperado = true;
      }
      else {
        this.bhorario_asignatura_recuperado = false;
      }

    }
  }

  obtiene_url_horario()
  {

    return this.enlaceHorario + '/' + this.horario_asignatura[0]['nid_horario'];
  }

  peticion_registrar_horario =
  {
    next: (respuesta: any) =>
      {
        console.log('Funciona')
      },
    error: (respuesta: any) =>
      {
        console.log('No funciona')
      }
  }

  
  registrar_horario()
  {
    var horario_inicio_array = this.formulario_hora_inicio.split(':');
    var horario_fin_array = this.formulario_hora_fin.split(':');

    let peticion = {dia: this.formulario_dia, hora_inicio: horario_inicio_array[0], minutos_inicio: horario_inicio_array[1], hora_fin: horario_fin_array[0],
        minutos_fin: horario_fin_array[1], nid_asignatura: this.asignatura_seleccionada, nid_profesor: this.nid_profesor, duracion_clase: this.duracion_clase
    }

    this.horarioService.registrar_horario(peticion).subscribe(this.peticion_registrar_horario);
  }


  add_horario()
  {
    Swal.fire({
      title: 'Crear profesor',
      html: this.instancia_sustituir.nativeElement,
      confirmButtonText: 'Crear',
      showCancelButton: true,
    }).then(
      (results: any) =>
        {
        if(results.isConfirmed)
        {
          this.registrar_horario();
        }
      }
    )
  }
}
