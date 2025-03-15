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

  obtener_prestamo(nid_prestamo:string)
  {
    let API_URL = this.url + '/obtener_prestamo/' + nid_prestamo;
    return this.http.get(API_URL, {withCredentials: true});
  }

  obtener_prestamos()
  {
    let API_URL = this.url + '/obtener_prestamos';
    return this.http.get(API_URL, {withCredentials: true});
  }

  actualizar_prestamo(nid_prestamo: string, nid_persona: string, nid_inventario: string, fecha_inicio: string, fecha_fin: string)
  {
    let API_URL = this.url + '/actualizar_prestamo';
    return this.http.post(API_URL, {nid_prestamo: nid_prestamo, nid_persona: nid_persona, nid_inventario: nid_inventario, fecha_inicio: fecha_inicio, fecha_fin: fecha_fin}, {withCredentials: true});
  }

  dar_baja_prestamo(nid_prestamo: string)
  {
    let API_URL = this.url + '/dar_baja_prestamo';
    return this.http.post(API_URL, {nid_prestamo: nid_prestamo}, {withCredentials: true});
  }
}
