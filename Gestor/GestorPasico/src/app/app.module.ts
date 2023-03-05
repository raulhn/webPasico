import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './componente/login/login.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { UsuarioComponent } from './componente/usuario/usuario.component';
import { MenuComponent } from './componente/menu/menu.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { UsuariosComponent } from './componente/usuarios/usuarios.component'


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    UsuarioComponent,
    MenuComponent,
    UsuariosComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    TooltipModule,
    FontAwesomeModule,
    RouterModule,
    NgbModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 

}
