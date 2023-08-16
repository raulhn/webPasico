import { Component } from '@angular/core';
import { PersonasService } from 'src/app/servicios/personas.service';
import { Persona } from 'src/app/logica/persona';
import { URL } from 'src/app/logica/constantes';
import { DataTablesOptions } from 'src/app/logica/constantes';
import { faLanguage } from '@fortawesome/free-solid-svg-icons';
import { SociosService } from 'src/app/servicios/socios.service';
import { AsignaturasService } from 'src/app/servicios/asignaturas.service';
import { MatriculasService } from 'src/app/servicios/matriculas.service';
import { CursosService } from 'src/app/servicios/cursos.service';


@Component({
  selector: 'app-lista-personas',
  templateUrl: './lista-personas.component.html',
  styleUrls: ['./lista-personas.component.css']
})
export class ListaPersonasComponent {



  enlaceFicha: string = URL.URL_FRONT_END + "/ficha_persona/";

  bCargado: boolean = false;
  bCargadoPersonas: boolean = false;
  bCargado_cursos: boolean = false;

  dtOptions: any = {}
 
  dtOptions_personas: any= {}

  lista_personas: any[] = [];

  tipo: string = "1";

  persona_seleccionada: any;

  alta_socio: string = "1";

  lista_asignaturas: any[] = [];
  lista_cursos: any[] = [];

  asignatura_seleccionada: string = "0";
  curso_seleccionado: string = "0";
  alumno_activo: string = "1";


  constructor(private personasService:PersonasService, private sociosService: SociosService, private asignaturasService: AsignaturasService,
      private matriculasService: MatriculasService, private cursosService: CursosService)
  {
    this.dtOptions =
    {
      language: DataTablesOptions.spanish_datatables,
      dom: 'Bfrtip',
      buttons: [{extend: 'excel', text: 'Generar Excel', className: 'btn btn-dark mb-3'}]
    }
  }

  click_persona(persona_marcada: any)
  {
    this.persona_seleccionada = persona_marcada;
  }

  refrescar_personas = 
  {
    next: (respuesta: any) =>
    {
      var datatable = $('#tabla_personas').DataTable();
      datatable.destroy();
      this.lista_personas = respuesta.personas;

      this.dtOptions_personas =
      {
        language: DataTablesOptions.spanish_datatables,
        data: this.lista_personas,
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
              this.click_persona(data);
              $('#tabla_personas tr').removeClass('selected')
              $(row).addClass('selected');
            });
            return row;
            }
        }
        $('#tabla_personas').DataTable(this.dtOptions_personas);
        this.bCargadoPersonas = true;
      }
      
  }

  recuperar_asignaturas =
  {
    next: (respuesta: any) =>
    {
      this.lista_asignaturas = respuesta.asignaturas;
    }
  }

  refrescar_alumnos = 
  {
    next: (respuesta: any) =>
    {
      var datatable = $('#tabla_personas').DataTable();
      datatable.destroy();
      this.lista_personas = respuesta.alumnos;

      this.dtOptions_personas =
      {
        language: DataTablesOptions.spanish_datatables,
        data: this.lista_personas,
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
              this.click_persona(data);
              $('#tabla_personas tr').removeClass('selected')
              $(row).addClass('selected');
            });
            return row;
            }
        }
        $('#tabla_personas').DataTable(this.dtOptions_personas);
        this.bCargadoPersonas = true;
      }
      
  }
  
  
  obtener_cursos = 
  {
    next: (respuesta: any) =>
    {
      this.lista_cursos = respuesta.cursos.map((elemento: any) => {return {descripcion: elemento.descripcion, clave_curso: elemento.nid}});
      this.bCargado_cursos = true;
      this.curso_seleccionado = respuesta.cursos[0]['nid']
      this.cambia_seleccion_curso();
    }
  }

  ngOnInit(): void {
    this.personasService.obtener_personas(this.tipo).subscribe(this.refrescar_personas);
    this.asignaturasService.obtener_asignaturas().subscribe(this.recuperar_asignaturas);
    this.cursosService.obtener_cursos().subscribe(this.obtener_cursos);
  }

  cambia_seleccion_socio()
  {
    if (this.alta_socio == '1')
    {
      this.sociosService.obtener_lista_socios().subscribe(this.refrescar_personas);
    }
    else if(this.alta_socio == '2')
    {
      this.sociosService.obtener_lista_socios_alta().subscribe(this.refrescar_personas);
    }
    else if(this.alta_socio == '3')
    {
      this.sociosService.obtener_lista_socios_baja().subscribe(this.refrescar_personas);
    }
  }


  cambia_seleccion_curso()
  {
    if (this.asignatura_seleccionada == '0')
    {
      this.matriculasService.obtener_alumnos_cursos(this.curso_seleccionado, this.alumno_activo).subscribe(this.refrescar_alumnos)
    }
    else
    {
      this.matriculasService.obtener_alumnos_asignaturas(this.curso_seleccionado, this.asignatura_seleccionada, this.alumno_activo).subscribe(this.refrescar_alumnos)
    }
  }

  cambia_seleccion()
  {
    if (this.tipo == '2')
    {
      this.cambia_seleccion_socio()
    }
    else if(this.tipo == '4')
    {
      this.cambia_seleccion_curso();
    }
    else
    {
      this.personasService.obtener_personas(this.tipo).subscribe(this.refrescar_personas);
    }
  }

  obtenerEnlaceFicha(nid: string)
  {
    return this.enlaceFicha + nid;
  }

  obtenerUrlFicha()
  {
    console.log(this.persona_seleccionada)
    return this.enlaceFicha + this.persona_seleccionada.nid;
  }
}
