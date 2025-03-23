import { Component, Input, OnInit } from '@angular/core';
import { ComponenteService } from 'src/app/servicios/componente.service';
import { FicherosService } from 'src/app/servicios/ficheros.service';


@Component({
    selector: 'app-editar-componente-imagen',
    templateUrl: './editar-componente-imagen.component.html',
    styleUrls: ['./editar-componente-imagen.component.css'],
    standalone: false
})
export class EditarComponenteImagenComponent implements OnInit {
  @Input() nid: string="";

  formData = new FormData();
  imagen: any;
  constructor(private ficherosService: FicherosService, private componenteService: ComponenteService) { }

  ngOnInit(): void {

  }

  guardar()
  {
    this.componenteService.actualizar_imagen(this.formData).subscribe((res:any) => { window.location.reload();})
  }

  onChange(event:any)
  {
    const imagen:File =  event.target.files[0];
    if(imagen)
    {

      this.formData.append("imagen", imagen);
      this.formData.append("id_componente_imagen", this.nid);

    }
  }
}
