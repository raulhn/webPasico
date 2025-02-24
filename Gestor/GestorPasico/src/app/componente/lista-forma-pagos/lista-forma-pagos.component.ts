import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataTablesOptions, URL } from 'src/app/logica/constantes';
import { PersonasService } from 'src/app/servicios/personas.service';

@Component({
  selector: 'app-lista-forma-pagos',
  templateUrl: './lista-forma-pagos.component.html',
  styleUrls: ['./lista-forma-pagos.component.css']
})
export class ListaFormaPagosComponent implements OnInit{

  lista_forma_pagos: any;
  id_persona: string = "";

  bCargadasFormaPago: boolean = false;
  forma_pago_seleccionada: string = "";

  dtOptions_forma_pagos: any= {}
  URL_FICHA_FORMA_PAGO = "/ficha_forma_pago/";


  constructor(private personaServices: PersonasService, private rutaActiva: ActivatedRoute)
  {
    this.id_persona = rutaActiva.snapshot.params['nid_persona'];
  }

  click_ficha(forma_pago: any)
  {
    this.forma_pago_seleccionada = forma_pago['nid'];
  }

  peticion_forma_pagos =
  {
    next: (respuesta: any) =>
    {
      this.lista_forma_pagos = respuesta.formas_pago;

      var datatable = $('#tabla_forma_pago').DataTable();
      datatable.destroy();

      this.dtOptions_forma_pagos =
      {
        language: DataTablesOptions.spanish_datatables,
        data: this.lista_forma_pagos,
        dom: 'Bfrtip',
        buttons: [{extend: 'excel', text: 'Generar Excel', className: 'btn btn-dark mb-3'}],
        columns:
        [
          {title: 'Iban',
          data: 'iban'
          },
          {title: 'Activo',
            data: 'activo'
          },
          {
            title: 'Pasarela Pago',
            data: 'nid_metodo_pasarela_pago'
          }
        ],
          rowCallback: (row: Node, data: any[] | Object, index: number) => {
            $('td', row).off('click');
            $('td', row).on('click', () => {
              this.click_ficha(data);
              $('#tabla_forma_pago tr').removeClass('selected')
              $(row).addClass('selected');
            });
            return row;
            }
        }
        $('#tabla_forma_pago').DataTable(this.dtOptions_forma_pagos);

      this.bCargadasFormaPago = true;
    }
  }

  ngOnInit(): void {
      this.personaServices.obtener_forma_pagos_persona(this.id_persona).subscribe(this.peticion_forma_pagos);
  }

  obtener_url_ficha()
  {

    return this.URL_FICHA_FORMA_PAGO + this.forma_pago_seleccionada;
  }
}
