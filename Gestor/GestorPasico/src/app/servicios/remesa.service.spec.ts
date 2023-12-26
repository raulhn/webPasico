import { TestBed } from '@angular/core/testing';

import { RemesaService } from './remesa.service';

describe('RemesaService', () => {
  let service: RemesaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RemesaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
