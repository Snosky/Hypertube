"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var flash_service_1 = require("./flash.service");
describe('FlashService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [flash_service_1.FlashService]
        });
    });
    it('should be created', testing_1.inject([flash_service_1.FlashService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=flash.service.spec.js.map