import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Constantes } from '../src/logica/constantes';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient) { }
  private url: string = Constantes.General.URL_BACKED;

  obtenerMenu(id_menu: number) 
  {
    let API_URL = this.url + '/menu/' +  id_menu;
    return this.http.get(API_URL);
  }

  registrarMenu(titulo: string, padre: number, tipo_pagina: number, enlace: string)
  {
    let API_URL = this.url + '/addMenu';
    return this.http.post(API_URL, {titulo: titulo, padre: padre, tipo_pagina: tipo_pagina, enlace: enlace}, {withCredentials:true});
  }

  obtiene_url(id_menu:number)
  {
    let API_URL = this.url + '/obtiene_url/' + id_menu;
    return this.http.get(API_URL);
  }

  eliminarMenu(id_menu:number)
  {
    let API_URL = this.url + '/eliminar_menu';
    return this.http.post(API_URL, {id_menu: id_menu}, {withCredentials:true});
  }

  actualizar_titulo_menu(id_menu:number, titulo: string)
  {
    let API_URL = this.url + '/actualizar_titulo_menu';
    return this.http.post(API_URL, {id_menu: id_menu, titulo: titulo}, {withCredentials:true});
  }

  obtener_titulo_menu(id_menu:number)
  {
    let API_URL = this.url + '/obtener_titulo_menu/' + id_menu;
    return this.http.get(API_URL);
  }
}

