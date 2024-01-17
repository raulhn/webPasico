import { Component, OnInit } from '@angular/core';
import { RemesaService } from 'src/app/servicios/remesa.service';
import Swal from 'sweetalert2';
import { DataTablesOptions } from 'src/app/logica/constantes';
import { URL } from 'src/app/logica/constantes';

@Component({
  selector: 'app-remesas',
  templateUrl: './remesas.component.html',
  styleUrls: ['./remesas.component.css']
})
export class RemesasComponent implements OnInit{

  enlaceFicha: string = URL.URL_FRONT_END + "/detalle_remesa/";
  nid_prueba: string = "27";

  lote: string = "";
  remesas: any;

  dtOpciones_remesas: any = {};

  bCargado_remesas: boolean = false;

  remesa_seleccionada: any;

  constructor(private remesaService: RemesaService)
  {}

  click_remesa(remesa_marcada: any)
  {
    this.remesa_seleccionada = remesa_marcada;
  }


  obtener_remesas = 
  {
    next: (respuesta: any) =>
    {
      var datatable = $('#tabla_remesas').DataTable();
      datatable.destroy();
      this.remesas = respuesta.remesas;

      this.dtOpciones_remesas=
      {
        language: DataTablesOptions.spanish_datatables,
        data: this.remesas,
        dom: 'Bfrtip',
        buttons: [{extend: 'excel', text: 'Generar Excel', className: 'btn btn-dark mb-3'}],
        columns:
        [
          {title: 'Concepto',
            data: 'concepto'
          },
          {
            title: 'Precio',
            data: 'precio'
          },
          {title: 'Fecha',
            data: 'fecha'
          }],
          rowCallback: (row: Node, data: any[] | Object, index: number) => {
            $('td', row).off('click');
            $('td', row).on('click', () => {
              this.click_remesa(data);
              $('#tabla_remesas tr').removeClass('selected')
              $(row).addClass('selected');
            });
            return row;
            }
        }
        $('#tabla_remesas').DataTable(this.dtOpciones_remesas);
        this.bCargado_remesas = true;
      }
  }

  obtener_ultimo_lote =
  {
    next: (respuesta: any) =>
    {
      this.lote = respuesta['ultimo_lote'];
      this.remesaService.obtener_remesas(this.lote).subscribe(this.obtener_remesas);
    }
  }


  ngOnInit(): void {
      this.remesaService.obtener_ultimo_lote().subscribe(this.obtener_ultimo_lote)
  }


  peticion_registrar_remesa =
  {
    next: (respuesta: any) =>
    {
      Swal.fire({
        icon: 'success',
        title: 'Remesa creada',
        text:  'Se ha registrado correctamente',
      }).then(()=> {location.reload()})
    },
    error: (respuesta: any) =>
    {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text:  respuesta.error.info,
      })
    }
  }

  crear_remesa()
  {
    console.log('Registrar remesa')
    this.remesaService.registrar_remesa_persona(this.nid_prueba).subscribe(this.peticion_registrar_remesa);
  }

  buscar()
  {
    this.remesaService.obtener_remesas(this.lote).subscribe(this.obtener_remesas);
  }

  obtenerUrlFicha()
  {
    return this.enlaceFicha + this.remesa_seleccionada.nid_remesa;
  }
}
