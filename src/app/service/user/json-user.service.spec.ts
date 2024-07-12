import { TestBed } from '@angular/core/testing';

import { JsonUserService } from './json-user.service';

describe('JsonUserService', () => {
  let service: JsonUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JsonUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
