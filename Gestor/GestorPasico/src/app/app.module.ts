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
import { UsuariosComponent } from './componente/usuarios/usuarios.component';
import { ListaPersonasComponent } from './componente/lista-personas/lista-personas.component';
import { RegistoMusicoComponent } from './componente/registo-musico/registo-musico.component';
import { FichaPersonaComponent } from './componente/ficha-persona/ficha-persona.component';
import { RegistroPersonaComponent } from './componente/registro-persona/registro-persona.component';
import { PersonaComponent } from './componente/persona/persona.component';
import { PadresPersonaComponent } from './componente/padres-persona/padres-persona.component';
import { NgSelectModule } from '@ng-select/ng-select';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    UsuarioComponent,
    MenuComponent,
    UsuariosComponent,
    ListaPersonasComponent,
    RegistoMusicoComponent,
    FichaPersonaComponent,
    RegistroPersonaComponent,
    PersonaComponent,
    PadresPersonaComponent
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
    NgbModule,
    NgSelectModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 

}
