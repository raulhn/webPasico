import { Component, Input } from '@angular/core';
import { PersonasService } from 'src/app/servicios/personas.service';
import { URL } from 'src/app/logica/constantes';

@Component({
  selector: 'app-madres-persona',
  templateUrl: './madres-persona.component.html',
  styleUrls: ['./madres-persona.component.css']
})
export class MadresPersonaComponent {
  @Input() nid_persona: string="";

   lista_personas: any[] = [];
   madre: any;
  

   bError: boolean = false;
   bRegistrado: boolean = false;

   mensaje_error: string = "";
   mensaje_registro: string = "";

   enlaceFicha: string = URL.URL_FRONT_END + "/ficha_persona/";

   constructor(private personaService: PersonasService)
   {

   }
  
   obtener_personas =
   {
     next: (respuesta: any) =>
     {

      this.lista_personas = respuesta.personas;
     }
   }

   obtener_madre = 
   {
     next: (respuesta: any) =>
     {
      this.madre = respuesta.madre['nid'];
     }
   }


   ngOnInit(): void {
      this.personaService.obtener_lista_personas().subscribe(this.obtener_personas);
      this.personaService.obtener_madre(this.nid_persona).subscribe(this.obtener_madre);
   }


  registrar_madre = {
      next: (respuesta: any) =>
      {
          if(!respuesta.error)
          {
            this.bRegistrado = true;
            this.mensaje_registro = 'Se ha guardado correctamente'
          }
      },
      error: (respuesta: any) =>
      {
        this.bError = true;
        this.mensaje_error = respuesta.error.message;
      }
  }


   guardar()
   {
      console.log('Guardar madre '+  this.madre)
      if(this.madre === undefined)
      {
        this.personaService.registrar_madre(this.nid_persona, '').subscribe(this.registrar_madre);
      }
      else
      {
        this.personaService.registrar_madre(this.nid_persona, this.madre).subscribe(this.registrar_madre);
      }

   }

   comparePersona_madre(item: any, selected: any) {
    return item['nid'] == selected;
  }

  construye_peticion() : any
  {
    var peticion: any;
    if(this.madre === undefined)
    {
      peticion = {nid_persona: this.nid_persona, nid_madre: ''};
    }
    else
    {
      peticion =  {nid_persona: this.nid_persona, nid_madre: this.madre};
    }

    return peticion;
  }

  obtenerEnlaceFicha()
  {
    return this.enlaceFicha + this.madre;
  }

  existeMadre()
  {
    return this.madre !== undefined && this.madre !== null;
  }
}
