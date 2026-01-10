import { TestBed } from '@angular/core/testing';

import { ProfesorAlumnoMatriculaService } from './profesor-alumno-matricula.service';

describe('ProfesorAlumnoMatriculaService', () => {
  let service: ProfesorAlumnoMatriculaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfesorAlumnoMatriculaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
