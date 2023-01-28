import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Componente_texto } from '../src/logica/componentes/componente_texto';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { Constantes } from '../src/logica/constantes';

@Injectable({
  providedIn: 'root'
})
export class ComponenteComponentesService {

  constructor(private http: HttpClient) { 
 
  }
  private url: string = Constantes.General.URL_BACKED;

  obtiene_num_componente_componentes_definidos(id_componente:string)
  {
    let API_URL = this.url + '/numero_componente_componentes_definidos/' + id_componente;
    return this.http.get(API_URL);
  }

  obtiene_componente_componentes(id_componente: string, nOrden: string)
  {
    let API_URL = this.url + '/obtiene_componente_componentes/' + id_componente + '/' + nOrden;
    return this.http.get(API_URL);
  }


}
