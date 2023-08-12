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

  obtener_alumnos_asignaturas(nid_curso: string, nid_asignatura: string)
  {
    let API_URL = this.url + '/obtener_alumnos_asignaturas/' + nid_curso + '/' + nid_asignatura;
    return this.http.get(API_URL, {withCredentials: true});
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

  dar_baja_alumno(nid_matricula: string, nid_asignatura: string, fecha_baja: string)
  {
    let API_URL = this.url + '/dar_baja_asignatura';
    return this.http.post(API_URL, {nid_matricula: nid_matricula, nid_asignatura: nid_asignatura, fecha_baja: fecha_baja}, {withCredentials: true})
  }
}
