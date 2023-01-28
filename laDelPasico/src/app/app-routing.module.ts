import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './src/home/home.component';
import { FormularioLoginComponent } from './src/login/formulario-login/formulario-login.component';
import { PaginaComponent } from './src/pagina/pagina.component';


const routes: Routes = [
  {
    path: 'login',
    component: FormularioLoginComponent
  },
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'general/:id',
    component: PaginaComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
