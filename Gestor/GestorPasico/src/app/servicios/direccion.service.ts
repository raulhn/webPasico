import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL } from '../logica/constantes';

@Injectable({
  providedIn: 'root'
})
export class DireccionService {

  constructor(private http:HttpClient) { }
  private url: string = URL.URL_SERVICIO;

  registrar_direccion(data: any)
  {
    let API_URL = this.url + '/registrar_direccion';
    return this.http.post(API_URL, data, {withCredentials: true});
  }

  obtener_direccion(nid_persona: string)
  {
    let API_URL = this.url + '/obtener_direccion/' + nid_persona;
    return this.http.get(API_URL, {withCredentials: true})
  }
}
