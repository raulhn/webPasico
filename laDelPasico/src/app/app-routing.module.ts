import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { HomeComponent } from './src/home/home.component';
import { FormularioLoginComponent } from './src/login/formulario-login/formulario-login.component';
import { PaginaComponent } from './src/pagina/pagina.component';
import { FormularioPreinscripcionComponent } from './src/formulario-preinscripcion/formulario-preinscripcion.component';
import { ListadoPreinscripcionesComponent } from './src/listado-preinscripciones/listado-preinscripciones.component';
import { ListadoPreinscripcionesCompletoComponent } from './src/listado-preinscripciones-completo/listado-preinscripciones-completo.component';
import { ListaOrdenadaComponent } from './src/lista-ordenada/lista-ordenada.component';


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
  },
  {
    path: 'preinscripcion',
    component: FormularioPreinscripcionComponent
  },
  {
    path: 'info_preinscripcion',
    component: ListadoPreinscripcionesComponent
  },
  {
    path: 'info_preinscripcion_completa',
    component: ListadoPreinscripcionesCompletoComponent
  },
  {
    path: 'lista_ordenada',
    component: ListaOrdenadaComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
