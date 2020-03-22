import { TestBed } from '@angular/core/testing';

import { IntractionService } from './intraction.service';

describe('IntractionService', () => {
  let service: IntractionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IntractionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
