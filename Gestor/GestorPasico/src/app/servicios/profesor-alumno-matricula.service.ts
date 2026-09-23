import { Injectable } from '@angular/core';
import { URL } from '../logica/constantes';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ProfesorAlumnoMatriculaService {
  private url: string = URL.URL_SERVICIO;

  constructor(private http: HttpClient) {}

  cambiarFechaAltaAlumnoProfesor(
    nid_profesor_alumno_matricula: string,
    nueva_fecha_alta: string,
  ) {
    let API_URL = this.url + '/cambiar_fecha_alta_alumno_profesor_matricula';
    return this.http.post(
      API_URL,
      {
        nid_profesor_alumno_matricula: nid_profesor_alumno_matricula,
        nueva_fecha_alta: nueva_fecha_alta,
      },
      { withCredentials: true },
    );
  }

  cambiarFechaBajaAlumnoProfesor(
    nid_profesor_alumno_matricula: string,
    nueva_fecha_baja: string,
  ) {
    let API_URL = this.url + '/cambiar_fecha_baja_alumno_profesor_matricula';
    return this.http.post(
      API_URL,
      {
        nid_profesor_alumno_matricula: nid_profesor_alumno_matricula,
        nueva_fecha_baja: nueva_fecha_baja,
      },
      { withCredentials: true },
    );
  }

  bajaProfesor(nid_profesor: string, nid_asignatura: string) {
    let API_URL = this.url + '/darDeBajaProfesor';
    return this.http.post(
      API_URL,
      {
        nid_profesor: nid_profesor,
        nid_asignatura: nid_asignatura,
      },
      { withCredentials: true },
    );
  }

  quitarProfesor(nid_profesor: string, nid_matricula_asignatura: string) {
    let API_URL = this.url + '/quitar_profesor';
    return this.http.post(
      API_URL,
      {
        nid_profesor: nid_profesor,
        nid_matricula_asignatura: nid_matricula_asignatura,
      },
      { withCredentials: true },
    );
  }
}
