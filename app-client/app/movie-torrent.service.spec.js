"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var movie_torrent_service_1 = require("./movie-torrent.service");
describe('MovieTorrentService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [movie_torrent_service_1.MovieTorrentService]
        });
    });
    it('should be created', testing_1.inject([movie_torrent_service_1.MovieTorrentService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=movie-torrent.service.spec.js.map