import { Component, OnInit, Input  } from '@angular/core';
import { PersonasService } from 'src/app/servicios/personas.service';

@Component({
  selector: 'app-forma-pago',
  templateUrl: './forma-pago.component.html',
  styleUrls: ['./forma-pago.component.css']
})
export class FormaPagoComponent implements OnInit{

  formas_pago: any[] = [];
  bCargado_formas_pago: boolean = false;
  forma_pago: string = "";
  ccc: string = "";

  personas: any[] = [];
  persona: string = "";

  @Input() id: string="";

  constructor(private personaService: PersonasService)
  {

  }

  obtener_formas_pago =
  {
    next: (respuesta: any) =>
    {
      this.formas_pago = respuesta.formas_pago;
      this.bCargado_formas_pago = true;
    }
  }

  obtener_personas = 
  {
    next: (respuesta: any) =>
    {
      this.personas = respuesta.personas;
    }
  }

  ngOnInit(): void {
      this.personaService.obtener_formas_pago().subscribe(this.obtener_formas_pago);
      this.personaService.obtener_lista_personas().subscribe(this.obtener_personas);
  }
}
