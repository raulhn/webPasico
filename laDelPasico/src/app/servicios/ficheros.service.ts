import { Injectable } from '@angular/core';
import { Constantes } from '../src/logica/constantes';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FicherosService {
  // https://blog.angular-university.io/angular-file-upload/
  constructor(private http: HttpClient) { }
  private url: string = Constantes.General.URL_BACKED;

  subir_fichero(data:any)
  {
    return this.http.post(this.url + '/subir_fichero', data);
  }
}
