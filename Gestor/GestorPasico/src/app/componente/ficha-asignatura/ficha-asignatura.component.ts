import { Component, Input, OnInit, ElementRef, ViewChild } from '@angular/core';
import { AsignaturasService } from 'src/app/servicios/asignaturas.service';
import { PersonasService } from 'src/app/servicios/personas.service';
import { DataTablesOptions } from 'src/app/logica/constantes';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-ficha-asignatura',
  templateUrl: './ficha-asignatura.component.html',
  styleUrls: ['./ficha-asignatura.component.css']
})
export class FichaAsignaturaComponent implements OnInit{

  @Input() nid_asignatura: string = "";

  
  @ViewChild('instancia_asignatura') instancia_asignatura!: ElementRef;

  descripcion: string = "";
  precio: string ="";

  dtOptions_profesor: DataTables.Settings = {};
  profesor_nuevo: string = "";

  lista_personas: any[] = [];

  profesores: any[] = [];

  nueva_asignatura: string = "";

  constructor(private asignaturaServices: AsignaturasService, private personaService: PersonasService)
  {

  }

  recuperar_asignatura =
  {
    next: (respuesta: any) =>
    {

      console.log(respuesta['asignatura']['descripcion'])
      console.log(respuesta)
      console.log(respuesta['asignatura']['precio'])

      this.descripcion = respuesta.asignatura.descripcion;
      this.precio = respuesta.asignatura.precio;
      
    }
  }

  registrar_asignatura =
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

  obtener_profesores =
  {
    next: (respuesta:any) =>
    {
      this.profesores = respuesta.profesores;
      var datatable = $('#tabla_profesor').DataTable();
      datatable.destroy();

      this.dtOptions_profesor = {
          language: DataTablesOptions.spanish_datatables,
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

add_profesor =
   {
    next: (respuesta: any) =>
    {
      Swal.fire({
        icon: 'success',
        title: 'Profesor registrado',
        text: 'Se ha registrado el profesor',
      });
      this.asignaturaServices.obtener_profesores_asingatura(this.nid_asignatura).subscribe(this.obtener_profesores);
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

   comparePersona_profesor(item: any, selected: any) {
    return item['nid'] == selected;
  }
  
addProfesor()
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
          this.asignaturaServices.registrar_profesor(this.profesor_nuevo, this.nid_asignatura).subscribe(this.add_profesor);
        }
      }
    )
   
}

  guardar()
  {
    this.asignaturaServices.actualizar_asignatura(this.descripcion, this.nid_asignatura, this.precio).subscribe(this.registrar_asignatura);
  }

  ngOnInit(): void {
    this.personaService.obtener_lista_personas().subscribe(this.obtener_personas);
    this.asignaturaServices.obtener_asignatura(this.nid_asignatura).subscribe(this.recuperar_asignatura);
    this.asignaturaServices.obtener_profesores_asingatura(this.nid_asignatura).subscribe(this.obtener_profesores);
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
            data: 'segundo_apellido'}
        ]
        }
  }
}
