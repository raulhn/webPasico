import { Input, Component, OnInit, ViewChild } from '@angular/core';
import { PersonasService } from 'src/app/servicios/personas.service';
import { ActivatedRoute } from '@angular/router';
import { PersonaComponent } from '../persona/persona.component';
import { PadresPersonaComponent } from '../padres-persona/padres-persona.component';
import { MadresPersonaComponent } from '../madres-persona/madres-persona.component';

@Component({
  selector: 'app-ficha-persona',
  templateUrl: './ficha-persona.component.html',
  styleUrls: ['./ficha-persona.component.css']
})
export class FichaPersonaComponent implements OnInit{


  id_persona: string = "";

  bRegistrado: boolean = false;
  bRegistrado_madre: boolean = false;
  bRegistrado_padre: boolean = false;

  bError:boolean = false;
  bError_padre: boolean = false;
  bError_madre: boolean = false;

  mensaje_registro: string = 'Se ha guardado correctamente';
  
  mensaje_error_padre: string = '';
  mensaje_error_madre: string = '';
  mensaje_error: string = '';

  
  @ViewChild('instancia_persona') instancia_persona!: PersonaComponent;

  @ViewChild('instancia_padre') instancia_padre!: PadresPersonaComponent;

  @ViewChild('instancia_madre') instancia_madre!: MadresPersonaComponent;

  constructor(private rutaActiva: ActivatedRoute, private personasService: PersonasService)
  {
    this.id_persona = rutaActiva.snapshot.params['id'];
  }

  ngOnInit(): void {

  }

  actualizar =
  {
    next: async (respuesta: any) =>
    {
      console.log(respuesta);
      this.bRegistrado = true;
    },
    error: (respuesta: any) =>
    {
      console.log(respuesta);
      this.bError = true;
      this.mensaje_error = 'Se ha producido un error'
    }
  }

  registrar_padre = {
      next: (respuesta: any) =>
      {
          if(!respuesta.error)
          {
            this.bRegistrado_padre = true;
            this.mensaje_registro = 'Se ha guardado correctamente'
          }
      },
      error: (respuesta: any) =>
      {
        this.bError = true;
        this.mensaje_error_padre = respuesta.error.message;
      }
  }


registrar_madre = {
    next: (respuesta: any) =>
    {
        if(!respuesta.error)
        {
          this.bRegistrado_madre = true;
          this.mensaje_registro = 'Se ha guardado correctamente'
        }
    },
    error: (respuesta: any) =>
    {
      this.bError = true;
      this.mensaje_error_madre = respuesta.error.message;
    }
  }

  async guardar()
  {
    var peticion_persona = this.instancia_persona.construye_peticion();
    if (peticion_persona !== null)
    {
      this.personasService.actualizar_persona_form(peticion_persona).subscribe(this.actualizar);
    }

    var peticion_padre = this.instancia_padre.construye_peticion()
    this.personasService.registrar_padre_peticion(peticion_padre).subscribe(this.registrar_padre);

    var peticion_madre = this.instancia_madre.construye_peticion()
    this.personasService.registrar_madre_peticion(peticion_madre).subscribe(this.registrar_madre);

    setTimeout(()=>{                        
      this.bRegistrado = false;
      this.bRegistrado_madre = false;
      this.bRegistrado_padre = false;
    
      this.bError = false;
      this.bError_padre = false;
      this.bError_madre = false;

      this.mensaje_error_padre = '';
      this.mensaje_error_madre = '';
      this.mensaje_error = '';
  }, 2000);
  }
}
