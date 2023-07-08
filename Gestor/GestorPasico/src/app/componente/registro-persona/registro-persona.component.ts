import { Component, OnInit } from '@angular/core';
import { PersonasService } from 'src/app/servicios/personas.service';

@Component({
  selector: 'app-registro-persona',
  templateUrl: './registro-persona.component.html',
  styleUrls: ['./registro-persona.component.css']
})
export class RegistroPersonaComponent implements OnInit{
 

  nif: string = "";
  nombre: string = "";
  telefono: string = "";
  primer_apellido: string = "";
  segundo_apellido: string = "";
  fecha_nacimiento: string = "";
  correo_electronico:string = "";

  bError: boolean = false;
  mensaje_error: string = "";

  bRegistrado: boolean = false;
  mensaje_registro: string = "Se ha registrado correctamente"

  constructor(private personasServices: PersonasService)
  {}

  ngOnInit(): void {
    
  }

  registro_persona =    {
    next: (respuesta: any) =>
    {
      console.log(respuesta)
      if(!respuesta.error)
      {
        this.bRegistrado = true;
      }
      else{
        console.log(respuesta.message)
      }
    },
    error: (respuesta: any) =>
    {
      this.bError = true;
      this.mensaje_error = respuesta.error.message;
    }
  }

  
  valida_formulario()
  {
    return this.nombre.length > 0 && this.primer_apellido.length > 0 &&
           this.fecha_nacimiento.length > 0;
  }


  registrar_persona()
  {
    if (this.valida_formulario())
    {
      this.personasServices.registrar_persona(this.nif, this.nombre, this.primer_apellido, this.segundo_apellido, this.telefono, this.fecha_nacimiento, this.correo_electronico).subscribe(
        this.registro_persona
      )
    }
  }
}
