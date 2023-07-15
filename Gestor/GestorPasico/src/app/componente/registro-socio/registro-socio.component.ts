import { Component, OnInit } from '@angular/core';
import { PersonasService } from 'src/app/servicios/personas.service';
import { SociosService } from 'src/app/servicios/socios.service';

@Component({
  selector: 'app-registro-socio',
  templateUrl: './registro-socio.component.html',
  styleUrls: ['./registro-socio.component.css']
})
export class RegistroSocioComponent implements OnInit{

  lista_personas: any[] = [];

  socio: any;
  num_socio: string = "";
  fecha_alta: string = "";

  bError: boolean = false;
  bRegistrado: boolean = false;

  mensaje_error: string = "";
  mensaje_registro: string = "";

  constructor(private personaService: PersonasService, private socioService: SociosService)
  {

  }

  obtener_personas =
  {
    next: (respuesta: any) =>
    {
     this.lista_personas = respuesta.personas;
    }
  }
  
  ngOnInit(): void {
    this.personaService.obtener_lista_personas().subscribe(this.obtener_personas);
  }

  comparePersona_socio(item: any, selected: any) {
    return item['nid'] == selected;
  }

  registrar_socio =
  {
    next: (respuesta: any) =>
    {
      this.bRegistrado = true;
      this.mensaje_registro = 'Se ha registrado como socio'
    },
    error: (respuesta: any) =>
    {
      this.bError = true;
      this.mensaje_error = respuesta.error.info;
    }
  }

  guardar()
  {
    this.socioService.registrar_socio(this.socio, this.num_socio, this.fecha_alta).subscribe(
      this.registrar_socio
    )
  }
}
