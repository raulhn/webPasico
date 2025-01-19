import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL } from '../logica/constantes';


@Injectable({
  providedIn: 'root'
})
export class FichaAsistenciaService {

  constructor(private http: HttpClient) { }

  private url: string = URL.URL_SERVICIO;

  crear_ficha(nombre: string, fecha: string, nid_asignatura: string)
  {
    let API_URL = this.url + '/crear_ficha_asistencia';
    return this.http.post(API_URL, {nombre: nombre, fecha: fecha, nid_asignatura: nid_asignatura}, {withCredentials: true})
  }

  copiar_ficha(nombre: string, fecha: string, nid_ficha_asistencia: string)
  {
    let API_URL = this.url + '/copiar_ficha_asistencia';
    return this.http.post(API_URL, {nombre: nombre, fecha: fecha, nid_ficha_asistencia: nid_ficha_asistencia}, {withCredentials: true})
  }
  

  obtener_fichas_asistencias()
  {
    let API_URL = this.url + '/obtener_fichas_asistencias';
    return this.http.get(API_URL, {withCredentials: true})
  }

  obtener_ficha_asistencia(nid_ficha_asistencia: string)
  {
    let API_URL = this.url + '/obtener_ficha_asistencia/' + nid_ficha_asistencia;
    return this.http.get(API_URL, {withCredentials: true})
  }

  obtener_alumnos_ficha_seleccion(nid_ficha_asistencia: string)
  {
    let API_URL = this.url + '/obtener_alumnos_seleccion_asistencia/' + nid_ficha_asistencia;
    return this.http.get(API_URL, {withCredentials: true})
  }

  registrar_ficha_asistencia_alumno(nid_ficha_asistencia: string, nid_alumno: string)
  {
    let API_URL = this.url + '/registrar_ficha_asistencia_alumno';
    return this.http.post(API_URL, {nid_ficha_asistencia: nid_ficha_asistencia, nid_alumno: nid_alumno}, {withCredentials: true})
  }

  eliminar_ficha_asistencia_alumno(nid_ficha_asistencia_alumno: string)
  {
    let API_URL = this.url + '/eliminar_ficha_asistencia_alumno';
    return this.http.post(API_URL, {nid_ficha_asistencia_alumno: nid_ficha_asistencia_alumno}, {withCredentials: true})
  }

  obtener_fichas_asistencias_alumnos(nid_ficha_asistencia: string)
  {
    let API_URL = this.url + '/obtener_fichas_asistencia_alumnos/' + nid_ficha_asistencia;
    return this.http.get(API_URL, {withCredentials: true})
  }

  actualizar_ficha_asistencia_alumnos(lista_ficha_asistencia_alumno: string)
  {
    let API_URL = this.url + '/actualizar_ficha_asistencia_alumnos';
    return this.http.post(API_URL, {fichas_asistencias_alumno: lista_ficha_asistencia_alumno}, {withCredentials: true})
  }

  cancelar_ficha_asistencia(nid_ficha_asistencia: string)
  {
    let API_URL = this.url + '/cancelar_ficha_asistencia';
    return this.http.post(API_URL, {nid_ficha_asistencia: nid_ficha_asistencia}, {withCredentials: true})
  }
}
