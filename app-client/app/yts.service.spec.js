"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var yts_service_1 = require("./yts.service");
describe('YtsService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [yts_service_1.YtsService]
        });
    });
    it('should be created', testing_1.inject([yts_service_1.YtsService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=yts.service.spec.js.map