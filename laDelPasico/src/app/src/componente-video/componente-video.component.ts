import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ComponenteService } from 'src/app/servicios/componente.service';

@Component({
    selector: 'app-componente-video',
    templateUrl: './componente-video.component.html',
    styleUrls: ['./componente-video.component.css'],
    standalone: false
})
export class ComponenteVideoComponent implements OnInit {
  @Input() id_componente: string = "";

  url_video: string ="";

  bYoutube: boolean = false;
  bCargado: Promise<boolean>|null = null;

  constructor(private componenteService: ComponenteService, private sanitizer: DomSanitizer) { }

  ngOnInit(): void {
      this.componenteService.obtiene_url_video(this.id_componente).subscribe(
        (res:any) =>
        {
          if(!res.error)
          {
  
            this.url_video = res.url_video;
            var youtube_url = "youtube.com";
         
            if(this.url_video.indexOf(youtube_url) > 0)
            {
              this.bYoutube = true;
            }
 
            this.bCargado = Promise.resolve(true);
          }
        }
      )
  }

  obtiene_url_video() {
    if (!this.bYoutube)
    {
      return this.sanitizer.bypassSecurityTrustResourceUrl(this.url_video + "?autoplay=0");
    }
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.url_video);
  }

}
