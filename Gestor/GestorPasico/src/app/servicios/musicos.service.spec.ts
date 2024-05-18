import { TestBed } from '@angular/core/testing';

import { MusicosService } from './musicos.service';

describe('MusicosService', () => {
  let service: MusicosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MusicosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
