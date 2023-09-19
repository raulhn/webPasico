import { Injectable } from '@angular/core';
import { URL } from '../logica/constantes'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PreinscripcionesService {

  constructor(private http: HttpClient) { }

  private url: string = URL.URL_SERVICIO;


  obtener_preinscripciones()
  {
    let API_URL = this.url + '/obtener_preinscripciones';
    return this.http.get(API_URL, {withCredentials: true});
  }
}
