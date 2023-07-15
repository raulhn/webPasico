import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { URL } from '../logica/constantes';

@Injectable({
  providedIn: 'root'
})
export class SociosService {
  constructor(private http: HttpClient) { }

  private url: string = URL.URL_SERVICIO;

  registrar_socio(nid_persona: string, num_socio: string, fecha_alta:string)
  {
    let API_URL = this.url + '/registrar_socio';
    return this.http.post(API_URL, {nid_persona: nid_persona, num_socio: num_socio, fecha_alta: fecha_alta }, {withCredentials: true})
  }

  obtener_socio(nid_persona: string)
  {
    let API_URL = this.url + '/obtener_socio/' + nid_persona;
    return this.http.get(API_URL, {withCredentials: true});
  }

  actualizar_socio(peticion_socio: any)
  {
    let API_URL = this.url + '/actualizar_socio';
    return this.http.post(API_URL, peticion_socio, {withCredentials: true})
  }

  obtener_lista_socios()
  {
    let API_URL = this.url + '/obtener_socios'
    return this.http.get(API_URL, {withCredentials:true});
  }
}
