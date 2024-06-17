import { TestBed } from '@angular/core/testing';

import { PreinscripcionService } from './preinscripcion.service';

describe('PreinscripcionService', () => {
  let service: PreinscripcionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PreinscripcionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
