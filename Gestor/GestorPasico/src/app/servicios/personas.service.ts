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

  obtener_personas(tipo: string)
  {
    let API_URL = this.url + '/obtener_personas/' + tipo
    return this.http.get(API_URL, {withCredentials: true});
  }

  obtener_persona(nid: string)
  {
    let API_URL = this.url + '/obtener_persona/' + nid;
    return this.http.get(API_URL, { withCredentials:true});
  }

  registrar_persona(nif: string, nombre: string, primer_apellido: string, segundo_apellido: string, telefono: string, fecha_nacimiento: string, correo_electronico: string, codigo: string) : Observable<any>
  {
    let API_URL = this.url + '/registrar_persona';
    return this.http.post(API_URL, {nif: nif, nombre: nombre, primer_apellido: primer_apellido, segundo_apellido, telefono: telefono, fecha_nacimiento: fecha_nacimiento, correo_electronico: correo_electronico, codigo: codigo}, 
      {withCredentials: true});
  }

  actualizar_persona(nid: string, nif: string, nombre: string, primer_apellido: string, 
                    segundo_apellido: string, telefono:string, fecha_nacimiento: string, 
                    correo_electronico: string, codigo: string, nid_socio: string)
  {
    let API_URL = this.url + '/actualizar_persona';
    return this.http.post(API_URL,{nid: nid, nif: nif, nombre: nombre, primer_apellido: primer_apellido, 
                                   segundo_apellido, telefono: telefono, fecha_nacimiento: fecha_nacimiento, 
                                   correo_electronico: correo_electronico, codigo:codigo, nid_socio: nid_socio},
      {withCredentials: true});
  }

  actualizar_persona_form(formData: any)
  {
    let API_URL = this.url + '/actualizar_persona';
    return this.http.post(API_URL, formData, {withCredentials:true})
  }

  obtener_personas_apellidos(primer_apellido: string, segundo_apellido: string)
  {
    let API_URL = this.url + '/obtener_personas_apellidos/' + primer_apellido + '/' + segundo_apellido;
    return this.http.get(API_URL, {withCredentials: true})
  }

  valida_nif(nif:string)
  {
    let API_URL = this.url + '/valida_nif/' + nif;
    return this.http.get(API_URL, {withCredentials: true})
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

  registrar_padre_peticion(peticion: any)
  {
    let API_URL = this.url + '/registrar_padre';
    return this.http.post(API_URL, peticion, {withCredentials: true});
  }

  registrar_madre_peticion(peticion: any)
  {
    let API_URL = this.url + '/registrar_madre';
    return this.http.post(API_URL, peticion, {withCredentials: true})
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

  obtener_hijos(nid_persona: string)
  {
    let API_URL = this.url + '/obtener_hijos/' + nid_persona;
    return this.http.get(API_URL, {withCredentials: true})
  }

  obtener_formas_pago()
  {
    let API_URL = this.url + '/obtener_formas_pago';
    return this.http.get(API_URL, {withCredentials: true});
  }

  
  obtener_forma_pago(nid_persona: string)
  {
    let API_URL = this.url + '/obtener_forma_pago/' + nid_persona;
    return this.http.get(API_URL, {withCredentials: true});
  }

  obtener_forma_pago_nid(nid_forma_pago: string)
  {
    let API_URL = this.url + '/obtener_forma_pago_nid/' + nid_forma_pago;
    return this.http.get(API_URL, {withCredentials: true})
  }

  obtener_pago_persona(nid_persona: string)
  {
    let API_URL = this.url + '/obtener_pago_persona/' + nid_persona;
    return this.http.get(API_URL, {withCredentials: true});
  }

  registrar_forma_pago(nid_titular: string, iban: string)
  {
    let API_URL = this.url + '/registrar_forma_pago';
    return this.http.post(API_URL, {nid_titular: nid_titular, iban: iban}, {withCredentials: true});
  }

  asociar_forma_pago(peticion: any)
  {
    let API_URL = this.url + '/asociar_forma_pago';
    return this.http.post(API_URL, peticion, {withCredentials: true})
  }

  obtener_forma_pagos_persona(nid_titular: string)
  {
    let API_URL = this.url + '/obtener_forma_pagos_persona/' + nid_titular;
    return this.http.get(API_URL, {withCredentials: true});
  }

  registrar_usuario_pago(nid_titular: string)
  {
    let API_URL = this.url + '/registrar_usuario_pago';
    return this.http.post(API_URL, {nid_persona: nid_titular}, {withCredentials: true})
  }
}
