import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HorariosService } from 'src/app/servicios/horarios.service';
import { MatriculasService } from 'src/app/servicios/matriculas.service';
import Swal from 'sweetalert2';
import { DataTablesOptions } from 'src/app/logica/constantes';

@Component({
  selector: 'app-horario-clase',
  templateUrl: './horario-clase.component.html',
  styleUrls: ['./horario-clase.component.css']
})
export class HorarioClaseComponent implements OnInit {

  nid_horario_clase: string = "";
  nid_matricula_clase: string = "";

  ALUMNOS_ACTIVOS: string = "3"

  
  alumnos_sin_asingar : any;
  alumnos: any;

  dtOptions_personas: any= {}

  bCargadoPersonas: boolean = false;

  nid_matricula_asignatura_seleccionada: string ="";
  nid_matricula_asignatura_tabla: any = "";

  constructor(private horariosServices: HorariosService, private rutaActiva: ActivatedRoute, private matriculasService: MatriculasService)
  {
    this.nid_horario_clase = rutaActiva.snapshot.params['nid_horario_clase'];
  }


  peticion_obtener_alumnos_sin_asignar =
  {
    next: (respuesta: any) =>
    {
      this.alumnos_sin_asingar = respuesta.alumnos;
      console.log(respuesta)
    },
    error: (respuesta: any) =>
    {
      console.log('Error');
    }
  }

  
  click_persona(persona_marcada: any)
  {
    this.nid_matricula_asignatura_tabla = persona_marcada;
  }
  
  peticion_obtener_alumnos =
  {
    next: (respuesta: any) =>
    {
      this.alumnos = respuesta.alumnos;
      this.bCargadoPersonas = true;
      console.log(respuesta);

      this.dtOptions_personas =
      {
        language: DataTablesOptions.spanish_datatables,
        data: this.alumnos,
        dom: 'Bfrtip',
        buttons: [{extend: 'excel', text: 'Generar Excel', className: 'btn btn-dark mb-3'}],
        columns:
        [
          {title: 'DNI',
          data: 'nif'
          },
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
              this.click_persona(data)
              $('#tabla_personas tr').removeClass('selected')
              $(row).addClass('selected');
            });
            return row;
            }
        }
        $('#tabla_personas').DataTable(this.dtOptions_personas);
        this.bCargadoPersonas = true;
      }
    ,
    error: (respuesta: any) =>
    {
      console.log('Error');
    }
  }

  ngOnInit(): void {
     this.horariosServices.obtener_alumnos_sin_asignar(this.nid_horario_clase).subscribe(this.peticion_obtener_alumnos_sin_asignar);
     this.horariosServices.obtener_alumnos_horario_clase(this.nid_horario_clase).subscribe(this.peticion_obtener_alumnos);
  }

  comparePersona(item: any, selected: any) {
    return item['nid'] == selected;
  }


  peticion_asignar_clase = 
  {
    next: (respuesta: any) =>
      {
        Swal.fire({
          icon: 'success',
          title: 'Clase asignada',
          text: 'Se ha asignado la clase',
        }).then(() => {  window.location.reload();});
      },
      error: (respuesta: any) =>
      {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Se ha producido un error'
        })
      }
  }

  peticion_liberar_clase = 
  {
    next: (respuesta: any) =>
      {
        Swal.fire({
          icon: 'success',
          title: 'Clase liberada',
          text: 'Se ha liberada la clase',
        }).then(() => {  window.location.reload();});
      },
      error: (respuesta: any) =>
      {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Se ha producido un error'
        })
      }
  }

  asignar_clase()
  {
    if(this.nid_matricula_asignatura_seleccionada == "")
    {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'No se ha indicado un alumno'
      })
    }
    else
    {
      let datos = {nid_matricula_asignatura: this.nid_matricula_asignatura_seleccionada, nid_horario_clase: this.nid_horario_clase};
      this.horariosServices.asignar_horario(datos).subscribe(this.peticion_asignar_clase);
    }
  }

  liberar_clase()
  {
    console.log(this.nid_matricula_asignatura_tabla)
    let datos = {nid_horario_clase: this.nid_horario_clase, nid_matricula_asignatura: this.nid_matricula_asignatura_tabla.nid_matricula_asignatura};
    this.horariosServices.liberar_horario(datos).subscribe(this.peticion_liberar_clase);
  }

}
