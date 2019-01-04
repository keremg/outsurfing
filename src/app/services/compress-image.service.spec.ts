import { TestBed } from '@angular/core/testing';

import { CompressImageService } from './compress-image.service';

describe('CompressImageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CompressImageService = TestBed.get(CompressImageService);
    expect(service).toBeTruthy();
  });
});
