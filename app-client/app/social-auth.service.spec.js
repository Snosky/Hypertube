"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var social_auth_service_1 = require("./social-auth.service");
describe('SocialAuthService', function () {
    beforeEach(function () {
        testing_1.TestBed.configureTestingModule({
            providers: [social_auth_service_1.SocialAuthService]
        });
    });
    it('should be created', testing_1.inject([social_auth_service_1.SocialAuthService], function (service) {
        expect(service).toBeTruthy();
    }));
});
//# sourceMappingURL=social-auth.service.spec.js.map