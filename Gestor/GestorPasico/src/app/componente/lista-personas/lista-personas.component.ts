import { Component } from '@angular/core';
import { PersonasService } from 'src/app/servicios/personas.service';
import { Persona } from 'src/app/logica/persona';
import { URL } from 'src/app/logica/constantes';

@Component({
  selector: 'app-lista-personas',
  templateUrl: './lista-personas.component.html',
  styleUrls: ['./lista-personas.component.css']
})
export class ListaPersonasComponent {

  listaPersonas:Persona[] = [];
  enlaceFicha: string = URL.URL_FRONT_END + "/ficha_persona/";
  constructor(private personasService:PersonasService)
  {

  }


  ngOnInit(): void {
    this.personasService.obtener_lista_personas().subscribe(
      (resultado:any) =>
      {
        if (!resultado.error)
        {
          for (let i:number = 0; i < resultado.personas.length; i++)
          {
            var p: Persona = new Persona();
            p.setNombre(resultado.personas[i]['nombre']); 
            p.setPrimerApellido(resultado.personas[i]['primer_apellido']);
            p.setSegundoApellido(resultado.personas[i]['segundo_apellido']);
            p.setTelefono(resultado.personas[i]['telefono']);
            p.setNid(resultado.personas[i]['nid']);
            this.listaPersonas[i] = p;
          }
        }
        console.log(this.listaPersonas)
      }
    )
  }

  obtenerEnlaceFicha(nid: string)
  {
    return this.enlaceFicha + nid;
  }
}
