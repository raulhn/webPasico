import { Injectable } from '@angular/core';
import { URL } from '../logica/constantes';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CursosService {
  constructor(private http:HttpClient) { }
  private url: string = URL.URL_SERVICIO;

  registrar_curso(descripcion: string)
  {
    let API_URL = this.url + '/registrar_curso';
    return this.http.post(API_URL, {descripcion: descripcion}, {withCredentials:true});
  }

  eliminar_curso(nid_curso: string)
  {
    let API_URL  = this.url + '/eliminar_curso';
    return this.http.post(API_URL, {nid_curso: nid_curso}, {withCredentials: true});
  }

  obtener_cursos()
  {
    let API_URL = this.url + '/obtener_cursos';
    return this.http.get(API_URL, {withCredentials: true});
  }

  obtener_cursos_profesor(nid_profesor: string)
  {
    let API_URL = this.url + '/obtener_cursos_profesor/' + nid_profesor;
    return this.http.get(API_URL, {withCredentials: true})
  }

}
