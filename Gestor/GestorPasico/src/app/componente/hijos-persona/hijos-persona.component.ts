import { Component, OnInit, Input } from '@angular/core';
import { PersonasService } from 'src/app/servicios/personas.service';
import { URL } from 'src/app/logica/constantes';

@Component({
    selector: 'app-hijos-persona',
    templateUrl: './hijos-persona.component.html',
    styleUrls: ['./hijos-persona.component.css'],
    standalone: false
})
export class HijosPersonaComponent implements OnInit{

  @Input() nid_persona: string = "";

  hijos: any;
  bCargado: boolean = false;

  enlaceFicha: string = URL.URL_FRONT_END + "/ficha_persona/";

  constructor(private personaService: PersonasService)
  {

  }

  peticion_obtener_hijos =
  {
    next: (respuesta: any) =>
    {
      this.hijos = respuesta['hijos'];
      this.bCargado = true;
    }
  }

  ngOnInit(): void {
    this.personaService.obtener_hijos(this.nid_persona).subscribe(this.peticion_obtener_hijos);
  }

  obtenerUrlFicha(nid_hijo: string)
  {
    this.enlaceFicha + nid_hijo;
  }

}
