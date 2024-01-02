import { Injectable } from '@angular/core';
import { URL } from '../logica/constantes';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RemesaService {
  private url: string = URL.URL_SERVICIO;

  constructor(private http: HttpClient) { }

  registrar_remesa_persona(nid: string)
  {
    let API_URL = this.url + '/registrar_remesa_persona';
    return this.http.post(API_URL, {nid: nid} , {withCredentials:true})
  }

  obtener_precio_mensualidad(nid_matricula: string)
  {
    let API_URL = this.url + '/obtener_mensualidad/' + nid_matricula;
    return this.http.get(API_URL, {withCredentials: true});
  }
}
