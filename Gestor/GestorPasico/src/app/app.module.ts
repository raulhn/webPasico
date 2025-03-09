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
import { RegistroMatriculaComponent } from './componente/registro-matricula/registro-matricula.component';
import { RegistroCursoComponent } from './componente/registro-curso/registro-curso.component';
import { MatriculasAlumnoComponent } from './componente/matriculas-alumno/matriculas-alumno.component';
import { FichaMatriculaComponent } from './componente/ficha-matricula/ficha-matricula.component';
import { FichaProfesorComponent } from './componente/ficha-profesor/ficha-profesor.component';
import { CursosProfesorComponent } from './componente/cursos-profesor/cursos-profesor.component';
import { ListadoPreinscripcionesComponent } from './componente/listado-preinscripciones/listado-preinscripciones.component';
import { FormaPagoComponent } from './componente/forma-pago/forma-pago.component';
import { FichaAsignaturaComponent } from './componente/ficha-asignatura/ficha-asignatura.component';
import { DireccionComponent } from './componente/direccion/direccion.component';
import { RemesasComponent } from './componente/remesas/remesas.component';
import { DetalleRemesaComponent } from './componente/detalle-remesa/detalle-remesa.component';
import { ParametrosComponent } from './componente/parametros/parametros.component';
import { HijosPersonaComponent } from './componente/hijos-persona/hijos-persona.component';
import { HorarioComponent } from './componente/horario/horario.component';
import { HorariosProfesorComponent } from './componente/horarios-profesor/horarios-profesor.component';
import { HorarioClaseComponent } from './componente/horario-clase/horario-clase.component';
import { HorarioMatriculaComponent } from './componente/horario-matricula/horario-matricula.component';
import { RegistroMusicoComponent } from './componente/registro-musico/registro-musico.component';
import { BandaTitularComponent } from './componente/banda-titular/banda-titular.component';
import { RegistrarAsistenciaComponent } from './componente/registrar-asistencia/registrar-asistencia.component';
import { EvaluacionComponent } from './componente/evaluacion/evaluacion.component';
import { CreaFichaAsistenciaComponent } from './componente/crea-ficha-asistencia/crea-ficha-asistencia.component';
import { ListaFichasAsistenciasComponent } from './componente/lista-fichas-asistencias/lista-fichas-asistencias.component';
import { FichaAsistenciaComponent } from './componente/ficha-asistencia/ficha-asistencia.component';
import { FichaInventarioComponent } from './componente/ficha-inventario/ficha-inventario.component';
import { CrearFichaInventarioComponent } from './componente/crear-ficha-inventario/crear-ficha-inventario.component';
import { ListaInventariosComponent } from './componente/lista-inventarios/lista-inventarios.component';
import { ListaFormaPagosComponent } from './componente/lista-forma-pagos/lista-forma-pagos.component';
import { FichaFormaPagoComponent } from './componente/ficha-forma-pago/ficha-forma-pago.component';
import { EvaluacionProfesorComponent } from './componente/evaluacion-profesor/evaluacion-profesor.component';



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
    AsignaturasComponent,
    RegistroMatriculaComponent,
    RegistroCursoComponent,
    MatriculasAlumnoComponent,
    FichaMatriculaComponent,
    FichaProfesorComponent,
    CursosProfesorComponent,
    ListadoPreinscripcionesComponent,
    FormaPagoComponent,
    FichaAsignaturaComponent,
    DireccionComponent,
    RemesasComponent,
    DetalleRemesaComponent,
    ParametrosComponent,
    HijosPersonaComponent,
    HorarioComponent,
    HorariosProfesorComponent,
    HorarioClaseComponent,
    HorarioMatriculaComponent,
    RegistroMusicoComponent,
    BandaTitularComponent,
    RegistrarAsistenciaComponent,
    EvaluacionComponent,
    CreaFichaAsistenciaComponent,
    ListaFichasAsistenciasComponent,
    FichaAsistenciaComponent,
    FichaInventarioComponent,
    CrearFichaInventarioComponent,
    ListaInventariosComponent,
    ListaFormaPagosComponent,
    FichaFormaPagoComponent,
    EvaluacionProfesorComponent
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
    NgSelectModule,
    FontAwesomeModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 

}
