import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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

  matricula_asignatura_seleccionada: string ="";

  asignaturas: any;
  bCargado: boolean = false;

  precio_manual: string ="";
  comentario_precio: string=";"

  mensualidad_matricula: any;

  evaluaciones: any;


  dtOptions: any = {};
  dtOptionsAsignaturas: any = {}

  bCargadas_evaluaciones: boolean = false;

  bCargados_trimestres: boolean = false;
  bCargado_mensualidad: boolean = false;
  bCargadas_asignaturas: boolean = false;
  lista_trimestres: any;
  trimestre_seleccionado: string ="";

  fecha_alta_seleccionada: string ="";
  fecha_baja_seleccionada: string = "";

  @ViewChild('instancia_sustituir') instancia_sustituir!: ElementRef;
  @ViewChild('instancia_fecha_alta') instancia_fecha_alta!: ElementRef;
  @ViewChild('instancia_fecha_baja') instancia_fecha_baja!: ElementRef;

  constructor(private rutaActiva: ActivatedRoute, private matriculaService: MatriculasService, private remesaService: RemesaService, private evaluacionesService: EvaluacionService)
  {
    this.nid_matricula = rutaActiva.snapshot.params['nid_matricula'];
  }

  recuperar_trimestres =
  {
    next: (respuesta: any) =>
    {
      this.lista_trimestres = respuesta.trimestres;
      this.bCargados_trimestres = true;
    }
  }

  click_matricula_asignatura(asignatura_seleccionada: any)
  {
    this.matricula_asignatura_seleccionada = asignatura_seleccionada['nid_matricula_asignatura'];


    this.fecha_alta_seleccionada = asignatura_seleccionada['fecha_alta'];
    this.fecha_baja_seleccionada = asignatura_seleccionada['fecha_baja'];
  }



  obtener_asignaturas =
  {
    next: (respuesta: any) =>
    {
      this.asignaturas = respuesta['asignaturas'];
      this.bCargado = true;

      var datatable = $('#tabla_asignaturas').DataTable();
      datatable.destroy();

      this.dtOptionsAsignaturas =
      {
          language: DataTablesOptions.spanish_datatables,
          data: this.asignaturas,
          dom: 'Bfrtip',
          buttons: [{extend: 'excel', text: 'Generar Excel', className: 'btn btn-dark mb-3'}],
          columns:
          [
            {title: 'Asignatura',
              data: 'descripcion'
            },
            {
              title: 'Profesor',
              data: 'nombre_profesor'
            },
            {
              title: 'Fecha Alta',
              data: 'fecha_alta_local'
            },
            {
              title: 'Fecha Baja',
              data: 'fecha_baja_local'
            }],
            rowCallback: (row: Node, data: any[] | Object, index: number) => {
              $('td', row).off('click');
              $('td', row).on('click', () => {
                this.click_matricula_asignatura(data);
                $('#tabla_asignaturas tr').removeClass('selected')
                $(row).addClass('selected');
              });
              return row;
          }
      };
  
        $('#tabla_asignaturas').DataTable(this.dtOptionsAsignaturas);
  
        this.bCargadas_asignaturas = true;
      } 
  }  

  recuperar_matricula =
  {
    next: (respuesta: any) =>
    {
      this.precio_manual = respuesta['matricula']['precio_manual'];
      this.comentario_precio = respuesta['matricula']['comentario_precio_manual'];
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
      
      if (this.mensualidad_matricula === undefined || this.mensualidad_matricula === null)
      {
        this.bCargado_mensualidad = false
      }
      else
      {
        this.bCargado_mensualidad = true;
      }
    }
  }

  ngOnInit(): void {
    this.matriculaService.obtener_matricula(this.nid_matricula).subscribe(this.recuperar_matricula);
    this.matriculaService.obtener_asignaturas_matriculas(this.nid_matricula).subscribe(this.obtener_asignaturas);
    this.evaluacionesService.obtener_evaluacion_matricula_asignatura(this.nid_matricula).subscribe(this.recuperar_evaluaciones);
    this.remesaService.obtener_precio_mensualidad(this.nid_matricula).subscribe(this.obtener_mensualidad_matricula);
    this.evaluacionesService.obtener_trimestres().subscribe(this.recuperar_trimestres);
  }

  guardar()
  {
      this.matriculaService.registrar_precio_manual(this.nid_matricula, this.precio_manual, this.comentario_precio).subscribe(this.registrar_precio);
  }


  peticion_generar_boletin =
  {
    next: (respuesta: any) =>
    {
      let fichero = respuesta.fichero;
      this.descargarFichero(fichero);
          Swal.fire({
            icon: 'success',
            title: 'Boletín generado',
            text: 'Se ha generado el boletín',
          });
    },
    error: (respuesta: any) =>
    {
      console.log(respuesta);
      Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Se ha producido un error al generar el boletín',
          })
    }
  }



  descargarFichero(fichero: string) {
    const contenidoFichero = fichero;
    const blob = new Blob([contenidoFichero], { type: 'application/msword' });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'boletin.doc';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }



  generar_boletin()
  {
      Swal.fire({
        title: 'Generar boletín',
        html: this.instancia_sustituir.nativeElement,
        confirmButtonText: 'Generar',
        cancelButtonText: 'Cancelar',
        showCancelButton: true
      }).then(
        (results: any) =>
          {
          if(results.isConfirmed)
          {
            this.evaluacionesService.generar_boletin(this.nid_matricula, this.trimestre_seleccionado).subscribe(this.peticion_generar_boletin)
          }
        }
      )
  }

  compareTrimestre(item: any, selected: any) {
    return item['nid_trimestre'] == selected;
  }


  peticion_actualizar_fecha = 
  {
    next: (respuesta: any) =>
      {
        this.matriculaService.obtener_asignaturas_matriculas(this.nid_matricula).subscribe(this.obtener_asignaturas);
        this.remesaService.obtener_precio_mensualidad(this.nid_matricula).subscribe(this.obtener_mensualidad_matricula);
        Swal.fire({
          icon: 'success',
          title: 'Fecha Actualizada',
          text: 'Se ha actualizado la fecha',
        });
      },
      error: (respuesta: any) =>
      {
        console.log(respuesta);
        Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Se ha producido un error al actualizar la fecha',
            })
      }
  }

  actualizar_fecha_alta()
  {
    Swal.fire({
      title: 'Actualizar Fecha Alta',
      html: this.instancia_fecha_alta.nativeElement,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true
    }).then(
      (results: any) =>
      {
        if(results.isConfirmed)
        {
          if(this.fecha_alta_seleccionada == "")
          {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Es obligatorio indicar una fecha de alta',
            })
          } 
          else
          {
            this.matriculaService.actualizar_fecha_alta(this.matricula_asignatura_seleccionada, this.fecha_alta_seleccionada).subscribe(this.peticion_actualizar_fecha);
          }
        }
      }
    )
  }

  actualizar_fecha_baja()
  {
    Swal.fire({
      title: 'Actualizar Fecha Baja',
      html: this.instancia_fecha_baja.nativeElement,
      confirmButtonText: 'Actualizar',
      cancelButtonText: 'Cancelar',
      showCancelButton: true
    }).then(
      (results: any) =>
      {
        if(results.isConfirmed)
        {
          this.matriculaService.actualizar_fecha_baja(this.matricula_asignatura_seleccionada, this.fecha_baja_seleccionada).subscribe(this.peticion_actualizar_fecha);
        }
      }
    )
  }
  
}
