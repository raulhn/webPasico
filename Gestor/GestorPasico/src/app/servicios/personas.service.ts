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

  registrar_persona(nif: string, nombre: string, primer_apellido: string, segundo_apellido: string, telefono: string, fecha_nacimiento: string) : Observable<any>
  {
    let API_URL = this.url + '/registrar_persona';
    return this.http.post(API_URL, {nif: nif, nombre: nombre, primer_apellido: primer_apellido, segundo_apellido, telefono: telefono, fecha_nacimiento: fecha_nacimiento}, 
      {withCredentials: true});
  }

  actualizar_persona(nid: string, nif: string, nombre: string, primer_apellido: string, segundo_apellido: string, telefono:string, fecha_nacimiento: string)
  {
    let API_URL = this.url + '/actualizar_persona';
    return this.http.post(API_URL,{nid: nid, nif: nif, nombre: nombre, primer_apellido: primer_apellido, segundo_apellido, telefono: telefono, fecha_nacimiento: fecha_nacimiento},
      {withCredentials: true});
  }
}
