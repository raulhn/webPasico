import { Component, OnInit, Input } from '@angular/core';
import { PersonasService } from 'src/app/servicios/personas.service';

@Component({
  selector: 'app-padres-persona',
  templateUrl: './padres-persona.component.html',
  styleUrls: ['./padres-persona.component.css']
})
export class PadresPersonaComponent implements OnInit{
  @Input() nid_persona: string="";

   lista_personas:any[] = [];
   lista_cargada:boolean = false;

   padre: any;
   madre: any;

   constructor(private personaService: PersonasService)
   {

   }
  

   obtener_personas =
   {
     next: (respuesta: any) =>
     {
       console.log(respuesta);
       this.lista_personas = respuesta.personas;
       console.log(this.lista_personas);
       console.log(this.lista_personas[0]);
       console.log(this.lista_personas[0]['nif']);
       this.lista_cargada = true;
     }
   }

   obtener_padre = 
   {
     next: (respuesta: any) =>
     {
      this.padre = respuesta.padre;
     }
   }

   obtener_madre =
   {
     next: (respuesta: any) =>
     {
      this.madre = respuesta.madre;
     }
   }

   ngOnInit(): void {
      this.personaService.obtener_lista_personas().subscribe(this.obtener_personas);
      this.personaService.obtener_madre(this.nid_persona).subscribe(this.obtener_madre);
      this.personaService.obtener_padre(this.nid_persona).subscribe(this.obtener_padre);
   }


  registrar_madre = {
      next: (respuesta: any) =>
      {
          console.log(respuesta)
      }
  }

  registrar_padre = {
    next: (respuesta: any) =>
    {
        console.log(respuesta)
    }
  }
   guardar()
   {
      
      if(this.madre === undefined)
      {
        this.personaService.registrar_madre(this.nid_persona, '').subscribe(this.registrar_madre);
      }
      else
      {
        this.personaService.registrar_madre(this.nid_persona, this.madre.nid).subscribe(this.registrar_madre);
      }
      if(this.padre === undefined)
      {
        this.personaService.registrar_madre(this.nid_persona, '').subscribe(this.registrar_padre);
      }
      else
      {
        this.personaService.registrar_padre(this.nid_persona, this.padre.nid).subscribe(this.registrar_padre);
      }

   }

}
