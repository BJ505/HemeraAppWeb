import { TestBed } from '@angular/core/testing';

import { JsonProductsService } from './json-products.service';

describe('JsonProductsService', () => {
  let service: JsonProductsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsonProductsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
