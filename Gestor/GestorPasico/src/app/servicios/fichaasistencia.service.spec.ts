import { TestBed } from '@angular/core/testing';

import { FichaAsistenciaService } from './fichaasistencia.service';

describe('AsistenciaService', () => {
  let service: FichaAsistenciaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FichaAsistenciaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
