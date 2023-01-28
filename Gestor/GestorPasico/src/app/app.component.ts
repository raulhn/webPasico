import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'GestorPasico';
  usuario ='';
  imprime()
  {
    console.log('imprime');
    console.log(this.usuario);
  }
}
