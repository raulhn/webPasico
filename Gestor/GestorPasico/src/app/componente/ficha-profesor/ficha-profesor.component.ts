import { Component, OnInit } from '@angular/core';
import { CursosService } from 'src/app/servicios/cursos.service';
import { ActivatedRoute } from '@angular/router';
import { DataTablesOptions } from 'src/app/logica/constantes';
import { MatriculasService } from 'src/app/servicios/matriculas.service';
import { PersonasService } from 'src/app/servicios/personas.service';
import { AsignaturasService } from 'src/app/servicios/asignaturas.service';

@Component({
  selector: 'app-ficha-profesor',
  templateUrl: './ficha-profesor.component.html',
  styleUrls: ['./ficha-profesor.component.css']
})
export class FichaProfesorComponent implements OnInit{

  lista_cursos: any[] = [];
  lista_alumnos: any[] = [];
  lista_asignaturas: any[] = [];

  bCargadoCursos: boolean = false;
  bCargadoAlumnos: boolean = false;
  bCargadasAsignaturas: boolean = false;

  curso_seleccionado: any;
  asignatura_seleccionada: any;
  activo: string = "1";

  nid_profesor: string = "";
  profesor: any;
  nombre_profesor: string = "";

  dtOptions_alumnos: any= {}

  constructor(private rutaActiva: ActivatedRoute, private cusosServices: CursosService, private matriculasService: MatriculasService,
              private personasService: PersonasService, private asignaturasService: AsignaturasService)
  {
    this.nid_profesor = rutaActiva.snapshot.params['nid_profesor'];
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
  }
}
