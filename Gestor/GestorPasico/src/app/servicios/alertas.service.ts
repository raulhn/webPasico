import { Injectable } from '@angular/core';
import { URL } from '../logica/constantes';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AlertasService {
  constructor(private http: HttpClient) {}

  obtener_alumnos_sin_socios() {
    let API_URL = URL.URL_SERVICIO + '/obtener_alumnos_sin_socio';
    return this.http.get(API_URL, { withCredentials: true });
  }

  obtener_socios_sin_pago() {
    let API_URL = URL.URL_SERVICIO + '/obtener_socios_sin_pago';
    return this.http.get(API_URL, { withCredentials: true });
  }

  obtener_alumnos_sin_pago() {
    let API_URL = URL.URL_SERVICIO + '/obtener_alumnos_sin_pago';
    return this.http.get(API_URL, { withCredentials: true });
  }

  obtener_alumnos_sin_profesor() {
    let API_URL = URL.URL_SERVICIO + '/obtener_alumnos_sin_profesor';
    return this.http.get(API_URL, { withCredentials: true });
  }
}
