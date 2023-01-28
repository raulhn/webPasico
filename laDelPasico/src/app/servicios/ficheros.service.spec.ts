import { TestBed } from '@angular/core/testing';

import { FicherosService } from './ficheros.service';

describe('FicherosService', () => {
  let service: FicherosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FicherosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
