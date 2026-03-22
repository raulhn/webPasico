import { TestBed } from '@angular/core/testing';

import { InterfazPersonaService } from './interfaz-persona.service';

describe('InterfazPersonaService', () => {
  let service: InterfazPersonaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InterfazPersonaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
