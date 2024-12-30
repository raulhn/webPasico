import { Component, OnInit } from '@angular/core';
import { MatriculasService } from 'src/app/servicios/matriculas.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { RemesaService } from 'src/app/servicios/remesa.service';
import { EvaluacionService } from 'src/app/servicios/evaluacion.service';
import { DataTablesOptions } from 'src/app/logica/constantes';

@Component({
  selector: 'app-ficha-matricula',
  templateUrl: './ficha-matricula.component.html',
  styleUrls: ['./ficha-matricula.component.css']
})
export class FichaMatriculaComponent implements OnInit{

  nid_matricula: string = "";

  asignaturas: any;
  bCargado: boolean = false;

  precio_manual: string ="";

  mensualidad_matricula: any;

  evaluaciones: any;


  dtOptions: any = {};

  bCargadas_evaluaciones: boolean = false;

  constructor(private rutaActiva: ActivatedRoute, private matriculaService: MatriculasService, private remesaService: RemesaService, private evaluacionesServcie: EvaluacionService)
  {
    this.nid_matricula = rutaActiva.snapshot.params['nid_matricula'];
  }

  obtener_asignaturas =
  {
    next: (respuesta: any) =>
    {
      this.asignaturas = respuesta['asignaturas'];
    }
  }  

  recuperar_matricula =
  {
    next: (respuesta: any) =>
    {
      this.precio_manual = respuesta['matricula']['precio_manual'];
    }
  }

  recuperar_evaluaciones =
  {
    next: (respuesta: any) =>
    {
      this.evaluaciones = respuesta.evaluaciones;

      var datatable = $('#tabla_evaluaciones').DataTable();
      datatable.destroy();

      this.dtOptions = {
        language: DataTablesOptions.spanish_datatables,
        data: this.evaluaciones,
        dom: 'Bfrtip',
        buttons: [{extend: 'excel', text: 'Generar Excel', className: 'btn btn-dark mb-3'}],
        columns:
        [
          {title: 'Trimestre',
            data: 'trimestre'
          },
          {
            title: 'Asignatura',
            data: 'asignatura'
          },
          {
            title: 'Profesor',
            data: 'profesor'
          },
          {
            title: 'Nota',
            data: 'nota'
          },
          {
            title: 'Progreso',
            data: 'progreso'
          },
          {
            title: 'Comentario',
            data: 'comentario'
          }],
          rowCallback: (row: Node, data: any[] | Object, index: number) => {
            $('td', row).off('click');
            $('td', row).on('click', () => {
              $('#tabla_evaluaciones tr').removeClass('selected')
              $(row).addClass('selected');
            });
            return row;
        }
      };

      $('#tabla_evaluaciones').DataTable(this.dtOptions);

      this.bCargadas_evaluaciones = true;
    }
  }


  registrar_precio =
  {
    next: (respuesta: any) =>
    {
      Swal.fire({
        icon: 'success',
        title: 'Precio Guardado',
        text: 'Se ha actualizado el precio'
      });
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

  obtener_mensualidad_matricula =
  {
    next: (respuesta: any) =>
    {
      this.mensualidad_matricula = respuesta['resumen_mensualidad'];
      this.bCargado = true;
    }
  }

  ngOnInit(): void {
    this.matriculaService.obtener_matricula(this.nid_matricula).subscribe(this.recuperar_matricula);
    this.matriculaService.obtener_asignaturas_matriculas(this.nid_matricula).subscribe(this.obtener_asignaturas);
    this.evaluacionesServcie.obtener_evaluacion_matricula_asignatura(this.nid_matricula).subscribe(this.recuperar_evaluaciones);
    this.remesaService.obtener_precio_mensualidad(this.nid_matricula).subscribe(this.obtener_mensualidad_matricula);
  }

  guardar()
  {
      this.matriculaService.registrar_precio_manual(this.nid_matricula, this.precio_manual).subscribe(this.registrar_precio);
  }
}
