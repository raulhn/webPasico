import { Component, OnInit } from '@angular/core';
import { ServicioPreinscripcionService } from 'src/app/servicios/servicio-preinscripcion.service';
import { Constantes } from '../logica/constantes';

@Component({
    selector: 'app-listado-preinscripciones-completo',
    templateUrl: './listado-preinscripciones-completo.component.html',
    styleUrls: ['./listado-preinscripciones-completo.component.css'],
    standalone: false
})
export class ListadoPreinscripcionesCompletoComponent implements OnInit {

  lista_preinscripcion: any[] = [];

  lista_preinscripcion2: any[] = [];

  dtOptions: any = {};
  dtOptions_2: any = {};
  dtOptions_3: any = {};

  bCargadoPreinscripciones: boolean = false;
  bCargadoPreinscripciones2: boolean = false;

  preinscripcion_seleccionada: any;

  constructor(private preinscripcionService: ServicioPreinscripcionService)
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

  
  preinscripcion_marcada(data: any)
  {
    this.preinscripcion_seleccionada = data;
  }

  refrescar_personas = 
  {
    next: (respuesta: any) =>
    {
      var datatable = $('#tabla_preinscripciones_completa').DataTable();
      datatable.destroy();
      this.lista_preinscripcion = respuesta.preinscripciones;

      this.dtOptions =
      {
        language:  Constantes.DataTablesOptions.spanish_datatables,
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
          }
          ,
          {
            title: 'Fecha de nacimiento',
            data: 'fecha_nacimiento'
          },
      
          {title: 'Teléfono',
          data: 'telefono'
        },
          {
            title: 'Correo electrónico',
            data: 'correo_electronico'
          },
          {title: 'Tipo Preinscripción',
            data: 'tipo_matricula'
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
          {
            title: 'Primer Instrumento',
            data: 'instrumento'
          },

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
          }
        
        ],
          rowCallback: (row: Node, data: any[] | Object, index: number) => {
            $('td', row).off('click');
            $('td', row).on('click', () => {
              $('#tabla_preinscripciones_completa tr').removeClass('selected')
              $(row).addClass('selected');
              this.preinscripcion_marcada(data);
            });

            return row;
            }
        }
        $('#tabla_preinscripciones_completa').DataTable(this.dtOptions);

        this.bCargadoPreinscripciones = true;
        
      }
  
      
  }
}
