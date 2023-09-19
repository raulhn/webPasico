import { Component, Input } from '@angular/core';
import { PersonasService } from 'src/app/servicios/personas.service';

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css']
})
export class PersonaComponent {
  @Input() id: string="";

  persona: any;


  constructor(private personasService: PersonasService)
  {

  }

  obtener_persona = 
  {
    next : (respuesta: any) =>
    {
      this.persona = respuesta.persona;
      this.persona.fecha_nacimiento = this.persona.fecha_nacimiento.substring(0, 10);
    }
  }



  ngOnInit(): void {
    this.personasService.obtener_persona(this.id).subscribe(
      this.obtener_persona
    )
  }

  actualizar =
  {
    next: async (respuesta: any) =>
    {
      console.log(respuesta);
    },
    error: (respuesta: any) =>
    {
      console.log(respuesta);
    }
  }

  valida_formulario()
  {
    return this.persona.nombre.length > 0 && this.persona.primer_apellido.length > 0;
  }

  actualizar_persona()
  {
      if (this.valida_formulario())
      {
        let nid: string = this.persona.nid;
        let nif: string = this.persona.nif;
        let nombre: string = this.persona.nombre;
        let primer_apellido: string = this.persona.primer_apellido;
        let segundo_apellido: string = this.persona.segundo_apellido;
        let telefono: string = this.persona.telefono;
        let fecha_nacimiento: string = this.persona.fecha_nacimiento;
        let correo_electronico: string = this.persona.correo_electronico;

        this.personasService.actualizar_persona(nid, nif, nombre, primer_apellido, segundo_apellido, telefono, fecha_nacimiento, correo_electronico).subscribe
        (
          {next: async (respuesta: any) =>
          {
            console.log(respuesta);
          },
          error: (respuesta: any) =>
          {
            console.log(respuesta);
          }}
        )
      }
  }

  construye_peticion() : any
  {
    var peticion: any = null;
    if (this.valida_formulario())
    {
      peticion = {nid:  this.persona['nid'], nif:  this.persona['nif'], nombre:  this.persona['nombre'], primer_apellido:  this.persona['primer_apellido'], 
        segundo_apellido:  this.persona['segundo_apellido'], telefono:  this.persona['telefono'], fecha_nacimiento:  this.persona['fecha_nacimiento'], 
        correo_electronico:  this.persona['correo_electronico']};
    }
    return peticion;
  }
  
}
