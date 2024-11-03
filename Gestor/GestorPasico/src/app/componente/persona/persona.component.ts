import { Component, Input } from '@angular/core';
import { PersonasService } from 'src/app/servicios/personas.service';
import { SociosService } from 'src/app/servicios/socios.service';

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css']
})
export class PersonaComponent {
  @Input() id: string="";

  persona: any;
  bRecuperado_persona: boolean = false;

  lista_socios: any;

  socio_recuperado: any;
  bRecuperadoSocio: boolean = false;

  constructor(private personasService: PersonasService, private sociosService: SociosService)
  {

  }

  obtener_persona = 
  {
    next : (respuesta: any) =>
    {
      this.bRecuperado_persona = true;
      this.persona = respuesta.persona;
      if(this.persona.fecha_nacimiento != null && this.persona.fecha_nacimiento.length > 0)
      {
        this.persona.fecha_nacimiento = this.persona.fecha_nacimiento.substring(0, 10);
      }
    }
  }

  obtener_socios = 
  {
    next: (respuesta: any) =>
    {
      this.lista_socios = respuesta.personas;
    }
  }

  ngOnInit(): void {
    this.sociosService.obtener_lista_socios_alta().subscribe(this.obtener_socios);
    this.personasService.obtener_persona(this.id).subscribe(
      this.obtener_persona
    );
    this.sociosService.obtener_socio(this.id).subscribe(this.recupera_socio);
  }


  valida_formulario()
  {
    return this.persona.nombre.length > 0 && this.persona.primer_apellido.length > 0;
  }

 
  construye_peticion() : any
  {
    var peticion: any = null;
    if (this.valida_formulario())
    {
      peticion = {nid:  this.persona['nid'], nif:  this.persona['nif'], nombre:  this.persona['nombre'], primer_apellido:  this.persona['primer_apellido'], 
        segundo_apellido:  this.persona['segundo_apellido'], telefono:  this.persona['telefono'], fecha_nacimiento:  this.persona['fecha_nacimiento'], 
        correo_electronico:  this.persona['correo_electronico'], codigo: this.persona['codigo'], nid_socio: this.persona['nid_socio']};
    }
    return peticion;
  }
  
  comparePersona_socio(item: any, selected: any) {
    return item['nid'] == selected;
  }

  recupera_socio = 
  {
    next: (respuesta: any) =>
    {
      
      if (respuesta.socio.length > 0)
      {
        this.socio_recuperado = respuesta['socio'][0];
        this.bRecuperadoSocio = true;
      }
    }
  }


}
