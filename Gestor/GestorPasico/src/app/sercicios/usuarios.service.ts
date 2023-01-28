import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  constructor(private http: HttpClient) { }

  private url: string = "https://localhost:8080";

  login(usuario: String, password: String) : Observable<any>
  {
    let API_URL = this.url + '/login';
 
    return this.http.post(API_URL, {usuario: usuario, password: password},  {  withCredentials:true }).pipe(catchError(err => {console.log('Error', err); return throwError(() => new Error(err.status))}));
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

  registrar(usuario: String, password: String) : Observable<any>
  {
    let API_URL = this.url + '/registrar';
 
    return this.http.post(API_URL, {usuario: usuario, password: password},  {  withCredentials:true }).pipe(catchError(err => {console.log('Error', err); return throwError(() => new Error(err.status))}));
  }

}
