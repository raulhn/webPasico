import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';
import { AsignaturasService } from 'src/app/servicios/asignaturas.service';
import { PersonasService } from 'src/app/servicios/personas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-asignaturas',
  templateUrl: './asignaturas.component.html',
  styleUrls: ['./asignaturas.component.css']
})
export class AsignaturasComponent implements OnInit{

  dtOptions: DataTables.Settings = {};

  message: string ="";

  asignatura_seleccionada: any = "";

  lista_personas: any[] = [];

  profesor_nuevo: string = "";


  @ViewChild('instancia_asignatura') instancia_asignatura!: ElementRef;


  constructor(private asignaturasServices: AsignaturasService, private personaService: PersonasService)
  {

  }

  bCargado: boolean = false;
  asignaturas: any[] = [];
  profesores: any[] = [];

  recuperar_asignaturas =
  {
    next: (respuesta: any) =>
    {
      this.asignaturas = respuesta.asignaturas;
      console.log(this.asignaturas)
      console.log(this.asignaturas[0])
      this.bCargado = true;
    }
  }


  obtener_profesores =
  {
    next: (respuesta:any) =>
    {
      this.profesores = respuesta.profesores;
      console.log(this.profesores)
    }
  }

  click_asignatura(asignatura_marcada: any)
  {
    this.asignatura_seleccionada = asignatura_marcada;
    console.log(this.asignatura_seleccionada)
    this.asignaturasServices.obtener_profesores_asingatura(this.asignatura_seleccionada.nid).subscribe();
  }


  ngOnInit(): void {
    this.personaService.obtener_lista_personas().subscribe(this.obtener_personas);

      this.dtOptions = {
        ajax: 'data/data.json',
        columns: [{
          title: 'ID',
          data: 'id'
        }, {
          title: 'First name',
          data: 'firstName'
        }, {
          title: 'Last name',
          data: 'lastName'
        }],
        rowCallback: (row: Node, data: any[] | Object, index: number) => {
          const self = this;
          // Unbind first in order to avoid any duplicate handler
          // (see https://github.com/l-lin/angular-datatables/issues/87)
          // Note: In newer jQuery v3 versions, `unbind` and `bind` are 
          // deprecated in favor of `off` and `on`
          $('td', row).off('click');
          $('td', row).on('click', () => {
            self.click_asignatura(data);
          });
          return row;
        }
      };

    this.asignaturasServices.obtener_asignaturas().subscribe(
      this.recuperar_asignaturas
    )
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

  addAsignatura()
  {
    //https://sweetalert2.github.io/
    Swal.fire({
      title: 'Crear asignatura',
      html : `<input type="text" id="descripcion_asignatura" class="swal2-input" placeholder="Username">
             `,
      confirmButtonText: 'Crear',
      showCancelButton: true,
      preConfirm: () => {
        this.nueva_asignatura = (<HTMLInputElement>document.getElementById("descripcion_asignatura")).value;
      }
    }).then(
      (results) =>
        {
        if(results.isConfirmed)
        {
          this.asignaturasServices.registrar_asignatura(this.nueva_asignatura).subscribe(this.registro);
        }
      }
    )
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
          (results) =>
            {
            if(results.isConfirmed)
            {
              this.asignaturasServices.registrar_asignatura(this.nueva_asignatura).subscribe(this.registro);
            }
          }
        )
      }
   }

   comparePersona_profesor(item: any, selected: any) {
    return item['nid'] == selected;
  }

}
