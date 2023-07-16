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
import { FichaPersonaComponent } from './componente/ficha-persona/ficha-persona.component';
import { RegistroPersonaComponent } from './componente/registro-persona/registro-persona.component';
import { PersonaComponent } from './componente/persona/persona.component';
import { PadresPersonaComponent } from './componente/padres-persona/padres-persona.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { MadresPersonaComponent } from './componente/madres-persona/madres-persona.component';
import { RegistroSocioComponent } from './componente/registro-socio/registro-socio.component';
import { SocioComponent } from './componente/socio/socio.component';
import { ListaSociosComponent } from './componente/lista-socios/lista-socios.component';
import { DataTablesModule } from 'angular-datatables';
import { AsignaturasComponent } from './componente/asignaturas/asignaturas.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    UsuarioComponent,
    MenuComponent,
    UsuariosComponent,
    ListaPersonasComponent,
    FichaPersonaComponent,
    RegistroPersonaComponent,
    PersonaComponent,
    PadresPersonaComponent,
    MadresPersonaComponent,
    RegistroSocioComponent,
    SocioComponent,
    ListaSociosComponent,
    AsignaturasComponent
  ],
  imports: [
    FormsModule,
    BrowserModule,
    DataTablesModule,
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
