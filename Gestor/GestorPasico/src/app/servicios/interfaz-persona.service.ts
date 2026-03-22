import { Injectable } from '@angular/core';
import { URL } from '../logica/constantes';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class InterfazPersonaService {
  constructor(private http: HttpClient) {}

  private url = URL.URL_SERVICIO;

  obtener_interfaz_personas(lote: string) {
    const API_URL = this.url + '/obtener_interfaz_personas/' + lote;
    return this.http.get(API_URL, { withCredentials: true });
  }
}
