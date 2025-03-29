import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Usuario } from '../src/logica/usuario';

import { Constantes } from '../src/logica/constantes';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private http: HttpClient) { }
  private url: string =  Constantes.General.URL_BACKED;


  login(data: Usuario) : Observable<any>
  {
    let API_URL = this.url + '/login';
 
    return this.http.post(API_URL, data,  {  withCredentials:true }).pipe(catchError(err => {return throwError(() => new Error(err.status))}));
  }

  registrar(data: Usuario) : Observable<any>
  {
    let API_URL = this.url + '/registrar';
    return this.http.post(API_URL, data).pipe(catchError(err => {return throwError(() => new Error(err.status))}))
     ;
  }

  logueado() : Observable<any>
  {
    let  API_URL = this.url + '/logueado';
    return this.http.get(API_URL, { withCredentials:true }); //withCredentials:true Envía la cookie de sesión
  }

  logueado_administrador() : Observable<any>
  {
    let API_URL = this.url + '/logueado_administrador';
    return this.http.get(API_URL, { withCredentials:true });
  }

  logout() : Observable<any>
  {
    let API_URL = this.url + '/logout';
    return this.http.get(API_URL,{ withCredentials:true });
  }
}
