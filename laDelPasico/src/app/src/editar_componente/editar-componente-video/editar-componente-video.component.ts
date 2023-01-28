import { Component, Input, OnInit } from '@angular/core';
import { ComponenteService } from 'src/app/servicios/componente.service';

@Component({
  selector: 'app-editar-componente-video',
  templateUrl: './editar-componente-video.component.html',
  styleUrls: ['./editar-componente-video.component.css']
})
export class EditarComponenteVideoComponent implements OnInit {

  @Input() id_componente: string="";
  constructor(private componenteService: ComponenteService) { }
  url: String = "";

  ngOnInit(): void {

    this.componenteService.obtiene_url_video(this.id_componente).subscribe(
      (res:any) =>
      {
        if(!res.error)
        {
         this.url = res.url;
        }
      }
    )
  }


}
