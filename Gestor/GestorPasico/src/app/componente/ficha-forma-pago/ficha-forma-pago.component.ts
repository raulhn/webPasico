import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PersonasService } from 'src/app/servicios/personas.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-ficha-forma-pago',
    templateUrl: './ficha-forma-pago.component.html',
    styleUrls: ['./ficha-forma-pago.component.css'],
    standalone: false
})
export class FichaFormaPagoComponent implements OnInit{

  nid_forma_pago: string ="";
  forma_pago: any;
  bCargada_forma_pago: boolean = false;

  activo: boolean = false;

  constructor(private personaService: PersonasService, private rutaActiva: ActivatedRoute)
  {
    this.nid_forma_pago = rutaActiva.snapshot.params['nid_forma_pago'];
  }

  peticion_forma_pago =
  {
    next: (respuesta: any) =>
    {
      this.forma_pago = respuesta.forma_pago;
      if(this.forma_pago['activo'] == 'S')
      {
        this.activo = true;
      }
      else
      {
        this.activo = false;
      }
      this.bCargada_forma_pago = true;
    }
  }

  peticion_registro_pasarela_pago =
  {
      next: (respuesta: any) =>
      {
          Swal.fire({
            icon: 'success',
            title: 'Registro correcto',
            text: 'Se ha registrado correctamente'
          }).then( () => {window.location.reload()} )
        },
      error: (respuesta: any) =>
      {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Se ha producido un error',
        })
      }

  }

  peticion_actualizar_forma_pago =
  {

    next: (respuesta: any) =>
    {
        Swal.fire({
          icon: 'success',
          title: 'Registro actualizado',
          text: 'Se ha actualizado correctamente'
        })
      },
    error: (respuesta: any) =>
    {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Se ha producido un error',
      })
    }
    
  }
  
  ngOnInit(): void {
    this.personaService.obtener_forma_pago_nid(this.nid_forma_pago).subscribe(this.peticion_forma_pago);
  }

  existe_metodo_pago_pasarela()
  {
    return this.forma_pago['nid_metodo_pasarela_pago'] < 1;
  }

  registrar_metodo_pasarela_pago()
  {
    this.personaService.registrar_forma_pago_pasarela(this.nid_forma_pago).subscribe(this.peticion_registro_pasarela_pago)
  }


  actualizar_forma_pago()
  {
    let esActivo = 'N';

    if(this.activo)
    {
      esActivo = 'S';
    }
    this.personaService.actualizar_forma_pago(this.nid_forma_pago, esActivo).subscribe(this.peticion_actualizar_forma_pago);
  }
}
