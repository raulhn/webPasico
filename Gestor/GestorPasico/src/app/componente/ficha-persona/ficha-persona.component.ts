import { Input, Component, OnInit } from '@angular/core';
import { PersonasService } from 'src/app/servicios/personas.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-ficha-persona',
  templateUrl: './ficha-persona.component.html',
  styleUrls: ['./ficha-persona.component.css']
})
export class FichaPersonaComponent implements OnInit{

  id_persona: string = "";
  constructor(private rutaActiva: ActivatedRoute, private personasService: PersonasService)
  {
    this.id_persona = rutaActiva.snapshot.params['id'];
  }

  ngOnInit(): void {

  }
}
