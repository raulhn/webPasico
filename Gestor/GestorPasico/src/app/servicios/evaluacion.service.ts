import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL } from '../logica/constantes';


@Injectable({
  providedIn: 'root'
})
export class EvaluacionService {

  constructor(private http: HttpClient) { }

  private url: string = URL.URL_SERVICIO;

  registrar_evaluacion(nid_trimestre: string, notas: string, progresos: string, matriculas: string, comentarios: string)
  {
    let API_URL = this.url + '/registrar_evaluacion';
    return this.http.post(API_URL, {notas: notas, progresos: progresos, matriculas: matriculas, nid_trimestre: nid_trimestre, comentarios: comentarios}, {withCredentials: true});
  }

  obtener_trimestres()
  {
    let API_URL = this.url + '/obtener_trimestres';
    return this.http.get(API_URL, {withCredentials: true});
  }
}
