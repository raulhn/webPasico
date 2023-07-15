import { Component } from '@angular/core';
import { Persona } from 'src/app/logica/persona';
import { URL } from 'src/app/logica/constantes';
import { SociosService } from 'src/app/servicios/socios.service';
import { DataTablesOptions } from 'src/app/logica/constantes';

@Component({
  selector: 'app-lista-socios',
  templateUrl: './lista-socios.component.html',
  styleUrls: ['./lista-socios.component.css']
})
export class ListaSociosComponent {
  listaPersonas:Persona[] = [];
  enlaceFicha: string = URL.URL_FRONT_END + "/ficha_persona/";

  dtOptions: DataTables.Settings = {}
 
  bCargado: boolean = false;

  constructor(private sociosService: SociosService)
  {
    this.dtOptions =
    {
      language: DataTablesOptions.spanish_datatables
    }
  }


  recuperar_socios =
  {
    next : (respuesta: any) =>
    {
      if (!respuesta.error)
      {
        for (let i:number = 0; i < respuesta.socios.length; i++)
        {
          var p: Persona = new Persona();
          p.setNombre(respuesta.socios[i]['nombre']); 
          p.setPrimerApellido(respuesta.socios[i]['primer_apellido']);
          p.setSegundoApellido(respuesta.socios[i]['segundo_apellido']);
          p.setTelefono(respuesta.socios[i]['telefono']);
          p.setNid(respuesta.socios[i]['nid']);
          this.listaPersonas[i] = p;
        }
        this.bCargado = true;
      }
      console.log(this.listaPersonas)
    }
  }


  ngOnInit(): void {
    this.sociosService.obtener_lista_socios().subscribe(
     this.recuperar_socios
    )
  }

  obtenerEnlaceFicha(nid: string)
  {
    return this.enlaceFicha + nid;
  }
}
