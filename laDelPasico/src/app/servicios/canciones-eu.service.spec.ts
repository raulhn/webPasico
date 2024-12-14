import { TestBed } from '@angular/core/testing';

import { CancionesEuService } from './canciones-eu.service';

describe('CancionesEuService', () => {
  let service: CancionesEuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CancionesEuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
