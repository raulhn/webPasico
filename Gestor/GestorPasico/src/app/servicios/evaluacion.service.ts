import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL } from '../logica/constantes';


@Injectable({
  providedIn: 'root'
})
export class EvaluacionService {

  constructor(private http: HttpClient) { }

  private url: string = URL.URL_SERVICIO;

  registrar_evaluacion(nid_trimestre: string, nid_asignatura: string, nid_profesor: string, notas: string, progresos: string, matriculas: string, comentarios: string)
  {
    let API_URL = this.url + '/registrar_evaluacion';
    return this.http.post(API_URL, {nid_asignatura: nid_asignatura, nid_profesor: nid_profesor, notas: notas, progresos: progresos, matriculas: matriculas, nid_trimestre: nid_trimestre, comentarios: comentarios}, {withCredentials: true});
  }

  registrar_evaluacion_profesor(nid_trimestre: string, nid_asignatura: string, notas: string, progresos: string, matriculas: string, comentarios: string)
  {
    let API_URL = this.url + '/registrar_evaluacion_profesor';
    return this.http.post(API_URL, {nid_asignatura: nid_asignatura, notas: notas, progresos: progresos, matriculas: matriculas, nid_trimestre: nid_trimestre, comentarios: comentarios}, {withCredentials: true});
  }


  obtener_trimestres()
  {
    let API_URL = this.url + '/obtener_trimestres';
    return this.http.get(API_URL, {withCredentials: true});
  }

  obtener_evaluacion(nid_trimestre: string, nid_asignatura: string, nid_profesor: string)
  {
    let API_URL = this.url + '/obtener_evaluacion/' + nid_trimestre + '/' + nid_asignatura + '/' + nid_profesor;
    return this.http.get(API_URL, {withCredentials: true})
  }

  // Llamada obtener evaluación con el rol de profesor //
  obtener_evaluacion_profesor(nid_trimestre: string, nid_asignatura: string)
  {
    let API_URL = this.url + '/obtener_evaluacion_profesor/' + nid_trimestre + '/' + nid_asignatura;
    return this.http.get(API_URL, {withCredentials: true})
  }

  obtener_evaluacion_matricula_asignatura(nid_matricula: string)
  {
    let API_URL = this.url + '/obtener_evaluacion_matricula_asignatura/' + nid_matricula;
    return this.http.get(API_URL, {withCredentials: true})
  }

  generar_boletin(nid_matricula: string, nid_trimestre: string)
  {
    let API_URL = this.url + '/generar_boletin/' + nid_matricula + '/' + nid_trimestre;
    return this.http.get(API_URL, {withCredentials: true})
  }

  

}
