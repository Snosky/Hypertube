import { TestBed, inject } from '@angular/core/testing';

import { YtsService } from './yts.service';

describe('YtsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [YtsService]
    });
  });

  it('should be created', inject([YtsService], (service: YtsService) => {
    expect(service).toBeTruthy();
  }));
});
