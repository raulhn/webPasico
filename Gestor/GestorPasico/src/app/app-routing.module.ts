import { NgModule } from '@angular/core';
import { LoginComponent } from './componente/login/login.component';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UsuarioComponent } from './componente/usuario/usuario.component';
import { UsuariosComponent } from './componente/usuarios/usuarios.component';

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
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
