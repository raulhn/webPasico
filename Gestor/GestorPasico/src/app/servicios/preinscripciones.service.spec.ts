import { TestBed } from '@angular/core/testing';

import { PreinscripcionesService } from './preinscripciones.service';

describe('PreinscripcionesService', () => {
  let service: PreinscripcionesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreinscripcionesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
