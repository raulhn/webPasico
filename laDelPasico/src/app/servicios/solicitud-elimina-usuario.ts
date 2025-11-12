import { Injectable } from '@angular/core';
import { Constantes } from '../src/logica/constantes';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class SolicitudEliminaUsuario {
  private url: string =  Constantes.General.URL_BACKED;
  constructor(private http: HttpClient) { }

  solicita_elimina_usuario(data: any)
  {
    let API_URL = this.url + '/solicita_elimina_usuario';
    return this.http.post(API_URL, data);
  }

}
