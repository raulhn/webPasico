import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { UsuariosService } from './servicios/usuarios.service';
import { FormularioLoginComponent } from './src/login/formulario-login/formulario-login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Usuario } from './src/logica/usuario';
import { ComponenteMenuComponent } from './src/menu/componente-menu/componente-menu.component';
import { HomeComponent } from './src/home/home.component';
import { GaleriaComponent } from './src/galeria/galeria.component';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ComponenteComponent } from './src/componente/componente.component';
import { EditarComponenteTextoComponent } from './src/editar_componente/editar-componente-texto/editar-componente-texto.component';
import { QuillModule } from 'ngx-quill';
import { NuevoComponenteComponent } from './src/editar_componente/nuevo-componente/nuevo-componente.component';
import { PaginaComponent } from './src/pagina/pagina.component';
import { EditarComponenteImagenComponent } from './src/editar_componente/editar-componente-imagen/editar-componente-imagen.component';
import { ComponenteImagenComponent } from './src/componentes/componente-imagen/componente-imagen.component';
import { ComponenteComponentesComponent } from './src/componente-componentes/componente-componentes.component';
import { EditarCompomenteComponentesComponent } from './src/editar_componente/editar-compomente-componentes/editar-compomente-componentes.component';
import { NuevoComponenteComponentesComponent } from './src/editar_componente/nuevo-componente-componentes/nuevo-componente-componentes.component';
import { ComponenteComponenteComponent } from './src/componente-componente/componente-componente.component';

import { DataTablesModule } from 'angular-datatables';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ComponenteVideoComponent } from './src/componente-video/componente-video.component';
import { EditarComponenteVideoComponent } from './src/editar_componente/editar-componente-video/editar-componente-video.component';
import { PieComponent } from './src/pie/pie.component';
import { ComponenteGaleriaComponent } from './src/componente-galeria/componente-galeria.component';
import { EditarComponenteGaleriaComponent } from './src/editar_componente/editar-componente-galeria/editar-componente-galeria.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { EditarComponentePaginasComponent } from './src/editar_componente/editar-componente-paginas/editar-componente-paginas.component';
import { ComponentePaginasComponent } from './src/componente-paginas/componente-paginas.component';
import { ComponenteCaruselComponent } from './src/componente-carusel/componente-carusel.component';
import { EditarComponenteCaruselComponent } from './src/editar_componente/editar-componente-carusel/editar-componente-carusel.component';
import { ComponenteBlogComponent } from './src/componente-blog/componente-blog.component';
import { EditarComponenteBlogComponent } from './src/editar_componente/editar-componente-blog/editar-componente-blog.component';
import { ComponenteBlogReducidoComponent } from './src/componente-blog-reducido/componente-blog-reducido.component';
import { FormularioPreinscripcionComponent } from './src/formulario-preinscripcion/formulario-preinscripcion.component';

import { environment } from 'src/environments/environment';
import { FormularioPreinscripcionPedaniaComponent } from './src/formulario-preinscripcion-pedania/formulario-preinscripcion-pedania.component';
import { FormularioPreinscripcionTorrePachecoComponent } from './src/formulario-preinscripcion-torre-pacheco/formulario-preinscripcion-torre-pacheco.component';
import { ListadoPreinscripcionesComponent } from './src/listado-preinscripciones/listado-preinscripciones.component';
import { ListadoPreinscripcionesCompletoComponent } from './src/listado-preinscripciones-completo/listado-preinscripciones-completo.component';
import { ListaOrdenadaComponent } from './src/lista-ordenada/lista-ordenada.component';
import { RouterModule } from '@angular/router';
import { NgxCaptchaModule } from 'ngx-captcha';


@NgModule({ declarations: [
        AppComponent,
        FormularioLoginComponent,
        ComponenteMenuComponent,
        HomeComponent,
        GaleriaComponent,
        ComponenteComponent,
        EditarComponenteTextoComponent,
        NuevoComponenteComponent,
        PaginaComponent,
        EditarComponenteImagenComponent,
        ComponenteImagenComponent,
        ComponenteComponentesComponent,
        EditarCompomenteComponentesComponent,
        NuevoComponenteComponentesComponent,
        ComponenteComponenteComponent,
        ComponenteVideoComponent,
        EditarComponenteVideoComponent,
        PieComponent,
        ComponenteGaleriaComponent,
        EditarComponenteGaleriaComponent,
        EditarComponentePaginasComponent,
        ComponentePaginasComponent,
        ComponenteCaruselComponent,
        EditarComponenteCaruselComponent,
        ComponenteBlogComponent,
        EditarComponenteBlogComponent,
        ComponenteBlogReducidoComponent,
        FormularioPreinscripcionComponent,
        FormularioPreinscripcionPedaniaComponent,
        FormularioPreinscripcionTorrePachecoComponent,
        ListadoPreinscripcionesComponent,
        ListadoPreinscripcionesCompletoComponent,
        ListaOrdenadaComponent
    ],
    bootstrap: [AppComponent], 
    imports: [BrowserModule,
        AppRoutingModule,
        FormsModule,
        FontAwesomeModule,
        AngularEditorModule,
        CarouselModule,
        NgxCaptchaModule, ReactiveFormsModule,
        QuillModule.forRoot(),
        NgxCaptchaModule,
        ReactiveFormsModule,
        RouterModule,
       // RecaptchaV3Module,

        DataTablesModule], 
        providers: [Usuario, provideHttpClient(withInterceptorsFromDi())] 
        /*
        {
            provide: RECAPTCHA_V3_SITE_KEY,
            useValue: environment.recaptcha.siteKey
        },*/
        })
export class AppModule {


 }
