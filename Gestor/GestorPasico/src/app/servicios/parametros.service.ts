import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL } from '../logica/constantes';

@Injectable({
  providedIn: 'root'
})
export class ParametrosService {

  constructor(private http:HttpClient) { }
  private url: string = URL.URL_SERVICIO;

  obtener_valor(nombre: string)
  {
    let URL_API = this.url +  '/obtener_valor/' + nombre;
    return this.http.get(URL_API, {withCredentials: true})
  }

  actualizar_valor(nombre: string, valor: string)
  {
    let URL_API = this.url + '/actualizar_valor';
    return this.http.post(URL_API, {nombre: nombre, valor: valor}, {withCredentials:true})
  }
}
