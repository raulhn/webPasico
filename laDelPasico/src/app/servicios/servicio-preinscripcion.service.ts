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

}
