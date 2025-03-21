import { Component, ElementRef,ViewChild, OnInit } from '@angular/core';
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

  @ViewChild('instancia_remesa') instancia_remesa!: ElementRef;

  anotaciones: string = "";
  estado: string = "Todos";

  enlaceFicha: string = URL.URL_FRONT_END + "/detalle_remesa/";
  nid_prueba: string = "27";

  lote: string = "";
  remesas: any;

  dtOpciones_remesas: any = {};

  bCargado_remesas: boolean = false;

  remesa_seleccionada: any;

  fecha_hasta: string = ""
  fecha_desde: string = ""

  bCargaRemesa: boolean = false;
  bCargaLote: boolean = false;

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
          }, 
          {
            title: 'Iban',
            data: 'iban'
          },
        {
          title: 'Estado',
          data: 'estado'
        },
      {
        title: 'Observaciones',
        data: 'anotaciones'
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
      this.bCargaRemesa = false;
      Swal.fire({
        icon: 'success',
        title: 'Remesa creada',
        text:  'Se ha registrado correctamente',
      }).then(()=> {location.reload()})
    },
    error: (respuesta: any) =>
    {
      this.bCargaRemesa = false;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text:  respuesta.error.info,
      })
    }
  }

  crear_remesa()
  {
    if(this.fecha_desde.length > 0 && this.fecha_hasta.length > 0)
    {
      this.bCargaRemesa = true;
      this.remesaService.registrar_remesa_matriculas_fecha(this.fecha_desde, this.fecha_hasta).subscribe(this.peticion_registrar_remesa);
    }
    else
    {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Es obligatorio indicar una fecha desde y fecha hasta',
      })
    }
  }

  buscar()
  {
    this.remesaService.obtener_remesas(this.lote).subscribe(this.obtener_remesas);
  }

  obtenerUrlFicha()
  {
    return this.enlaceFicha + this.remesa_seleccionada.nid_remesa;
  }

  peticion_aprobar =
  {
    next: (respuesta: any) =>
    {
      Swal.fire({
        icon: 'success',
        title: 'Recibo aprobado',
        text:  'Se ha registrado correctamente',
      }).then(()=> {this.cambia_seleccion_estado()})
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

  peticion_rechazar =
  {
    next: (respuesta: any) =>
    {
      Swal.fire({
        icon: 'success',
        title: 'Recibo rechazado',
        text:  'Se ha registrado correctamente',
      }).then(()=> {this.cambia_seleccion_estado()})
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

  peticion_aprobar_lote =
  {
    next: (respuesta: any) =>
    {
      Swal.fire({
        icon: 'success',
        title: 'Lote aceptado',
        text:  'Se ha registrado correctamente',
      }).then(()=> {this.cambia_seleccion_estado()})
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

  
  aceptar_recibo()
  {
    Swal.fire({
      title: 'Aprobar recibo',
      html: this.instancia_remesa.nativeElement,
      confirmButtonText: 'Aprobar',
      showCancelButton: true,
      preConfirm: () => {
        this.anotaciones = (<HTMLInputElement>document.getElementById("id_anotaciones")).value;
      }
    }).then(
      (results: any) =>
        {
        if(results.isConfirmed)
        {
          this.remesaService.aprobar_remesa(this.remesa_seleccionada.nid_remesa, this.anotaciones).subscribe(this.peticion_aprobar);
        }
      }
    )
  }

  rechazar_recibo()
  {
    Swal.fire({
      title: 'Aprobar recibo',
      html: this.instancia_remesa.nativeElement,
      confirmButtonText: 'Rechazar',
      showCancelButton: true,
      preConfirm: () => {
        this.anotaciones = (<HTMLInputElement>document.getElementById("id_anotaciones")).value;
      }
    }).then(
      (results: any) =>
        {
        if(results.isConfirmed)
        {
          this.remesaService.rechazar_remesa(this.remesa_seleccionada.nid_remesa, this.anotaciones).subscribe(this.peticion_rechazar);
        }
      }
    )
  
  }


  peticion_cobrar = 
  {
    next: (respuesta: any) =>
      {
        Swal.fire({
          icon: 'success',
          title: 'Cobro realizado',
          text:  'Se ha registrado el cobro correctamente',
        }).then(()=> {this.cambia_seleccion_estado()})
      },
      error: (respuesta: any) =>
      {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text:  'Se ha producido un error al realizar el cobro',
        })
      }
  }
  
  cobrar_remesa()
  {
    Swal.fire({
      title: 'Cobro de recibo',
      text: 'Se va a realizar el cobro de recibo',
      confirmButtonText: 'Confirmar',
      showCancelButton: true,
    }).then(
      (results: any) =>
        {
        if(results.isConfirmed)
        {
          this.remesaService.cobrar_remesa(this.remesa_seleccionada.nid_remesa).subscribe(this.peticion_cobrar);
        }
      }
    )
  }

  
  peticion_cobrar_lote = 
  {
    next: (respuesta: any) =>
      {
        this.bCargaLote = false;
        Swal.fire({
          icon: 'success',
          title: 'Cobro de lote realizado',
          text:  'Se ha registrado el cobro correctamente',
        }).then(()=> {this.cambia_seleccion_estado()})
      },
      error: (respuesta: any) =>
      {
        this.bCargaLote = false;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text:  'Se ha producido un error al realizar el cobro',
        })
      }
  }

  cobrar_lote()
  {
    Swal.fire({
      title: 'Cobro de lote',
      text: 'Se va a realizar el cobro de todo el lote, esto puede llevar unos minutos',
      confirmButtonText: 'Confirmar',
      showCancelButton: true,
    }).then(
      (results: any) =>
        {
        if(results.isConfirmed)
        {
          this.bCargaLote = true;
          this.remesaService.cobrar_lote(this.lote).subscribe(this.peticion_cobrar_lote);
        }
      }
    )
  }

  cambia_seleccion_estado()
  {
    if (this.estado == "Todos")
    {
      this.remesaService.obtener_remesas(this.lote).subscribe(this.obtener_remesas)
    }
    else{
      this.remesaService.obtener_remesas_estado(this.lote, this.estado).subscribe(this.obtener_remesas);
    }
  }

  aceptar_recibos()
  {
    Swal.fire({
      title: 'Aprobar recibo',
      html: this.instancia_remesa.nativeElement,
      confirmButtonText: 'Aprobar',
      showCancelButton: true,
      preConfirm: () => {
        this.anotaciones = (<HTMLInputElement>document.getElementById("id_anotaciones")).value;
      }
    }).then(
      (results: any) =>
        {
        if(results.isConfirmed)
        {
          this.remesaService.aprobar_remesas(this.lote, this.anotaciones).subscribe(this.peticion_aprobar_lote)
        }
      }
    )
  }
}
