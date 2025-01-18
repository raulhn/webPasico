import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL } from '../logica/constantes';


@Injectable({
  providedIn: 'root'
})
export class FichaAsistenciaService {

  constructor(private http: HttpClient) { }

  private url: string = URL.URL_SERVICIO;

  crear_remesa(nombre: string, fecha: string, nid_asignatura: string)
  {
    let API_URL = this.url + '/crear_ficha_asistencia';
    return this.http.post(API_URL, {nombre: nombre, fecha: fecha, nid_asignatura: nid_asignatura}, {withCredentials: true})
  }

  obtener_fichas_asistencias()
  {
    let API_URL = this.url + '/obtener_fichas_asistencias';
    return this.http.get(API_URL, {withCredentials: true})
  }

  obtener_alumnos_ficha_seleccion(nid_ficha_asistencia: string)
  {
    let API_URL = this.url + '/obtener_alumnos_seleccion_asistencia/' + nid_ficha_asistencia;
    return this.http.get(API_URL, {withCredentials: true})
  }

}
