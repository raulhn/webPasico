import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { RemesaService } from 'src/app/servicios/remesa.service';
import { ActivatedRoute } from '@angular/router';
import Swal from 'sweetalert2';
import { error } from 'jquery';

@Component({
    selector: 'app-detalle-remesa',
    templateUrl: './detalle-remesa.component.html',
    styleUrls: ['./detalle-remesa.component.css'],
    standalone: false
})
export class DetalleRemesaComponent implements OnInit{

 nid_remesa: string = "";

  bCargado: boolean = false;
  bCargadas_lineas: boolean = false;
  bCargados_descuentos: boolean = false;

  remesa: any;
  lineas_remesa: any;
  descuentos_remesa: any;

  bEditable: boolean = false;

  nuevo_precio: string ="";
  nuevo_concepto_linea: string = "";

  nuevo_concepto_descuento: string = "";

  @ViewChild('modalNuevoDescuento') modalNuevoDescuento!: ElementRef;
  @ViewChild('modalNuevaLinea') modalNuevaLinea!: ElementRef;


  constructor(private rutaActiva: ActivatedRoute, private remesaService: RemesaService)
  {
    this.nid_remesa = rutaActiva.snapshot.params['nid_remesa'];
  }

  recupera_lineas =
  {
    next: (respuesta: any) =>
    {
      this.lineas_remesa = respuesta.lineas_remesa;
      this.bCargadas_lineas = true;
    }
  }

  recupera_descuentos = 
  {
    next: (respuesta: any) =>
    {
      this.descuentos_remesa = respuesta.descuentos_remesa;
      this.bCargados_descuentos = true;
    }

  }

  recupera_remesa =
  {
    next: (respuesta: any) =>
    {
      this.remesa = respuesta.remesa[0];
      this.bCargado = true;
    }
  }

  ngOnInit(): void {
    this.remesaService.obtener_lineas_remesa(this.nid_remesa).subscribe(this.recupera_lineas);
    this.remesaService.obtener_descuentos_remesa(this.nid_remesa).subscribe(this.recupera_descuentos);
    this.remesaService.obtener_remesa(this.nid_remesa).subscribe(this.recupera_remesa);
  }

  peticion_nueva_linea =
  {
    next: (respuesta: any) =>
    {
      Swal.fire({
        title: 'Línea añadida',
        text: 'Se ha añadido la línea a la remesa',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        this.bCargadas_lineas = false;
        this.remesaService.obtener_lineas_remesa(this.nid_remesa).subscribe(this.recupera_lineas);
      });
    },
    error: (error: any) =>
    {
      Swal.fire({
        title: 'Error',
        text: 'No se ha podido añadir la línea a la remesa',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  }

  nueva_linea()
  {
    Swal.fire({
      title: 'Nueva línea',
      html: this.modalNuevaLinea.nativeElement,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.remesaService.nueva_linea_remesa(this.nid_remesa, this.nuevo_concepto_linea, this.nuevo_precio).subscribe(this.peticion_nueva_linea);
      }
    });
  }
  

  peticion_nuevo_descuento =
  {
    next: (respuesta: any) =>
    {
      Swal.fire({
        title: 'Descuento añadido',
        text: 'Se ha añadido el descuento a la remesa',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        this.bCargados_descuentos = false;
        this.remesaService.obtener_descuentos_remesa(this.nid_remesa).subscribe(this.recupera_descuentos);
      });
    },
    error: (error: any) =>
    {
      Swal.fire({
        title: 'Error',
        text: 'No se ha podido añadir el descuento a la remesa',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  }

  peticion_eliminar_linea_remesa =
  {
    next: (respuesta: any) =>
    {
      Swal.fire({
        title: 'Línea eliminada',
        text: 'Se ha eliminado la línea de la remesa',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        this.bCargadas_lineas = false;
        this.remesaService.obtener_lineas_remesa(this.nid_remesa).subscribe(this.recupera_lineas);
      });
    }
  }

  eliminar_linea(nid_linea: string)
  {
    Swal.fire({
      title: 'Eliminar línea',
      text: '¿Está seguro de que desea eliminar la línea de la remesa?',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.remesaService.eliminar_linea_remesa(nid_linea).subscribe(this.peticion_eliminar_linea_remesa);
      }
    });
  }

  peticion_eliminar_descuento_remesa =
  {
    next: (respuesta: any) =>
    {
      Swal.fire({
        title: 'Descuento eliminado',
        text: 'Se ha eliminado el descuento de la remesa',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      }).then((result) => {
        this.bCargados_descuentos = false;
        this.remesaService.obtener_descuentos_remesa(this.nid_remesa).subscribe(this.recupera_descuentos);
      });
    }
  }


  eliminar_descuento(nid_descuento: string)
  {
    Swal.fire({
      title: 'Eliminar descuento',
      text: '¿Está seguro de que desea eliminar el descuento de la remesa?',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.remesaService.eliminar_descuento_remesa(nid_descuento).subscribe(this.peticion_eliminar_descuento_remesa);
      }
    });
  }

  nuevo_descuento()
  {
    Swal.fire({
      title: 'Nuevo descuento',
      html: this.modalNuevoDescuento.nativeElement,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.remesaService.nuevo_descuento_remesa(this.nid_remesa, this.nuevo_concepto_descuento).subscribe(this.peticion_nuevo_descuento);
      }
    });
  }

  editar()
  {
    this.bEditable = true;
  }


  peticion_guardar =
  {
    next: (respuesta: any) =>
    {
      Swal.fire({
          title: 'Registro Guardado',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        }
      ).then(
        () =>
        {
          this.bCargado = false;
          this.bCargadas_lineas = false;
          this.bCargados_descuentos = false;
          this.remesaService.obtener_lineas_remesa(this.nid_remesa).subscribe(this.recupera_lineas);
          this.remesaService.obtener_descuentos_remesa(this.nid_remesa).subscribe(this.recupera_descuentos);
          this.remesaService.obtener_remesa(this.nid_remesa).subscribe(this.recupera_remesa);
        }
      )
    }
  }

  guardar()
  {
    this.remesaService.actualizar_remesa(JSON.stringify(this.remesa), JSON.stringify(this.lineas_remesa), JSON.stringify(this.descuentos_remesa)).subscribe(this.peticion_guardar)
    this.bEditable = false;
  }
}
