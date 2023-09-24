import { Component, OnInit, Input } from '@angular/core';
import { PersonasService } from 'src/app/servicios/personas.service';
import { URL } from 'src/app/logica/constantes';

@Component({
  selector: 'app-padres-persona',
  templateUrl: './padres-persona.component.html',
  styleUrls: ['./padres-persona.component.css']
})
export class PadresPersonaComponent implements OnInit{
  @Input() nid_persona: string="";

   lista_personas: any[] = [];

   padre: any;

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

   obtener_padre = 
   {
     next: (respuesta: any) =>
     {
      this.padre = respuesta.padre['nid'];
     },
     error: (respuesta: any) =>
     {
      
     }
   }


   ngOnInit(): void {
      this.personaService.obtener_lista_personas().subscribe(this.obtener_personas);
      this.personaService.obtener_padre(this.nid_persona).subscribe(this.obtener_padre);
   }


  registrar_padre = {
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
      if(this.padre === undefined)
      {
        this.personaService.registrar_padre(this.nid_persona, '').subscribe(this.registrar_padre);
      }
      else
      {
        this.personaService.registrar_padre(this.nid_persona, this.padre).subscribe(this.registrar_padre);
      }

   }

   comparePersona_madre(item: any, selected: any) {
    return item['nid'] == selected;
  }

 
  comparePersona_padre(item: any, selected: any) {
    return item['nid'] == selected;
  }

  construye_peticion() : any
  {
    var peticion: any;

    if (this.padre === undefined)
    {
      peticion = {nid_persona: this.nid_persona, nid_padre: ''};
    }
    else 
    {
      peticion = {nid_persona: this.nid_persona, nid_padre: this.padre};
    }
    return peticion;
  }

  obtenerEnlaceFicha()
  {
    return this.enlaceFicha + this.padre;
  }

  existePadre()
  {
    return this.padre !== undefined && this.padre !== null;
  }
}
