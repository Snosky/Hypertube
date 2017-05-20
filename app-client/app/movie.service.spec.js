"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var movie_service_1 = require("./movie.service");
describe('MovieService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [movie_service_1.MovieService]
        });
    });
    it('should be created', testing_1.inject([movie_service_1.MovieService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=movie.service.spec.js.map