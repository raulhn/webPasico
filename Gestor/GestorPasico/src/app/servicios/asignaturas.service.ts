import { Injectable } from '@angular/core';
import { URL } from '../logica/constantes';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AsignaturasService {
  constructor(private http:HttpClient) { }
  private url: string = URL.URL_SERVICIO;

  registrar_asignatura(descripcion: string)
  {
    let API_URL = this.url + '/registrar_asignatura';
    return this.http.post(API_URL, {descripcion}, {withCredentials: true});
  }

  actualizar_asignatura(descripcion: string, nid_asignatura: string)
  {
    let API_URL = this.url + '/actualizar_asignatura';
    return this.http.post(API_URL, {descripcion: descripcion, nid_asignatura: nid_asignatura}, {withCredentials: true});
  }

  obtener_asignaturas()
  {
    let API_URL = this.url + '/obtener_asignaturas';
    return this.http.get(API_URL, {withCredentials: true});
  }
}