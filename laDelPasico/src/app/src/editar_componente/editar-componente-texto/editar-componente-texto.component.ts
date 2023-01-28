import { Component, Input,Pipe, PipeTransform, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EditorChangeContent, EditorChangeSelection } from "ngx-quill";
import { ComponenteService } from 'src/app/servicios/componente.service';
import { Componente_texto } from '../../logica/componentes/componente_texto';

import { faFloppyDisk } from '@fortawesome/free-solid-svg-icons';
import { AngularEditorModule } from '@kolkov/angular-editor';

import {DomSanitizer} from '@angular/platform-browser';

import { AngularEditorConfig } from '@kolkov/angular-editor';

@Component({
  selector: 'app-editar-componente-texto',
  templateUrl: './editar-componente-texto.component.html',
  styleUrls: ['./editar-componente-texto.component.css']
}
)
export class EditarComponenteTextoComponent implements OnInit {
  @Input() nid: string="";
  @ViewChild("htmlContent", { static: false }) htmlContent:any;

  faSave = faFloppyDisk;

  placeholder: string = "";

 
  observer_texto = {
    next: (res:any) =>
    {
      if(!res.error)
      {
        this.htmlContent= res.componente.cTexto;  
        console.log(this.htmlContent);
      }
    }
  }

  editorConfig: AngularEditorConfig = {
    editable: true,
      spellcheck: true,
      height: 'auto',
      minHeight: '0',
      maxHeight: 'auto',
      width: 'auto',
      minWidth: '0',
      translate: 'yes',
      enableToolbar: true,
      showToolbar: true,
      placeholder: 'Enter text here...',
      defaultParagraphSeparator: '',
      defaultFontName: '',
      defaultFontSize: '',
      fonts: [
        {class: 'arial', name: 'Arial'},
        {class: 'times-new-roman', name: 'Times New Roman'},
        {class: 'calibri', name: 'Calibri'},
        {class: 'comic-sans-ms', name: 'Comic Sans MS'}
      ],
      customClasses: [
      {
        name: 'quote',
        class: 'quote',
      },
      {
        name: 'redText',
        class: 'redText'
      },
      {
        name: 'titleText',
        class: 'titleText',
        tag: 'h1',
      },
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: false,
    toolbarPosition: 'top'
};

  constructor(private componenteService: ComponenteService,  private sanitizer: DomSanitizer) { 
  }
  control: FormControl = new FormControl();
 
  ngOnInit(): void {

    this.componenteService.componente_texto(this.nid).subscribe(this.observer_texto);
  }


  observer_guardar = {
    next: (res:any) =>
    {
      if(!res.error)
      {
        console.log('Se ha registrado');
      }
      else{
        console.log('Error');
      }
    }
  }
  
  guardar()
  {
    console.log(this.htmlContent);
    console.log(this.sanitizer.bypassSecurityTrustHtml(this.htmlContent));
    var componente_texto: Componente_texto = new Componente_texto();
    componente_texto.nid = parseInt(this.nid);

    componente_texto.cTexto = this.htmlContent;

    this.componenteService.actualizar_texto(componente_texto).subscribe();
  }

}
