import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PersonasService } from 'src/app/servicios/personas.service';

@Component({
  selector: 'app-ficha-forma-pago',
  templateUrl: './ficha-forma-pago.component.html',
  styleUrls: ['./ficha-forma-pago.component.css']
})
export class FichaFormaPagoComponent implements OnInit{

  nid_forma_pago: string ="";

  forma_pago: any;

  constructor(private personaService: PersonasService, private rutaActiva: ActivatedRoute)
  {
    this.nid_forma_pago = rutaActiva.snapshot.params['nid_forma_pago'];
  }

  peticion_forma_pago =
  {
    next: (respuesta: any) =>
    {
      this.forma_pago = respuesta.forma_pago;
    }
  }

  ngOnInit(): void {
    this.personaService.obtener_forma_pago_nid(this.nid_forma_pago).subscribe(this.peticion_forma_pago);
  }
}
