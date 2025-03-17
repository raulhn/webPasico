import { Injectable } from '@angular/core';
import { URL } from '../logica/constantes';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RemesaService {
  private url: string = URL.URL_SERVICIO;

  constructor(private http: HttpClient) { }

  registrar_remesa_persona(nid: string)
  {
    let API_URL = this.url + '/registrar_remesa_persona';
    return this.http.post(API_URL, {nid: nid} , {withCredentials:true})
  }

  registrar_remesa_matriculas()
  {
    let API_URL = this.url + '/registrar_remesa_matriculas';
    return this.http.post(API_URL, {},{withCredentials: true})
  }

  registrar_remesa_matriculas_fecha(fecha_desde: string, fecha_hasta: string)
  {
    let API_URL = this.url + '/registrar_remesa_matriculas_fecha';
    return this.http.post(API_URL, {fecha_desde: fecha_desde, fecha_hasta: fecha_hasta}, {withCredentials: true})
  }

  obtener_precio_mensualidad(nid_matricula: string)
  {
    let API_URL = this.url + '/obtener_mensualidad/' + nid_matricula;
    return this.http.get(API_URL, {withCredentials: true});
  }

  obtener_ultimo_lote()
  {
    let API_URL = this.url + '/obtener_ultimo_lote';
    return this.http.get(API_URL, {withCredentials: true})
  }

  obtener_remesas(lote: string)
  {
    let API_URL = this.url + '/obtener_remesa/' + lote;
    return this.http.get(API_URL, {withCredentials:true})
  }

  obtener_remesas_estado(lote: string, estado: string)
  {
    let API_URL = this.url + '/obtener_remesa_estado/' + lote + "/" + estado;
    return this.http.get(API_URL, {withCredentials:true})
  }
  obtener_remesa(nid_remesa: string)
  {
    let API_URL = this.url + '/obtener_remesa_nid/' + nid_remesa;
    return this.http.get(API_URL, {withCredentials: true})
  }

  obtener_lineas_remesa(nid_remesa: string)
  {
    let API_URL = this.url + '/obtener_lineas_remesa/' + nid_remesa;
    return this.http.get(API_URL, {withCredentials: true});
  }

  obtener_descuentos_remesa(nid_remesa: string)
  {
    let API_URL = this.url + '/obtener_descuentos_remesa/'+ nid_remesa;
    return this.http.get(API_URL, {withCredentials: true});
  }

  aprobar_remesa(nid_remesa: string, anotaciones: string)
  {
    let API_URL = this.url + '/aprobar_remesa';
    return this.http.post(API_URL, {nid_remesa: nid_remesa, anotaciones: anotaciones}, {withCredentials:true})
  }

  rechazar_remesa(nid_remesa: string, anotaciones: string)
  {
    let API_URL = this.url + '/rechazar_remesa';
    return this.http.post(API_URL, {nid_remesa: nid_remesa, anotaciones: anotaciones}, {withCredentials: true})
  }

  aprobar_remesas(lote: string, anotaciones: string)
  {
    let API_URL = this.url + '/aprobar_remesas';
    return this.http.post(API_URL, {lote: lote, anotaciones: anotaciones}, {withCredentials:true});
  }

  cobrar_remesa(nid_remesa: string)
  {
    let API_URL = this.url + '/cobrar_remesa';
    return this.http.post(API_URL, {nid_remesa: nid_remesa}, {withCredentials: true})
  }

  cobrar_lote(nid_lote: string)
  {
    let API_URL = this.url + '/cobrar_lote';
    return this.http.post(API_URL, {nid_lote: nid_lote}, {withCredentials: true})
  }

  actualizar_remesa(remesa: any, linea_remesa: any, descuento_remesa: any)
  {
    let API_URL = this.url + '/actualizar_remesa';
    return this.http.post(API_URL, {remesa: remesa, linea_remesa: linea_remesa, descuento_remesa: descuento_remesa}, {withCredentials: true})
  }

  nueva_linea_remesa(nid_remesa: string, concepto: string, precio: string)
  {
    let API_URL = this.url + '/nueva_linea_remesa';
    return this.http.post(API_URL, {nid_remesa: nid_remesa, concepto: concepto, precio: precio}, {withCredentials: true})
  }

  nuevo_descuento_remesa(nid_remesa: string, concepto: string)
  {
    let API_URL = this.url + '/nuevo_descuento_remesa';
    return this.http.post(API_URL, {nid_remesa: nid_remesa, concepto: concepto}, {withCredentials: true})
  }

  eliminar_linea_remesa(nid_linea_remesa: string)
  {
    let API_URL = this.url + '/eliminar_linea_remesa';
    return this.http.post(API_URL, {nid_linea_remesa: nid_linea_remesa}, {withCredentials: true})
  }

  eliminar_descuento_remesa(nid_descuento_remesa: string)
  {
    let API_URL = this.url + '/eliminar_descuento_remesa';
    return this.http.post(API_URL, {nid_descuento_remesa: nid_descuento_remesa}, {withCredentials: true})
  }
}
