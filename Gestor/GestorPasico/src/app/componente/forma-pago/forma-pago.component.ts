import { Component, OnInit, Input  } from '@angular/core';
import { PersonasService } from 'src/app/servicios/personas.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-forma-pago',
  templateUrl: './forma-pago.component.html',
  styleUrls: ['./forma-pago.component.css']
})
export class FormaPagoComponent implements OnInit{

  formas_pago: any[] = [];
  bCargado_formas_pago: boolean = false;
  forma_pago: string = "";
  iban: string = "";

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
      console.log('Obtenida forma pago')
      this.formas_pago = respuesta.formas_pago;
      this.bCargado_formas_pago = true;
    }
  }

  obtener_personas = 
  {
    next: (respuesta: any) =>
    {
      this.personas = respuesta.personas.map((elemento: any) =>{return{etiqueta_persona: elemento.etiqueta, clave: elemento.nid}});
    }
  }

  obtener_forma_pago_persona =
  {
    next: (respuesta: any) =>
    {
      this.forma_pago = respuesta.nid_forma_pago['nid_forma_pago'];
    }
  }

  ngOnInit(): void {
      this.personaService.obtener_pago_persona(this.id).subscribe(this.obtener_forma_pago_persona);
      this.personaService.obtener_formas_pago().subscribe(this.obtener_formas_pago);
      this.personaService.obtener_lista_personas().subscribe(this.obtener_personas);
  }

  registrar_forma_pago =
  {
    next: (respuesta: any) =>
    {
      Swal.fire({
        icon: 'success',
        title: 'Registro correcto',
        text: 'Se ha registrado correctamente la forma de pago',
      });
      this.personaService.obtener_formas_pago().subscribe(this.obtener_formas_pago);
    },
    error: (respuesta: any) =>
    {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: respuesta['error']['info'],
      })
    }
  }

  guardar()
  {
    this.personaService.registrar_forma_pago(this.persona, this.iban).subscribe(this.registrar_forma_pago);
  }

  construye_peticion()
  {
    return {nid_persona: this.id, nid_forma_pago: this.forma_pago}
  }

  compareForma_pago(item: any, selected: any) {
    return item['nid'] == selected;
  }
}
