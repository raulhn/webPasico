import { TestBed } from '@angular/core/testing';

import { ComponenteComponentesService } from './componente-componentes.service';

describe('ComponenteComponentesService', () => {
  let service: ComponenteComponentesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComponenteComponentesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
