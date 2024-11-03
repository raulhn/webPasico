import { Component, OnInit } from '@angular/core';
import { PersonasService } from 'src/app/servicios/personas.service';
import { SociosService } from 'src/app/servicios/socios.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-registro-socio',
  templateUrl: './registro-socio.component.html',
  styleUrls: ['./registro-socio.component.css']
})
export class RegistroSocioComponent implements OnInit{

  lista_personas: any[] = [];

  socio: any;
  num_socio: string = "";
  fecha_alta: string = "";

  bError: boolean = false;
  bRegistrado: boolean = false;

  mensaje_error: string = "";
  mensaje_registro: string = "";

  constructor(private personaService: PersonasService, private socioService: SociosService)
  {

  }

  obtener_personas =
  {
    next: (respuesta: any) =>
    {
     this.lista_personas = respuesta.personas;
    }
  }
  
  ngOnInit(): void {
    this.personaService.obtener_lista_personas().subscribe(this.obtener_personas);
  }


  comparePersona_socio(item: any, selected: any) {
    return item['nid'] == selected;
  }

  registrar_socio =
  {
    next: (respuesta: any) =>
    {
      Swal.fire({
        icon: 'success',
        title: 'Socio registrado',
        text: 'Se ha completado el registro correctamente'
      });
    },
    error: (respuesta: any) =>
    {
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Se ha producido un error'
      })
    }
  }

  guardar()
  {
    this.socioService.registrar_socio(this.socio, this.num_socio, this.fecha_alta).subscribe(
      this.registrar_socio
    )
  }
}
