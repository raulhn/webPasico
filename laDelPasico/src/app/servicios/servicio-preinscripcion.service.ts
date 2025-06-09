import { Injectable } from '@angular/core';
import { Constantes } from '../src/logica/constantes';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ServicioPreinscripcionService {

  private url: string =  Constantes.General.URL_BACKED;
  constructor(private http: HttpClient) { }
  
  registrar_preinscripcion(data: any) 
  {
    let API_URL = this.url + '/registrar_preinscripcion';
    return this.http.post(API_URL, data);
  }

  obtener_preinscripciones()
  {
    let API_URL = this.url + '/obtener_preinscripciones_login';
    return this.http.get(API_URL, {withCredentials: true});
  }

  obtener_preinscripciones_detalle(nid_preinscripcion: string)
  {
    let API_URL = this.url + '/obtener_preinscripciones_detalle_login/' + nid_preinscripcion;
    return this.http.get(API_URL, {withCredentials: true})
  }

}
