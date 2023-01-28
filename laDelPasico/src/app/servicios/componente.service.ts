import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Componente_texto } from '../src/logica/componentes/componente_texto';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

import { Constantes } from '../src/logica/constantes';
@Injectable({
  providedIn: 'root'
})
export class ComponenteService {

  constructor(private http: HttpClient) { 
 
  }
  private url: string = Constantes.General.URL_BACKED;

  tipo_componente(id: string)
  {
    return this.http.get(this.url + '/tipo_componente/' + id);
  }

  componente_texto(id: string)
  {
    return this.http.get(this.url + '/componente_texto/' + id);
  }

  actualizar_texto(data: Componente_texto)
  {
    let API_URL = this.url + '/guardar_texto';
    return this.http.post(API_URL, data,{ withCredentials:true }).pipe(catchError(err => {console.log('Error', err); 
        return throwError(() => new Error(err.status))}))
  }

  /** CREAR COMPONENTES **/

  crear_componente(id_pagina: string, tipo_componente: string)
  {
    let API_URL = this.url + '/registrar_componente';
    return this.http.post(API_URL, {id: id_pagina, tipo_componente: tipo_componente, tipo_asociacion: Constantes.TipoAsociacion.pagina}, { withCredentials:true });
  }

  crear_componente_imagen(id_pagina: string, tipo_componente: string, titulo: string)
  {
    let API_URL = this.url + '/registrar_componente';
    return this.http.post(API_URL, {id: id_pagina, tipo_componente: tipo_componente, titulo: titulo, tipo_asociacion: Constantes.TipoAsociacion.pagina}, { withCredentials:true });
  }
  
  crear_componente_video(id_pagina: string, tipo_componente: string, url:string)
  {
    let API_URL = this.url + '/registrar_componente';
    return this.http.post(API_URL, {id: id_pagina, tipo_componente: tipo_componente, url: url, tipo_asociacion: Constantes.TipoAsociacion.pagina}, { withCredentials:true })
  }

  crear_componente_galeria(id_pagina: string, tipo_componente: string, titulo: string, descripcion: string)
  {
    let API_URL = this.url + '/registrar_componente';
    return this.http.post(API_URL, {id: id_pagina, tipo_componente: tipo_componente, titulo: titulo, descripcion: descripcion, tipo_asociacion: Constantes.TipoAsociacion.pagina}, { withCredentials:true })
  }


  crear_componente_componentes(id_pagina: string, tipo_componente: string, nColumnas: string)
  {
    let API_URL = this.url + '/registrar_componente';
    return this.http.post(API_URL, {id: id_pagina, tipo_componente: tipo_componente, nColumnas: nColumnas, tipo_asociacion: Constantes.TipoAsociacion.pagina}, {withCredentials: true});
  }

  crear_componente_paginas(id_pagina: string, tipo_componente: string, titulo: string)
  {
    let API_URL = this.url + '/registrar_componente';
    return this.http.post(API_URL, {id: id_pagina, tipo_componente:tipo_componente, titulo: titulo, tipo_asociacion: Constantes.TipoAsociacion.pagina}, { withCredentials:true});
  }

  crear_componente_carusel(id_pagina: string, tipo_componente: string, elementos_simultaneos: string)
  {
    let API_URL = this.url + '/registrar_componente';
    return this.http.post(API_URL, {id: id_pagina, tipo_componente: tipo_componente, tipo_asociacion: Constantes.TipoAsociacion.pagina}, { withCredentials: true});
  }

  /** CREAR COMPONENTES DE COMPONENTE**/

  crear_componente_componentes_texto(id_componente: string, tipo_componente: string, nOrden: string)
  {
    let API_URL = this.url + '/registrar_componente';
    return this.http.post(API_URL, {id: id_componente, tipo_componente: tipo_componente, tipo_asociacion: Constantes.TipoAsociacion.componente, nOrden: nOrden}, { withCredentials:true });
  }

  crear_componente_componentes_imagen(id_componente: string, tipo_componente: string, titulo: string, nOrden: string)
  {
    let API_URL = this.url + '/registrar_componente';
    return this.http.post(API_URL, {id: id_componente, tipo_componente: tipo_componente, titulo: titulo, tipo_asociacion: Constantes.TipoAsociacion.componente, nOrden: nOrden}, { withCredentials:true });
  }
  
  crear_componente_componentes_video(id_componente: string, tipo_componente: string, url: string, nOrden: string)
  {
    let API_URL = this.url + '/registrar_componente';
    return this.http.post(API_URL, {id: id_componente, tipo_componente: tipo_componente, url: url, tipo_asociacion: Constantes.TipoAsociacion.componente, nOrden: nOrden}, { withCredentials:true });

  }

  crear_componente_componentes_galeria(id_componente: string, tipo_componente: string, titulo: string, descripcion: string, nOrden: string)
  {
    let API_URL = this.url + '/registrar_componente';
    return this.http.post(API_URL, {id: id_componente, tipo_componente: tipo_componente, titulo: titulo, descripcion: descripcion, tipo_asociacion: Constantes.TipoAsociacion.componente, nOrden: nOrden}, { withCredentials:true });
  }

  crear_componente_componentes_componentes(id_componente: string, tipo_componente: string, nColumnas: string, nOrden: string)
  {
    let API_URL = this.url + '/registrar_componente';
    return this.http.post(API_URL, {id: id_componente, tipo_componente: tipo_componente, nColumnas: nColumnas, tipo_asociacion: Constantes.TipoAsociacion.componente, nOrden: nOrden}, {withCredentials: true});
  }

  crear_componente_componentes_carusel(id_compoonente: string, tipo_componente: string, nColumnas: string, nOrden: string)
  {
    let API_URL = this.url + '/registrar_componente';
    return this.http.post(API_URL, {id: id_compoonente, tipo_componente: tipo_componente, tipo_asociacion: Constantes.TipoAsociacion.componente, nOrden: nOrden})
  }

  /** OPERACIONES SOBRE IMAGENES **/
  actualizar_imagen(fichero: any)
  {
    let API_URL = this.url + '/actualizar_imagen';
    return this.http.post(API_URL, fichero, { withCredentials:true, });
  }

  obtiene_ruta_imagen(id_componente_imagen: string)
  {
    let API_URL = this.url + '/ruta_imagen/' + id_componente_imagen;
    return this.http.get(API_URL);
  }

  obtener_componentes(id_pagina: string)
  {
    let API_URL = this.url + '/obtener_componentes/' + id_pagina;
    return this.http.get(API_URL);
  }

  eliminar_componente(id_pagina:string, id_componente_: string)
  {
    let API_URL = this.url + '/eliminar_componente';
    return this.http.post(API_URL, {id_pagina: id_pagina, id_componente: id_componente_, tipo_asociacion: Constantes.TipoAsociacion.pagina}, {withCredentials:true});
  }

  eliminar_componente_componentes(id_componente_: string)
  {
    let API_URL = this.url + '/eliminar_componente';
    return this.http.post(API_URL, {id_componente: id_componente_, tipo_asociacion: Constantes.TipoAsociacion.componente}, {withCredentials:true});
  }

  incrementa_orden(id_pagina: string, id_componente: string)
  {
    let API_URL = this.url + '/incrementa_orden';
    return this.http.post(API_URL, {id_pagina: id_pagina, id_componente: id_componente}, {withCredentials:true});
  }
  decrementa_orden(id_pagina: string, id_componente: string)
  {
    let API_URL = this.url + '/decrementa_orden';
    return this.http.post(API_URL, {id_pagina: id_pagina, id_componente: id_componente}, {withCredentials:true});
  }

  obtiene_numero_componentes(id_pagina: string)
  {
    let API_URL = this.url + '/numero_componentes/' + id_pagina;
    return this.http.get(API_URL);
  }

  obtiene_orden(id_pagina: string, id_componente: string)
  {
    let API_URL = this.url + '/obtiene_orden/' + id_pagina + "/" + id_componente;
    return this.http.get(API_URL);
  }

  obtiene_url_video(id_componente: string)
  {
    let API_URL = this.url + '/obtiene_url_video/' + id_componente;
    return this.http.get(API_URL);
  }

  /** Componente galeria **/
  add_imagen_galeria(fichero:any)
  {
    let API_URL = this.url + '/add_imagen_galeria';
    return this.http.post(API_URL, fichero, {withCredentials: true});

  }

  eliminar_imagen_galeria(id_componente: string, id_imagen: string)
  {
    let API_URL = this.url + '/eliminar_imagen_galeria';
    return this.http.post(API_URL, {id_componente: id_componente, id_imagen: id_imagen}, {withCredentials: true});
  }

  obtiene_imagenes_galeria(id_componente: string)
  {
    let API_URL = this.url + '/obtiene_imagenes_galeria/' + id_componente;
    return this.http.get(API_URL);
  }

  /** Componente páginas **/
  add_pagina_componente(id_componente: string, titulo: string, descripcion: string, padre: string)
  {
    let API_URL = this.url  + '/add_pagina_componente';
    return this.http.post(API_URL, {id_componente: id_componente, titulo: titulo, descripcion: descripcion, padre: padre}, {withCredentials: true});
  }

  remove_pagina_componente(id_componente: string, id_pagina: number)
  {
    let API_URL = this.url + '/remove_pagina_componente';
    return this.http.post(API_URL, {id_componente: id_componente, id_pagina: id_pagina}, {withCredentials: true});
  }

  obtener_paginas_componente(id_componente: string)
  {
    let API_URL = this.url + '/obtener_paginas_componente/' + id_componente;
    return this.http.get(API_URL);
  }
}


