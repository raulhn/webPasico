import { NgModule } from '@angular/core';
import { LoginComponent } from './componente/login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UsuarioComponent } from './componente/usuario/usuario.component';
import { UsuariosComponent } from './componente/usuarios/usuarios.component';
import { ListaPersonasComponent } from './componente/lista-personas/lista-personas.component';
import { RegistroPersonaComponent } from './componente/registro-persona/registro-persona.component';
import { FichaPersonaComponent } from './componente/ficha-persona/ficha-persona.component';
import { ListaSociosComponent } from './componente/lista-socios/lista-socios.component';
import { RegistroSocioComponent } from './componente/registro-socio/registro-socio.component';
import { AsignaturasComponent } from './componente/asignaturas/asignaturas.component';
import { RegistroMatriculaComponent } from './componente/registro-matricula/registro-matricula.component';
import { RegistroCursoComponent } from './componente/registro-curso/registro-curso.component';
import { FichaMatriculaComponent } from './componente/ficha-matricula/ficha-matricula.component';
import { FichaProfesorComponent } from './componente/ficha-profesor/ficha-profesor.component';


const routes: Routes = [
  { 
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'registrar',
    component: UsuarioComponent
  },
  {
    path: 'usuarios',
    component: UsuariosComponent
  },
  {
    path: 'personas',
    component: ListaPersonasComponent
  },
  {
    path: 'registrar-persona',
    component: RegistroPersonaComponent
  },
  {
    path: 'ficha_persona/:id',
    component: FichaPersonaComponent 
  },
  {
    path: 'registrar-socio',
    component: RegistroSocioComponent
  },
  {
    path: 'asignaturas',
    component: AsignaturasComponent
  },
  {
    path: 'ficha_asignatura/:nid_asignatura',
    component: RegistroMatriculaComponent
  },
  {
    path: 'cursos',
    component: RegistroCursoComponent
  },
  {
    path: 'ficha_matricula/:nid_matricula',
    component: FichaMatriculaComponent
  },
  {
    path: 'ficha_profesor/:nid_profesor',
    component: FichaProfesorComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
