import { Component, OnInit } from '@angular/core';
import { PreinscripcionesService } from 'src/app/servicios/preinscripciones.service';
import { DataTablesOptions } from 'src/app/logica/constantes';

@Component({
  selector: 'app-listado-preinscripciones',
  templateUrl: './listado-preinscripciones.component.html',
  styleUrls: ['./listado-preinscripciones.component.css']
})
export class ListadoPreinscripcionesComponent implements OnInit {

  lista_preinscripcion: any[] = [];

  lista_preinscripcion2: any[] = [];

  dtOptions: any = {};
  dtOptions_2: any = {};

  bCargadoPreinscripciones: boolean = false;
  bCargadoPreinscripciones2: boolean = false;

  preinscripcion_seleccionada: any;

  constructor(private preinscripcionService: PreinscripcionesService)
  {}

  obtener_preinscripcions =
  {
    next: (respuesta: any) =>
    {
      this.lista_preinscripcion = respuesta.preinscripciones;
    }
  }
  ngOnInit(): void {
    this.preinscripcionService.obtener_preinscripciones().subscribe(this.refrescar_personas);
  }

  refrescar_personas2 =
  {
    next: (respuesta: any) =>
    {
      var datatable = $('#tabla_preinscripciones_2').DataTable();
      datatable.destroy();
      this.lista_preinscripcion2 = respuesta.preinscripciones;

      this.dtOptions_2 =
      {
        language: DataTablesOptions.spanish_datatables,
        data: this.lista_preinscripcion2,
        dom: 'Bfrtip',
        buttons: [{extend: 'excel', text: 'Generar Excel', className: 'btn btn-dark mb-3'}],
        columns:
        [
          {title: 'Segundo Instrumento',
            data: 'instrumento2'
          },
          {title: 'Tercer Instrumento',
            data: 'instrumento3'
          },
          {title: 'Sucursal',
           data: 'nombre_sucursal'
          },
          {title: 'Horario',
            data: 'horario'
          },
          {title: 'Curso',
            data: 'nombre_curso'
          }],
          rowCallback: (row: Node, data: any[] | Object, index: number) => {
            $('td', row).off('click');
            $('td', row).on('click', () => {
              $('#tabla_preinscripciones_2 tr').removeClass('selected')
              $(row).addClass('selected');
            });

            return row;
            }
        }
        $('#tabla_preinscripciones_2').DataTable(this.dtOptions_2);
        this.bCargadoPreinscripciones2 = true;

      }
  

  }

  preinscripcion_marcada(data: any)
  {
    this.preinscripcion_seleccionada = data;
    this.preinscripcionService.obtener_preinscripciones_detalle(this.preinscripcion_seleccionada.nid_preinscripcion).subscribe(this.refrescar_personas2);
  }

  refrescar_personas = 
  {
    next: (respuesta: any) =>
    {
      var datatable = $('#tabla_preinscripciones').DataTable();
      datatable.destroy();
      this.lista_preinscripcion = respuesta.preinscripciones;

      this.dtOptions =
      {
        language: DataTablesOptions.spanish_datatables,
        data: this.lista_preinscripcion,
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
          {title: 'DNI',
          data: 'dni'
          },
          {
            title:"Fecha solicitud",
            data: 'fecha_solicitud'
          },
          {
            title: 'Fecha de nacimiento',
            data: 'fecha_nacimiento'
          },
          {
            title: 'Instrumento',
            data: 'instrumento'
          },
          {title: 'Nombre (Padre)',
            data: 'nombre_padre'
          },
          {title: 'Primer apellido (Padre)',
            data: 'primer_apellido_padre'
          },
          {title: 'Segundo apellido (Padre)',
            data: 'segundo_apellido_padre'
          },
          {title: 'DNI (Padre)',
          data: 'dni_padre'
          },
          {title: 'Teléfono',
          data: 'telefono'
        },
          {
            title: 'Correo electrónico',
            data: 'correo_electronico'
          }],
          rowCallback: (row: Node, data: any[] | Object, index: number) => {
            $('td', row).off('click');
            $('td', row).on('click', () => {
              $('#tabla_preinscripciones tr').removeClass('selected')
              $(row).addClass('selected');
              this.preinscripcion_marcada(data);
            });

            return row;
            }
        }
        $('#tabla_preinscripciones').DataTable(this.dtOptions);
        this.bCargadoPreinscripciones = true;


        
      }
  
      
  }
}
