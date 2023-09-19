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

  dtOptions: any = {}
  bCargadoPreinscripciones: boolean = false;

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
            });
            return row;
            }
        }
        $('#tabla_preinscripciones').DataTable(this.dtOptions);
        this.bCargadoPreinscripciones = true;
      }
      
  }
}
