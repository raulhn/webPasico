import { TestBed } from '@angular/core/testing';

import { SolicitudEliminaUsuario } from './solicitud-elimina-usuario';

describe('SolicitudEliminaUsuario', () => {
  let service: SolicitudEliminaUsuario;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SolicitudEliminaUsuario);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
