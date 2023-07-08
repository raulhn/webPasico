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

  /*
  @ViewChild('instancia_persona') instancia_persona!: PersonaComponent;

  @ViewChild('instancia_padre') instancia_padre!: PadresPersonaComponent;

  @ViewChild('instancia_madre') instancia_madre!: MadresPersonaComponent;*/

  constructor(private rutaActiva: ActivatedRoute, private personasService: PersonasService)
  {
    this.id_persona = rutaActiva.snapshot.params['id'];
  }

  ngOnInit(): void {

  }

  /*
  guardar()
  {
    this.instancia_persona.actualizar_persona();
    this.instancia_madre.guardar();
    this.instancia_padre.guardar();
  }*/
}
