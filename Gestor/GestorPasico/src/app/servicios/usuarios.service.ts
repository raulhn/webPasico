import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { URL } from '../logica/constantes'

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private http: HttpClient) { }

  private url: string = URL.URL_SERVICIO;
  private url_web: string = URL.URL_WEB;

  login(usuario: String, password: String) : Observable<any>
  {
    let API_URL = this.url + '/login';
 
    return this.http.post(API_URL, {usuario: usuario, password: password},  {  withCredentials:true }).pipe(catchError(err => {console.log('Error', err); return throwError(() => new Error(err.status))}));
  }

  login_web(usuario: String, password: String) 
  {
    let API_URL = this.url_web + '/login';
    return this.http.post(API_URL, {usuario: usuario, pass: password}, {withCredentials: true});
  }

  logueado() : Observable<any>
  {
    let API_URL = this.url + '/logueado';
 
    return this.http.get(API_URL,  {withCredentials:true });
  }

  logout() : Observable<any>
  {
    let API_URL = this.url + '/logout';
    return this.http.get(API_URL,  {withCredentials:true } );
  }

  logout_web()
  {
    let API_URL = this.url_web + '/logout';
    return this.http.get(API_URL, {withCredentials:true})
  }

  registrar(usuario: String, password: String) : Observable<any>
  {
    let API_URL = this.url + '/registrar';
 
    return this.http.post(API_URL, {usuario: usuario, password: password},  {  withCredentials:true })
      .pipe(catchError(err => {console.log(''); return throwError(() => new Error(err.status))}));
  }

  obtener_usuarios() : Observable<any>
  {
    let API_URL = this.url + '/obtener_usuarios';
    return this.http.get(API_URL,  {  withCredentials:true })
  }

  actualizar_password(password: String) :Observable<any>
  {
    let API_URL = this.url + '/actualiza_password';
    return this.http.post(API_URL, {password: password}, {withCredentials: true})
      .pipe(catchError(err => {console.log(''); return throwError(() => new Error(err.status))}));
  }

  actualizar_password_web(password: String) : Observable<any>
  {
    let API_URL = this.url_web + '/actualizar_password';
    return this.http.post(API_URL, {password: password}, {withCredentials: true})
  }


}
