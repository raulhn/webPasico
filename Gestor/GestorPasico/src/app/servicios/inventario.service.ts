import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL } from '../logica/constantes';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  constructor(private http: HttpClient) { }


  private url: string = URL.URL_SERVICIO;

  registrar_inventario(data: any)
  {
    let API_URL = this.url + '/registrar_inventario';
    return this.http.post(API_URL, data, {withCredentials: true})
  }

  obtener_inventarios()
  {
    let API_URL = this.url + '/obtener_inventarios';
    return this.http.get(API_URL, {withCredentials: true});
  }

  obtener_inventario(nid_inventario: string)
  {
    let API_URL = this.url + '/obtener_inventario/' + nid_inventario;
    return this.http.get(API_URL, {withCredentials: true})
  }

  eliminar_inventario(nid_inventario: string)
  {
    let API_URL = this.url + '/eliminar_inventario';
    return this.http.post(API_URL, {nid_inventario: nid_inventario}, {withCredentials: true})
  }

  actualizar_imagen(data: any)
  { 
    let API_URL = this.url + '/actualizar_imagen_inventario';
    return this.http.post(API_URL, data, {withCredentials: true})
  }


}
