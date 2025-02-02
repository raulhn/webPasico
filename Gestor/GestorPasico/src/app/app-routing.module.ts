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
import { ListadoPreinscripcionesComponent } from './componente/listado-preinscripciones/listado-preinscripciones.component';
import { RemesasComponent } from './componente/remesas/remesas.component';
import { ParametrosComponent } from './componente/parametros/parametros.component';
import { DetalleRemesaComponent } from './componente/detalle-remesa/detalle-remesa.component';
import { HorarioComponent } from './componente/horario/horario.component';
import { HorariosProfesorComponent } from './componente/horarios-profesor/horarios-profesor.component';
import { HorarioClaseComponent } from './componente/horario-clase/horario-clase.component';
import { RegistroMusicoComponent } from './componente/registro-musico/registro-musico.component';
import { EvaluacionComponent } from './componente/evaluacion/evaluacion.component';
import { CreaFichaAsistenciaComponent } from './componente/crea-ficha-asistencia/crea-ficha-asistencia.component';
import { ListaFichasAsistenciasComponent } from './componente/lista-fichas-asistencias/lista-fichas-asistencias.component';
import { FichaAsistenciaComponent } from './componente/ficha-asistencia/ficha-asistencia.component';
import { CrearFichaInventarioComponent } from './componente/crear-ficha-inventario/crear-ficha-inventario.component';
import { FichaInventarioComponent } from './componente/ficha-inventario/ficha-inventario.component';
import { ListaInventariosComponent } from './componente/lista-inventarios/lista-inventarios.component';


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
  },
  {
    path: 'listado_preinscripciones',
    component: ListadoPreinscripcionesComponent
  },
  {
    path: 'registrar_remesa',
    component: RemesasComponent
  },
  {
    path: 'detalle_remesa/:nid_remesa',
    component: DetalleRemesaComponent
  },
  {
    path: 'parametros',
    component: ParametrosComponent
  },
  {
    path: 'horario/:nid_horario',
    component: HorarioComponent
  },
  {
    path: 'horario_profesor/:nid_profesor',
    component: HorariosProfesorComponent
  },
  {
    path: 'horario_clase/:nid_horario_clase',
    component: HorarioClaseComponent
  },
  {
    path: 'musicos',
    component: RegistroMusicoComponent
  },
  {
    path: 'evaluacion',
    component: EvaluacionComponent
  },
  {
    path: 'crea_ficha_asistencia',
    component: CreaFichaAsistenciaComponent
  },
  {
    path: 'lista_ficha_asistencias',
    component: ListaFichasAsistenciasComponent
  },
  {
    path: 'ficha_asistencia/:nid_ficha_asistencia',
    component: FichaAsistenciaComponent
  },
  {
    path: 'registro_inventario',
    component: CrearFichaInventarioComponent
  },
  {
    path: 'ficha_inventario/:nid_inventario',
    component: FichaInventarioComponent
  },
  {
    path: 'lista_inventario',
    component: ListaInventariosComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
