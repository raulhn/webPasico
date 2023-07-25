import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { URL } from '../logica/constantes';

@Injectable({
  providedIn: 'root'
})
export class MatriculasService {

  constructor(private http:HttpClient) { }
  private url: string = URL.URL_SERVICIO;

  registrar_matricula(nid_persona: string, nid_curso: string, nid_asignatura: string)
  {
    let API_URL = this.url + '/registrar_matricula';
    return this.http.post(API_URL, {nid_persona: nid_persona, nid_curso: nid_curso, nid_asignatura: nid_asignatura}, { withCredentials:true});
  }
}
