import { Input, Component, OnInit, ViewChild } from '@angular/core';
import { PersonasService } from 'src/app/servicios/personas.service';
import { ActivatedRoute } from '@angular/router';
import { PersonaComponent } from '../persona/persona.component';
import { PadresPersonaComponent } from '../padres-persona/padres-persona.component';
import { MadresPersonaComponent } from '../madres-persona/madres-persona.component';
import { SocioComponent } from '../socio/socio.component';
import { SociosService } from 'src/app/servicios/socios.service';
import Swal from 'sweetalert2';
import { FormaPagoComponent } from '../forma-pago/forma-pago.component';

@Component({
  selector: 'app-ficha-persona',
  templateUrl: './ficha-persona.component.html',
  styleUrls: ['./ficha-persona.component.css']
})
export class FichaPersonaComponent implements OnInit{


  id_persona: string = "";

  bRegistrado: boolean = false;
  bRegistrado_madre: boolean = false;
  bRegistrado_padre: boolean = false;
  bActualizado_socio: boolean = false;
  bActualizado_pago: boolean = false;

  bError:boolean = false;
  bError_padre: boolean = false;
  bError_madre: boolean = false;
  bError_socio: boolean = false;
  bError_pago: boolean = false;

  mensaje_registro: string = 'Se ha guardado correctamente';
  
  mensaje_error_padre: string = '';
  mensaje_error_madre: string = '';
  mensaje_error_socio: string = '';
  mensaje_error: string = '';

  
  @ViewChild('instancia_persona') instancia_persona!: PersonaComponent;

  @ViewChild('instancia_padre') instancia_padre!: PadresPersonaComponent;

  @ViewChild('instancia_madre') instancia_madre!: MadresPersonaComponent;

  @ViewChild('instancia_socio') instancia_socio!: SocioComponent;

  @ViewChild('instancia_forma_pago') instancia_forma_pago!: FormaPagoComponent;

  constructor(private rutaActiva: ActivatedRoute, private personasService: PersonasService, private socioService: SociosService)
  {
    this.id_persona = rutaActiva.snapshot.params['id'];
  }

  ngOnInit(): void {

  }

  actualizar =
  {
    next: async (respuesta: any) =>
    {
      console.log(respuesta);
      this.bRegistrado = true;
      this.mostrar_aviso();
    },
    error: (respuesta: any) =>
    {
      console.log(respuesta);
      this.bError = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Se ha producido un error',
      })
    }
  }

  registrar_padre = {
      next: (respuesta: any) =>
      {
          if(!respuesta.error)
          {
            this.bRegistrado_padre = true;
            this.mostrar_aviso();
          }
      },
      error: (respuesta: any) =>
      {
        this.bError_padre = true;
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Se ha producido un error',
        })
      }
  }


registrar_madre = {
    next: (respuesta: any) =>
    {
        if(!respuesta.error)
        {
          this.bRegistrado_madre = true;
          this.mostrar_aviso();
        }
    },
    error: (respuesta: any) =>
    {
      this.bError_madre = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Se ha producido un error',
      })
    }
  }

  actualizar_socio = {
    next: (respuesta: any) =>
    {
      if(!respuesta.error)
      {
        this.bActualizado_socio = true;
        this.mostrar_aviso();
      }
    },
    error: (respuesta: any) =>
    {
      this.bError = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Se ha producido un error',
      })
    }
  }

  actualizar_pago =
  {
    next: (respuesta: any) =>
    {
      this.bActualizado_pago = true;
    },
    error: (respuesta: any) =>
    {
      this.bError_pago = true;
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Se ha producido un error',
      })
    }
  }

  mostrar_aviso()
  {
    if(this.bRegistrado && this.bRegistrado_madre && this.bRegistrado_padre && !this.bError_socio)
    {
        Swal.fire({
          icon: 'success',
          title: 'Registro correcto',
          text: 'Se ha registrado correctamente'
        })
    }
  }

  async guardar()
  {
    var peticion_persona = this.instancia_persona.construye_peticion();
    if (peticion_persona !== null)
    {
      this.personasService.actualizar_persona_form(peticion_persona).subscribe(this.actualizar);
    }

    var peticion_padre = this.instancia_padre.construye_peticion()
    this.personasService.registrar_padre_peticion(peticion_padre).subscribe(this.registrar_padre);

    var peticion_madre = this.instancia_madre.construye_peticion()
    this.personasService.registrar_madre_peticion(peticion_madre).subscribe(this.registrar_madre);

    var peticion_socio = this.instancia_socio.construye_peticion();
    this.socioService.actualizar_socio(peticion_socio).subscribe(this.actualizar_socio);

    var peticion_forma_pago = this.instancia_forma_pago.construye_peticion();
    this.personasService.asociar_forma_pago(peticion_forma_pago).subscribe(this.actualizar_pago);

    setTimeout(()=>{                        
      this.bRegistrado = false;
      this.bRegistrado_madre = false;
      this.bRegistrado_padre = false;
      this.bActualizado_socio = false;
      this.bActualizado_pago = false;
    
      this.bError = false;
      this.bError_padre = false;
      this.bError_madre = false;
      this.bError_socio = false;
      this.bError_pago = false;

      this.mensaje_error_padre = '';
      this.mensaje_error_madre = '';
      this.mensaje_error = '';
      this.mensaje_error_socio = '';
  }, 2000);
  }
}
