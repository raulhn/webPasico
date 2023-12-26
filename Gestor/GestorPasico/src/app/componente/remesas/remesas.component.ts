import { Component } from '@angular/core';
import { RemesaService } from 'src/app/servicios/remesa.service';

@Component({
  selector: 'app-remesas',
  templateUrl: './remesas.component.html',
  styleUrls: ['./remesas.component.css']
})
export class RemesasComponent {

  nid_prueba: string = "27";

  constructor(private remesaService: RemesaService)
  {}

  peticion_registrar_remesa =
  {
    next: (respuesta: any) =>
    {
      console.log(respuesta)
    },
    error: (respuesta: any) =>
    {

    }
  }

  crear_remesa()
  {
    console.log('Registrar remesa')
    this.remesaService.registrar_remesa_persona(this.nid_prueba).subscribe(this.peticion_registrar_remesa);
  }
}
