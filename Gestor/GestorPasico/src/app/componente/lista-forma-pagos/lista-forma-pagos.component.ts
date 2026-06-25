import {
  Component,
  OnInit,
  WritableSignal,
  Signal,
  signal,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataTablesOptions, URL } from 'src/app/logica/constantes';
import { PersonasService } from 'src/app/servicios/personas.service';

@Component({
  selector: 'app-lista-forma-pagos',
  templateUrl: './lista-forma-pagos.component.html',
  styleUrls: ['./lista-forma-pagos.component.css'],
  standalone: false,
})
export class ListaFormaPagosComponent implements OnInit {
  $lista_forma_pagos: WritableSignal<any[]> = signal([]);
  $id_tabla_forma_pagos: Signal<string> = signal('tabla_forma_pago');
  cabecera_forma_pagos: any[] = [
    { title: 'Iban', data: 'iban' },
    { title: 'Activo', data: 'activo' },
    {
      title: 'Pasarela Pago',
      data: 'nid_metodo_pasarela_pago',
    },
  ];

  id_persona: string = '';

  bCargadasFormaPago: boolean = false;
  forma_pago_seleccionada: string = '';

  dtOptions_forma_pagos: any = {};
  URL_FICHA_FORMA_PAGO = '/ficha_forma_pago/';

  constructor(
    private personaServices: PersonasService,
    private rutaActiva: ActivatedRoute,
  ) {
    this.id_persona = rutaActiva.snapshot.params['nid_persona'];
  }

  click_ficha(forma_pago: any) {
    this.forma_pago_seleccionada = forma_pago['nid'];
  }

  peticion_forma_pagos = {
    next: (respuesta: any) => {
      this.$lista_forma_pagos.set(respuesta.formas_pago);
      this.bCargadasFormaPago = true;
    },
  };

  ngOnInit(): void {
    this.personaServices
      .obtener_forma_pagos_persona(this.id_persona)
      .subscribe(this.peticion_forma_pagos);
  }

  obtener_url_ficha() {
    return this.URL_FICHA_FORMA_PAGO + this.forma_pago_seleccionada;
  }
}
