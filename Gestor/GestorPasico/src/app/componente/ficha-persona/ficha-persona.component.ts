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
import { ViewEncapsulation } from '@angular/compiler';
import { DireccionComponent } from '../direccion/direccion.component';
import { DireccionService } from 'src/app/servicios/direccion.service';

@Component({
  selector: 'app-ficha-persona',
  templateUrl: './ficha-persona.component.html',
  styleUrls: ['./ficha-persona.component.css']
})
export class FichaPersonaComponent implements OnInit{


  id_persona: string = "";

  bRegistrado: number = 0;
  bRegistrado_madre: number = 0;
  bRegistrado_padre: number = 0;
  bActualizado_socio: number = 0;
  bActualizado_pago: number = 0;
  bActualizada_direccion: number = 0;


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

  @ViewChild('instancia_direccion') instancia_direccion!: DireccionComponent;

  constructor(private rutaActiva: ActivatedRoute, private personasService: PersonasService, private socioService: SociosService,
              private direccionService: DireccionService)
  {
    this.id_persona = rutaActiva.snapshot.params['id'];
  }

  ngOnInit(): void {

  }


  limpia_variables()
  {
    this.bRegistrado = 0;
    this.bRegistrado_madre = 0;
    this.bRegistrado_padre = 0;
    this.bActualizado_socio = 0;
    this.bActualizado_pago = 0;

    this.mensaje_error_padre = '';
    this.mensaje_error_madre = '';
    this.mensaje_error = '';
    this.mensaje_error_socio = '';
  }

  actualizar =
  {
    next: async (respuesta: any) =>
    {
      this.bRegistrado = 1;
      this.mostrar_aviso();
    },
    error: (respuesta: any) =>
    {
      this.bRegistrado = 2;
      this.mostrar_aviso();
    }
  }

  registrar_padre = {
      next: (respuesta: any) =>
      {
          if(!respuesta.error)
          {
            this.bRegistrado_padre = 1;
            this.mostrar_aviso();
          }
      },
      error: (respuesta: any) =>
      {
        this.bRegistrado_padre = 2;
        this.mostrar_aviso();
      }
  }


registrar_madre = {
    next: (respuesta: any) =>
    {
        if(!respuesta.error)
        {
          this.bRegistrado_madre = 1;
          this.mostrar_aviso();
        }
    },
    error: (respuesta: any) =>
    {
      this.bRegistrado_madre = 2;
      this.mostrar_aviso();
    }
  }

  actualizar_socio = {
    next: (respuesta: any) =>
    {
      if(!respuesta.error)
      {
        this.bActualizado_socio = 1;
        this.mostrar_aviso();
      }
    },
    error: (respuesta: any) =>
    {
      this.bActualizado_socio = 2;
      this.mostrar_aviso();
    }
  }

  actualizar_pago =
  {
    next: (respuesta: any) =>
    {
      this.bActualizado_pago = 1;
      this.mostrar_aviso();
    },
    error: (respuesta: any) =>
    {
      this.bActualizado_pago = 2;
      this.mostrar_aviso();
    }
  }

  actualizar_direccion =
  {
    next: (respuesta: any) =>
    {
      this.bActualizada_direccion = 1;
      this.mostrar_aviso(); 
    },
    error: (respuesta: any) =>
    {
      this.bActualizada_direccion = 2;
      this.mostrar_aviso();
    }
  }

  mostrar_aviso()
  {

    if(this.bRegistrado == 1 && this.bRegistrado_madre == 1 && this.bRegistrado_padre  == 1 
        && this.bActualizado_pago  == 1 && this.bActualizado_socio == 1 && this.bActualizada_direccion == 1)
    {
        this.limpia_variables(); 
        Swal.fire({
          icon: 'success',
          title: 'Registro correcto',
          text: 'Se ha registrado correctamente'
        })
    }
    else if(this.bRegistrado != 0 && this.bRegistrado_madre != 0 && this.bRegistrado_padre  != 0 
      && this.bActualizado_pago  != 0 && this.bActualizado_socio != 0 && this.bActualizada_direccion != 0)
    {
      this.limpia_variables();
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Se ha producido un error',
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

    var peticion_forma_pago = this.instancia_forma_pago.construye_peticion();
    this.personasService.asociar_forma_pago(peticion_forma_pago).subscribe(this.actualizar_pago);

    var peticion_direccion = this.instancia_direccion.construye_direccion();
    this.direccionService.registrar_direccion(peticion_direccion).subscribe(this.actualizar_direccion);

    var peticion_socio = this.instancia_socio.construye_peticion();

    if(peticion_socio.num_socio != -1 )
    {
      this.socioService.actualizar_socio(peticion_socio).subscribe(this.actualizar_socio);
    }
    else{
      this.bActualizado_socio = 1;
    }
  }
}
