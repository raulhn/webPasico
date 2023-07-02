import { Component, Input } from '@angular/core';
import { PersonasService } from 'src/app/servicios/personas.service';

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css']
})
export class PersonaComponent {
  @Input() id: string="4";

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
    next: (respuesta: any) =>
    {
      console.log(respuesta);
    },
    error: (respuesta: any) =>
    {
      console.log(respuesta);
    }
  }

  actualizar_persona()
  {
    let nid: string = this.persona.nid;
    let nif: string = this.persona.nif;
    let nombre: string = this.persona.nombre;
    let primer_apellido: string = this.persona.primer_apellido;
    let segundo_apellido: string = this.persona.segundo_apellido;
    let telefono: string = this.persona.telefono;
    let fecha_nacimiento: string = this.persona.fecha_nacimiento;
    this.personasService.actualizar_persona(nid, nif, nombre, primer_apellido, segundo_apellido, telefono, fecha_nacimiento).subscribe
    (
      this.actualizar
    )
  }
}
