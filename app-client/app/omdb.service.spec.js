"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var omdb_service_1 = require("./omdb.service");
describe('OmdbService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [omdb_service_1.OmdbService]
        });
    });
    it('should be created', testing_1.inject([omdb_service_1.OmdbService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=omdb.service.spec.js.map