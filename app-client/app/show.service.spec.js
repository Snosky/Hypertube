"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var show_service_1 = require("./show.service");
describe('ShowService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [show_service_1.ShowService]
        });
    });
    it('should be created', testing_1.inject([show_service_1.ShowService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=show.service.spec.js.map