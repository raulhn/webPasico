import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL } from '../logica/constantes';

@Injectable({
  providedIn: 'root'
})
export class MatriculasService {

  constructor(private http:HttpClient) { }
  private url: string = URL.URL_SERVICIO;

  registrar_matricula(nid_persona: string, nid_curso: string, nid_asignatura: string, nid_profesor: string)
  {
    let API_URL = this.url + '/registrar_matricula';
    return this.http.post(API_URL, {nid_persona: nid_persona, nid_curso: nid_curso, nid_asignatura: nid_asignatura, nid_profesor: nid_profesor}, { withCredentials:true});
  }

  obtener_alumnos_asignaturas(nid_curso: string, nid_asignatura: string, activo: string)
  {
    let API_URL = this.url + '/obtener_alumnos_asignaturas/' + nid_curso + '/' + nid_asignatura + '/' + activo;
    return this.http.get(API_URL, {withCredentials: true});
  }

  obtener_alumnos_cursos(nid_curso: string, activo: string)
  {
    let API_URL = this.url + '/obtener_alumnos_curso/' + nid_curso + '/' + activo;
    return this.http.get(API_URL, {withCredentials: true})
  }

  obtener_matriculas_alumno(nid_asignatura: string)
  {
    let API_URL = this.url + '/obtener_matriculas_alumno/' + nid_asignatura;
    return this.http.get(API_URL, {withCredentials: true});
  }

  obtener_asignaturas_matriculas(nid_matricula: string)
  {
    let API_URL = this.url + '/obtener_asignaturas_matriculas/' + nid_matricula;
    return this.http.get(API_URL, {withCredentials: true});
  }

  dar_baja_alumno(nid_matricula_asignatura: string,nid_matricula: string, nid_asignatura: string, fecha_baja: string)
  {
    let API_URL = this.url + '/dar_baja_asignatura';
    return this.http.post(API_URL, {nid: nid_matricula_asignatura, nid_matricula: nid_matricula, nid_asignatura: nid_asignatura, fecha_baja: fecha_baja}, {withCredentials: true})
  }

  obtener_alumnos_profesores(nid_profesor: string, nid_curso: string, nid_asignatura: string, activo: string)
  {
    let API_URL = this.url + '/obtener_alumnos_profesor/' + nid_profesor + '/' + nid_curso + '/' + nid_asignatura + '/' + activo;
    return this.http.get(API_URL, {withCredentials: true});
  }

  registrar_precio_manual(nid_matricula: string, precio: string, comentario_precio: string)
  {
    let API_URL = this.url + '/actualizar_precio_manual';
    return this.http.post(API_URL, {nid_matricula: nid_matricula, precio: precio, comentario_precio: comentario_precio}, {withCredentials: true});
  }

  obtener_matricula(nid_matricula: string)
  {
    let API_URL = this.url + '/obtener_matricula/' + nid_matricula;
    return this. http.get(API_URL, {withCredentials:true});
  }

  sustituir_profesor(nid_profesor: string, nid_profesor_sustituto: string, nid_asignatura: string)
  {
    let API_URL = this.url + '/sustituir_profesor';
    return this.http.post(API_URL, {nid_profesor: nid_profesor, nid_profesor_sustituto: nid_profesor_sustituto, nid_asignatura: nid_asignatura}, {withCredentials: true})
  }

  sustituir_profesor_alumno(nid_profesor: string, nid_matricula_asignatura: string, nid_asignatura: string)
  {
    let API_URL = this.url + '/sustituir_profesor_alumno';
    return this.http.post(API_URL, {nid_profesor: nid_profesor, nid_matricula_asignatura: nid_matricula_asignatura, nid_asignatura: nid_asignatura}, {withCredentials: true})
  }

  obtener_matriculas_profesor(nid_asignatura: string, nid_profesor: string)
  {
    let API_URL = this.url + '/obtener_matriculas_activas_profesor/' + nid_asignatura + '/' + nid_profesor;
    return this.http.get(API_URL, {withCredentials: true});
  }

  obtener_matriculas_activas_profesor(nid_asignatura: string)
  {
    let API_URL = this.url + '/obtener_matriculas_activas_rol_profesor/' + nid_asignatura;
    return this.http.get(API_URL, {withCredentials: true});

  }
  
  actualizar_fecha_alta(nid_matricula_asignatura: string, fecha_alta: string)
  {
    let API_URL = this.url + '/actualizar_fecha_alta_matricula_asignatura';
    return this.http.post(API_URL, {nid_matricula_asignatura: nid_matricula_asignatura, fecha_alta: fecha_alta}, {withCredentials: true});
  }

  actualizar_fecha_baja(nid_matricula_asignatura: string, fecha_baja: string)
  {
    let API_URL = this.url + '/actualizar_fecha_baja_matricula_asignatura';
    return this.http.post(API_URL, {nid_matricula_asignatura: nid_matricula_asignatura, fecha_baja: fecha_baja}, {withCredentials: true});
  }


}
