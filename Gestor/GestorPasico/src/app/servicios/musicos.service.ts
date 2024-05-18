import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL } from '../logica/constantes';

@Injectable({
  providedIn: 'root'
})
export class MusicosService {

  constructor(private http:HttpClient) { }
  private url: string = URL.URL_SERVICIO;

  obtener_personas_instrumento(nid_instrumento: string)
  {
    let API_URL = this.url + '/obtener_personas_instrumento/' + nid_instrumento;
    return this.http.get(API_URL, { withCredentials:true});
  }
}
