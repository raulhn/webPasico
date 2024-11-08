import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PersonasService } from 'src/app/servicios/personas.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { DataTablesOptions } from 'src/app/logica/constantes';
import { ElementSchemaRegistry } from '@angular/compiler';

@Component({
  selector: 'app-registro-persona',
  templateUrl: './registro-persona.component.html',
  styleUrls: ['./registro-persona.component.css']
})
export class RegistroPersonaComponent implements OnInit{
 
  @ViewChild('instancia_personas_repetidas') instancia_personas_repetidas!: ElementRef;

  nif: string = "";
  nombre: string = "";
  telefono: string = "";
  primer_apellido: string = "";
  segundo_apellido: string = "";
  fecha_nacimiento: string = "";
  correo_electronico:string = "";
  codigo: string = "";

  bError: boolean = false;
  mensaje_error: string = "";

  bRegistrado: boolean = false;
  mensaje_registro: string = "Se ha registrado correctamente"

  dtOptions_personas: DataTables.Settings = {};
  lista_personas_repetidas: any[] = [];
  bPersonasRepetidas: boolean = false;

  constructor(private personasServices: PersonasService, private router:Router)
  {}

  ngOnInit(): void {
    
  }

  registro_persona =    {
    next: (respuesta: any) =>
    {
      Swal.fire({
        icon: 'success',
        title: 'Registro correcto',
        text: 'Se ha registrado correctamente'
      })
      .then( () =>
        {
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
            {
              this.router.navigate(['/ficha_persona/' + respuesta.nid_persona]);
            }
          )
        })
    },
    error: (respuesta: any) =>
    {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: respuesta['error']['info']
      })
    }
  }


  
  valida_formulario()
  {
    return this.nombre.length > 0 && this.primer_apellido.length > 0;
  }

  obtener_personas_repetidas =
  {
    next: (respuesta:any) =>
    {
      this.lista_personas_repetidas = respuesta.resultados;
      if (this.lista_personas_repetidas.length > 0)
      {
        var datatable = $('#tabla_persona_repetidas').DataTable();
        datatable.destroy();

        this.dtOptions_personas = {
            language: DataTablesOptions.spanish_datatables,
            data: this.lista_personas_repetidas,
            columns:
            [
              {title: 'Nombre',
                data: 'etiqueta'}
            ]
        }

        $('#tabla_persona_repetidas').DataTable(this.dtOptions_personas);

        Swal.fire({
          title: 'Existen otras personas con esos apellidos',
          html: this.instancia_personas_repetidas.nativeElement,
          confirmButtonText: 'Continuar',
          cancelButtonText: 'Cancelar',
          showCancelButton: true
        }).then(
          (results: any) =>
            {
            if(results.isConfirmed)
            {
              this.bPersonasRepetidas = false;
              this.personasServices.registrar_persona(this.nif, this.nombre, this.primer_apellido, this.segundo_apellido, this.telefono, this.fecha_nacimiento, this.correo_electronico, this.codigo).subscribe(
                this.registro_persona
              );
            }
            else { this.bPersonasRepetidas = false;}
          }
        )
        this.bPersonasRepetidas = true;
      }
      else
      {
        this.bPersonasRepetidas = false;
        this.personasServices.registrar_persona(this.nif, this.nombre, this.primer_apellido, this.segundo_apellido, this.telefono, this.fecha_nacimiento, this.correo_electronico, this.codigo).subscribe(
          this.registro_persona
        );
      }
  }
}

valida_nif=
{
  next:(respuesta:any) =>
  {
    this.personasServices.obtener_personas_apellidos(this.primer_apellido, this.segundo_apellido).subscribe(this.obtener_personas_repetidas);
  },
  error: (respuesta: any) =>
    {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: respuesta['error']['info']
      })
  }
}

registrar_persona()
  {
    if (this.valida_formulario())
    {
      if(this.nif.length > 0)
      {
        this.personasServices.valida_nif(this.nif).subscribe(this.valida_nif)
      }
      else
      {
        this.personasServices.obtener_personas_apellidos(this.primer_apellido, this.segundo_apellido).subscribe(this.obtener_personas_repetidas);
      }
    }
  }
}
