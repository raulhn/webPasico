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

  registrar_instrumento(nombre: string)
  {
    let API_URL = this.url + '/registrar_instrumento';
    return this.http.post(API_URL, {descripcion: nombre}, {withCredentials: true})
  }

  actualizar_instrumento(nid_instrumento: string, descripcion: string)
  {
    let API_URL = this.url + '/actualizar_instrumento';
    return this.http.post(API_URL, {nid_instrumento: nid_instrumento, descripcion: descripcion}, {withCredentials: true})
  }

  registrar_musico(nid_instrumento: string, nid_persona: string, nid_tipo_musico: string)
  {
    let API_URL = this.url + '/registrar_musico';
    return this.http.post(API_URL, {nid_instrumento: nid_instrumento, nid_persona: nid_persona, nid_tipo_musico: nid_tipo_musico}, {withCredentials: true})
  }

  obtener_instrumentos()
  {
    let API_URL = this.url + '/obtener_instrumentos';
    return this.http.get(API_URL, {withCredentials:true});
  }

  obtener_instrumentos_filtro()
  {
    let API_URL = this.url + '/obtener_instrumentos_filtro';
    return this.http.get(API_URL, {withCredentials: true})
  }

  obtener_musicos()
  {
    let API_URL = this.url + '/obtener_musicos';
    return this.http.get(API_URL, {withCredentials: true})
  }

  obtener_tipo_musicos()
  {
    let API_URL = this.url + '/obtener_tipo_musico';
    return this.http.get(API_URL, {withCredentials: true})
  }

  registrar_tipo_musico(descripcion: string)
  {
    let API_URL = this.url + '/registrar_tipo_musico';
    return this.http.post(API_URL, {descripcion: descripcion}, {withCredentials: true})
  }

  actualizar_tipo_musico(nid_tipo_musico: string, descripcion: string)
  {
    let API_URL = this.url + '/actualizar_tipo_musico';
    return this.http.post(API_URL, {nid_tipo_musico: nid_tipo_musico, descripcion: descripcion}, {withCredentials: true})
  }

  baja_musico(nid_persona: string, nid_instrumento: string, nid_tipo_musico: string, fecha_baja: string)
  {
    let API_URL = this.url + '/baja_musico';
    return this.http.post(API_URL, {nid_persona: nid_persona, nid_instrumento: nid_instrumento, nid_tipo_musico: nid_tipo_musico, fecha_baja: fecha_baja}, 
      {withCredentials: true})
  }
}
