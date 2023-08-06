import { AfterViewInit, Component, OnDestroy, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';
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
  dtOptions_profesor: DataTables.Settings = {};

  message: string ="";
  asignatura_seleccionada: any = "";
  lista_personas: any[] = [];
  profesor_nuevo: string = "";

  bSelecionada_asignatura: boolean = false;


  @ViewChild('instancia_asignatura') instancia_asignatura!: ElementRef;


  constructor(private asignaturasServices: AsignaturasService, private personaService: PersonasService)
  {

  }

  bCargado: boolean = false;
  bCargadoProfesor: boolean = false;

  asignaturas: any[] = [];
  profesores: any[] = [];

  refrescar_asignaturas = 
  {
    next: (respuesta: any) =>
    {
      var datatable = $('#tabla_asignaturas').DataTable();
      datatable.destroy();
      this.asignaturas = respuesta.asignaturas;

      this.dtOptions = {
        data: this.asignaturas,
        dom: 'Bfrtip',
        buttons: [{extend: 'excel', text: 'Generar Excel', className: 'btn btn-dark mb-3'}],
        columns:
        [
          {title: 'Asignatura',
            data: 'descripcion'
          },
          {
            title: '',
            data: null,
            render: (e:any) => { return '<a href="' + '/ficha_asignatura/' + e.nid + '"> <button class="btn btn-dark mb-3"> Ver Ficha</button></a>'}
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
      console.log(this.asignaturas)
      console.log(this.asignaturas[0])
      this.bCargado = true;

      this.dtOptions = {
        data: this.asignaturas,
        dom: 'Bfrtip',
        buttons: [{extend: 'excel', text: 'Generar Excel', className: 'btn btn-dark mb-3'}
      ], // https://therichpost.com/how-to-implement-datatable-with-print-excel-csv-buttons-in-angular-10/
        columns:
        [
          {title: 'Asignatura',
            data: 'descripcion'},
            {
              title: '',
              data: null,
              render: (e:any) => { return '<a href="' + '/ficha_asignatura/' + e.nid + '"> <button class="btn btn-dark mb-3"> Ver Ficha</button></a>'}
            }
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

  obtener_profesores =
  {
    next: (respuesta:any) =>
    {
      this.profesores = respuesta.profesores;
      var datatable = $('#tabla_profesor').DataTable();
      datatable.destroy();

      this.dtOptions_profesor = {
          data: this.profesores,
          columns:
          [
            {title: 'Nombre',
              data: 'nombre'},
              {title: 'Primer apellido',
              data: 'primer_apellido'},
              {title: 'Segundo apellido',
              data: 'segundo_apellido'},
              {
                title: '',
                data: null,
                render: (e) => { return '<a href="' + '/ficha_persona/' + e.nid_persona + '"> <button class="btn btn-primary"> Ver Ficha</button></a>'}
              }
          ]
      }

      $('#tabla_profesor').DataTable(this.dtOptions_profesor);
  }
}

  click_asignatura(asignatura_marcada: any)
  {
    this.asignatura_seleccionada = asignatura_marcada;
    this.asignaturasServices.obtener_profesores_asingatura(this.asignatura_seleccionada.nid).subscribe(this.obtener_profesores);
    this.bSelecionada_asignatura = true;
  }


  ngOnInit(): void {
    this.personaService.obtener_lista_personas().subscribe(this.obtener_personas);
    this.asignaturasServices.obtener_asignaturas().subscribe(this.recuperar_asignaturas);
    
    // Inicializa el dataTable de los profesores vacío //
    this.dtOptions_profesor =
      {
        data: [],
        columns: [
          {
          title: 'Nombre',
          data: 'nombre'},
          {title: 'Primer apellido',
          data: 'primer_apellido'},
          {title: 'Segundo apellido',
          data: 'segundo_apellido'},
          {
            defaultContent: "<button class='showIdButton' (href)=>Ficha asignatura</button>"
          }
      ]
      }
  }

  nueva_asignatura: string = "";

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

  obtener_personas =
  {
    next: (respuesta: any) =>
    {
     this.lista_personas = respuesta.personas;
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


   add_profesor =
   {
    next: (respuesta: any) =>
    {
      Swal.fire({
        icon: 'success',
        title: 'Profesor registrado',
        text: 'Se ha registrado el profesor',
      });
      this.asignaturasServices.obtener_profesores_asingatura(this.asignatura_seleccionada.nid).subscribe(this.obtener_profesores);
    },
    error: (respuesta: any) =>
    {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Se ha producido un error al registrar el profesor',
      })
    }
   }


   addProfesor()
   {
      if(this.asignatura_seleccionada === "")
      {
        Swal.fire({
          icon: 'error',
          title: 'Selecciona asignatura',
          text: 'Se tiene que seleccionar una asignatura',
        })
      }
      else
      {
        Swal.fire({
          title: 'Crear profesor',
          html: this.instancia_asignatura.nativeElement,
          confirmButtonText: 'Crear',
          showCancelButton: true,
          preConfirm: () => {
            this.nueva_asignatura = (<HTMLInputElement>document.getElementById("descripcion_asignatura")).value;
          }
        }).then(
          (results: any) =>
            {
            if(results.isConfirmed)
            {
              this.asignaturasServices.registrar_profesor(this.profesor_nuevo, this.asignatura_seleccionada.nid).subscribe(this.add_profesor);
            }
          }
        )
      }
   }

   comparePersona_profesor(item: any, selected: any) {
    return item['nid'] == selected;
  }

}
