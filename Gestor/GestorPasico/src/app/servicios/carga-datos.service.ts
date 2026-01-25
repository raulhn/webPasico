import { Injectable } from '@angular/core';
import { URL } from '../logica/constantes';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class CargaDatosService {
  constructor(private http: HttpClient) {}
  private url: string = URL.URL_SERVICIO;

  cargarDatos(data: any) {
    let API_URL = this.url + '/cargar_datos';
    return this.http.post(API_URL, data, { withCredentials: true });
  }
}
