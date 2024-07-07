import { TestBed } from '@angular/core/testing';

import { JsonCartService } from './json-cart.service';

describe('JsonCartService', () => {
  let service: JsonCartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsonCartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
