import { AfterViewInit, Component, OnDestroy, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';
import { DataTablesOptions } from 'src/app/logica/constantes';
import { AsignaturasService } from 'src/app/servicios/asignaturas.service';
import { PersonasService } from 'src/app/servicios/personas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignaturas',
  templateUrl: './asignaturas.component.html',
  styleUrls: ['./asignaturas.component.css']
})
export class AsignaturasComponent implements OnInit {

  dtOptions: any = {};


  message: string ="";
  asignatura_seleccionada: any = "";

  bSelecionada_asignatura: boolean = false;

  nueva_asignatura: string = "";

  constructor(private asignaturasServices: AsignaturasService, private personaService: PersonasService)
  {

  }

  bCargado: boolean = false;
  bCargadoProfesor: boolean = false;

  asignaturas: any[] = [];

  refrescar_asignaturas = 
  {
    next: (respuesta: any) =>
    {
      var datatable = $('#tabla_asignaturas').DataTable();
      datatable.destroy();
      this.asignaturas = respuesta.asignaturas;

      this.dtOptions = {
        language: DataTablesOptions.spanish_datatables,
        data: this.asignaturas,
        dom: 'Bfrtip',
        buttons: [{extend: 'excel', text: 'Generar Excel', className: 'btn btn-dark mb-3'}],
        columns:
        [
          {title: 'Asignatura',
            data: 'descripcion'
          }],
          rowCallback: (row: Node, data: any[] | Object, index: number) => {
            $('td', row).off('click');
            $('td', row).on('click', () => {
              this.click_asignatura(data);
              $('#tabla_asignaturas tr').removeClass('selected')
              $(row).addClass('selected');
            });
            return row;
        }
      };

      $('#tabla_asignaturas').DataTable(this.dtOptions);
      $('#tabla_asignaturas button').addClass('btn btn-primary mb-3 ');
    }
  }

  recuperar_asignaturas =
  {
    next: (respuesta: any) =>
    {
      this.asignaturas = respuesta.asignaturas;
      this.bCargado = true;

      this.dtOptions = {
        data: this.asignaturas,
        dom: 'Bfrtip',
        buttons: [{extend: 'excel', text: 'Generar Excel', className: 'btn btn-dark mb-3'}
      ], // https://therichpost.com/how-to-implement-datatable-with-print-excel-csv-buttons-in-angular-10/
        columns:
        [
          {title: 'Asignatura',
            data: 'descripcion'}
         ],
        rowCallback: (row: Node, data: any[] | Object, index: number) => {
          $('td', row).off('click');
          $('td', row).on('click', () => {
            this.click_asignatura(data);
            $('#tabla_asignaturas tr').removeClass('selected')
            $(row).addClass('selected');
          });
          return row;
        }
      };
      $('#tabla_asignaturas button').addClass('btn btn-primary mb-3 ');
    }
  }

 

  click_asignatura(asignatura_marcada: any)
  {
    this.asignatura_seleccionada = asignatura_marcada;
    this.bSelecionada_asignatura = true;
  }



  ngOnInit(): void {
    
    this.asignaturasServices.obtener_asignaturas().subscribe(this.recuperar_asignaturas);
    

  }



  registro =
  {
    next: (respuesta: any) =>
    {
      Swal.fire({
        icon: 'success',
        title: 'Registro correcto',
        text: 'Se ha registrado correctamente'
      })
      this.asignaturasServices.obtener_asignaturas().subscribe(this.refrescar_asignaturas);
    },
    error: (respuesta: any) =>
    {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Se ha producido un error',
      })
    }
  }



  url_ficha_asignatura()
  {
    return '/ficha_asignatura/' + this.asignatura_seleccionada.nid;
  }

  addAsignatura()
  {
    //https://sweetalert2.github.io/
    Swal.fire({
      title: 'Crear asignatura',
      html : `<input type="text" id="nombre_asignatura" class="swal2-input" placeholder="Username">
             `,
      confirmButtonText: 'Crear',
      showCancelButton: true,
      preConfirm: () => {
        this.nueva_asignatura = (<HTMLInputElement>document.getElementById("nombre_asignatura")).value;
      }
    }).then(
      (results: any) =>
        {
        if(results.isConfirmed)
        {
          this.asignaturasServices.registrar_asignatura(this.nueva_asignatura).subscribe(this.registro);
        }
      }
    )
   }


}
