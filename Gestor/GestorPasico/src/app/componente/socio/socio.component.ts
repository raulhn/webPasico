import { Component, OnInit, Input } from '@angular/core';
import { PersonasService } from 'src/app/servicios/personas.service';
import { SociosService } from 'src/app/servicios/socios.service';

@Component({
  selector: 'app-socio',
  templateUrl: './socio.component.html',
  styleUrls: ['./socio.component.css']
})
export class SocioComponent implements OnInit{
 
  @Input() nid_persona:string = "";

  socio_recuperado: any;

  bRecuperadoSocio: boolean = false;

  constructor(private socioService: SociosService, private personaService: PersonasService)
  {
    
  }

  recupera_socio = 
  {
    next: (respuesta: any) =>
    {
      
      if (respuesta.socio.length > 0)
      {
        this.socio_recuperado = respuesta['socio'][0];
        this.bRecuperadoSocio = true;
      }
    }
  }

  ngOnInit(): void {
    this.socioService.obtener_socio(this.nid_persona).subscribe(this.recupera_socio);

  }

  construye_peticion()
  {
    if (this.bRecuperadoSocio)
    {
      return {nid_persona: this.nid_persona, fecha_alta: this.socio_recuperado['fecha_alta'], fecha_baja: this.socio_recuperado['fecha_baja'], num_socio: this.socio_recuperado['num_socio']};
    }
    else{
      return {nid_persona: this.nid_persona, num_socio: -1}
    }
   }
}
