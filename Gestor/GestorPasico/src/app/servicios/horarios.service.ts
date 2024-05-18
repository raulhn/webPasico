import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL } from '../logica/constantes';

@Injectable({
  providedIn: 'root'
})
export class HorariosService {

  constructor(private http: HttpClient) { }

  private url: string = URL.URL_SERVICIO;

  registrar_horario(data: any)
  {
    let API_URL = this.url + '/registrar_horario';
    return this.http.post(API_URL, data, {withCredentials: true});
  }

}
