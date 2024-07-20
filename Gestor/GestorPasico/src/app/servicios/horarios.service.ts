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

  obtener_horarios(nid_profesor: string, nid_asignatura:string)
  {
    let API_URL = this.url + '/obtener_horarios/' + nid_profesor + '/' + nid_asignatura;
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

}
