import { Injectable } from '@angular/core';
import { Constantes } from '../src/logica/constantes';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CancionesEuService {

  constructor(private http: HttpClient) { }
  private url: string =  Constantes.General.URL_BACKED;

  obtener_canciones() 
  {
    let API_URL = this.url + '/obtener_canciones';
    return this.http.get(API_URL);

  }

  obtener_votaciones()
  {
    let API_URL = this.url + '/obtener_votaciones';
    return this.http.get(API_URL);
  }
}
