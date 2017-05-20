import { TestBed, inject } from '@angular/core/testing';

import { MovieTorrentService } from './movie-torrent.service';

describe('MovieTorrentService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MovieTorrentService]
    });
  });

  it('should be created', inject([MovieTorrentService], (service: MovieTorrentService) => {
    expect(service).toBeTruthy();
  }));
});
