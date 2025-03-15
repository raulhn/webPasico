import { Component, OnInit } from '@angular/core';
import { nextSortDir } from '@swimlane/ngx-datatable';
import { AsignaturasService } from 'src/app/servicios/asignaturas.service';
import { CursosService } from 'src/app/servicios/cursos.service';
import { PersonasService } from 'src/app/servicios/personas.service';
import { DataTablesOptions, URL } from 'src/app/logica/constantes';


@Component({
  selector: 'app-lista-alumnos',
  templateUrl: './lista-alumnos.component.html',
  styleUrls: ['./lista-alumnos.component.css']
})
export class ListaAlumnosComponent implements OnInit {
  enlaceFicha: string = URL.URL_FRONT_END + "/ficha_persona/";

  lista_cursos: any;
  lista_personas: any;
  lista_asignaturas: any;

  bCargadoCursos: boolean = false;
  bCargadoPersonas: boolean = false;
  bCargadasAsignaturas: boolean = false;

  curso_seleccionado: string = "";
  asignatura_seleccionada: string = "0";
  alumno_activo: string = "1";

  dtOptions_personas: any = {}

  persona_seleccionada: any;

  constructor(private cursoService: CursosService, private personasService: PersonasService, private asignaturasService: AsignaturasService) { }

  peticion_obtener_cursos =
  {
    next: (respuesta: any) =>
    {
      this.lista_cursos = respuesta.cursos;
      this.bCargadoCursos = true;
    }
  }

  peticion_obtener_asignaturas =
  {
    next: (respuesta: any) =>
    {
      this.lista_asignaturas = respuesta.asignaturas;
      this.bCargadasAsignaturas = true;
    }
  }

  ngOnInit(): void {
    this.cursoService.obtener_cursos().subscribe(this.peticion_obtener_cursos);
    this.asignaturasService.obtener_asignaturas_rol_profesor().subscribe(this.peticion_obtener_asignaturas);
  }

  peticion_obtener_personas =
  {
    next: (respuesta: any) =>
    {
      var datatable = $('#tabla_personas').DataTable();
      datatable.destroy();
      this.lista_personas = respuesta.alumnos;

      this.dtOptions_personas =
      {
        data: this.lista_personas,
        columns: [
          {title: 'Nombre', data: 'nombre'},
          {title: 'Primer Apellido', data: 'primer_apellido'},
          {title: 'Segundo Apellido', data: 'segundo_apellido'},
          {title: 'Email', data: 'correo_electronico'},
          {title: 'Teléfono', data: 'telefono'}
        ],
        language: DataTablesOptions.spanish_datatables,
        dom: 'Bfrtip',
        buttons: [{extend: 'excel', text: 'Generar Excel', className: 'btn btn-dark mb-3'}],
        rowCallback: (row: Node, data: any[] | Object, index: number) => {
          $('td', row).off('click');
          $('td', row).on('click', () => {
            this.persona_seleccionada = data;
            $('#tabla_personas tr').removeClass('selected');
            $(row).addClass('selected');
          });
          return row;
        }

      }
      $('#tabla_personas').DataTable(this.dtOptions_personas);
      this.bCargadoPersonas = true;
    }
  }

  cambia_seleccion_curso()
  {
    this.personasService.obtener_alumnos_rol_profesor(this.asignatura_seleccionada, this.alumno_activo, this.curso_seleccionado).subscribe(this.peticion_obtener_personas);
  }

  obtenerUrlFicha()
  {
    return this.enlaceFicha + this.persona_seleccionada.nid;
  }

}
