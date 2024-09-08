import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL } from '../logica/constantes';

@Injectable({
  providedIn: 'root'
})
export class HorariosService {

  constructor(private http: HttpClient) { }

  private url: string = URL.URL_SERVICIO;

  registrar_horario(data: any)
  {
    let API_URL = this.url + '/registrar_horario';
    return this.http.post(API_URL, data, {withCredentials: true});
  }

  obtener_horarios(nid_profesor: string, nid_asignatura:string, nid_curso: string)
  {
    let API_URL = this.url + '/obtener_horarios/' + nid_profesor + '/' + nid_asignatura + '/' + nid_curso;
    return this.http.get(API_URL, {withCredentials: true})
  }

  obtener_horario(nid_horario:string)
  {
    let API_URL = this.url + '/obtener_horario/' + nid_horario;
    return this.http.get(API_URL, {withCredentials: true})
  }

  eliminar_horario_clase( data:any)
  {
    let API_URL = this.url + '/eliminar_horario_clase';
    return this.http.post(API_URL, data, {withCredentials: true})
  }

  asignar_horario(data:any)
  {
    let API_URL = this.url + '/asignar_horario';
    return this.http.post(API_URL, data, {withCredentials: true})
  }

  liberar_horario(data: any)
  {
    let API_URL = this.url + '/liberar_horario';
    return this.http.post(API_URL, data, {withCredentials: true})
  }

  obtener_alumnos_horario_clase(nid_horario_clase: string)
  {
    let API_URL = this.url + '/obtener_alumnos_horario_clase/' + nid_horario_clase;
    return this.http.get(API_URL, {withCredentials: true})
  }

  obtener_alumnos_sin_asignar(nid_horario_clase: string)
  {
    let API_URL = this.url + '/obtener_alumnos_sin_asignar/' + nid_horario_clase;
    return this.http.get(API_URL, {withCredentials:true});
  }

  obtener_horario_matricula(nid_matricula: string)
  {
    let API_URL = this.url + '/obtener_horario_clase_alumno/' + nid_matricula;
    return this.http.get(API_URL, {withCredentials:true});
  }

}
