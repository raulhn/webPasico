import { Component, OnInit } from '@angular/core';
import { PersonasService } from 'src/app/servicios/personas.service';

@Component({
  selector: 'app-registo-musico',
  templateUrl: './registo-musico.component.html',
  styleUrls: ['./registo-musico.component.css']
})
export class RegistoMusicoComponent implements OnInit{
  
  nif: string = "";
  nombre: string = "";
  primer_apellido: string = "";
  segundo_apellido: string = "";
  telefono: string = "";

  constructor(private personasServices: PersonasService)
  {

  }

  ngOnInit(): void {
    
  }

  registro_musico =    {
    next: (respuesta: any) =>
    {
      console.log(respuesta)
      if(!respuesta.error)
      {
        console.log('Musico registrado')
      }
      else{
        console.log(respuesta.message)
      }
    }
  }

  registrar_musico()
  {
    console.log('realizar petición')
    this.personasServices.registrar_persona(this.nif, this.nombre, this.primer_apellido, this.segundo_apellido, this.telefono, '').subscribe(
      this.registro_musico
    )
  }
  
}
