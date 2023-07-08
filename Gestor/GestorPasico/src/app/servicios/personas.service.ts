import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { URL } from '../logica/constantes'

@Injectable({
  providedIn: 'root'
})
export class PersonasService {
  constructor(private http: HttpClient) { }

  private url: string = URL.URL_SERVICIO;

  obtener_lista_personas() : Observable<any>
  {
    let API_URL = this.url + '/obtener_personas';
 
    return this.http.get(API_URL,  {  withCredentials:true });
  }

  obtener_persona(nid: string)
  {
    let API_URL = this.url + '/obtener_persona/' + nid;
    return this.http.get(API_URL, { withCredentials:true});
  }

  registrar_persona(nif: string, nombre: string, primer_apellido: string, segundo_apellido: string, telefono: string, fecha_nacimiento: string, correo_electronico: string) : Observable<any>
  {
    let API_URL = this.url + '/registrar_persona';
    return this.http.post(API_URL, {nif: nif, nombre: nombre, primer_apellido: primer_apellido, segundo_apellido, telefono: telefono, fecha_nacimiento: fecha_nacimiento, correo_electronico: correo_electronico}, 
      {withCredentials: true});
  }

  actualizar_persona(nid: string, nif: string, nombre: string, primer_apellido: string, segundo_apellido: string, telefono:string, fecha_nacimiento: string, correo_electronico: string)
  {
    let API_URL = this.url + '/actualizar_persona';
    return this.http.post(API_URL,{nid: nid, nif: nif, nombre: nombre, primer_apellido: primer_apellido, segundo_apellido, telefono: telefono, fecha_nacimiento: fecha_nacimiento, correo_electronico: correo_electronico},
      {withCredentials: true});
  }

  registrar_padre(nid_persona: string, nid_padre: string)
  {
    let API_URL = this.url + '/registrar_padre';
    return this.http.post(API_URL, {nid_persona: nid_persona, nid_padre: nid_padre}, {withCredentials: true});
  }

  registrar_madre(nid_persona: string, nid_madre: string)
  {
    let API_URL = this.url + '/registrar_madre';
    return this.http.post(API_URL, {nid_persona: nid_persona, nid_madre: nid_madre}, {withCredentials: true})
  }

  obtener_padre(nid_persona: string)
  {
    let API_URL = this.url + '/obtener_padre/' + nid_persona;
    return this.http.get(API_URL, {withCredentials: true})
  }

  obtener_madre(nid_persona: string)
  {
    let API_URL = this.url + '/obtener_madre/' + nid_persona;
    return this.http.get(API_URL, {withCredentials: true})
  }
}
