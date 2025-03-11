import { Injectable } from '@angular/core';
import { URL } from '../logica/constantes'
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PrestamosService {

  constructor(private http: HttpClient) { }

  private url: string = URL.URL_SERVICIO;

  registrar_prestamo(nid_persona: string, nid_inventario: string, fecha_inicio: string)
  {
    let API_URL = this.url + '/registrar_prestamo';
    return this.http.post(API_URL, {nid_persona: nid_persona, nid_inventario: nid_inventario, fecha_inicio: fecha_inicio}, {withCredentials: true});
  }

}
