import { TestBed } from '@angular/core/testing';

import { ServicioPreinscripcionService } from './servicio-preinscripcion.service';

describe('ServicioPreinscripcionService', () => {
  let service: ServicioPreinscripcionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicioPreinscripcionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
