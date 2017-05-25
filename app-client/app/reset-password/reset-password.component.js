"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var user_service_1 = require("../user.service");
var forms_1 = require("@angular/forms");
var router_1 = require("@angular/router");
var flash_service_1 = require("../flash.service");
var ResetPasswordComponent = (function () {
    function ResetPasswordComponent(userService, route, router, fb, flash) {
        this.userService = userService;
        this.route = route;
        this.router = router;
        this.fb = fb;
        this.flash = flash;
        this.model = {};
        this.loading = false;
        this.formErrors = {
            'password': '',
            'passwordConf': '',
        };
        this.formValidationMessages = {
            'password': {
                'required': 'Password is required.',
                'minlength': 'Password must be at least 6 characters long.',
                'pattern': 'Password must contains at least 1 number and 1 uppercase'
            },
            'passwordConf': {
                'required': 'Password confirmation is required.',
            }
        };
    }
    ResetPasswordComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.token = this.route.snapshot.params['token'];
        this.userService.verifyToken(this.token)
            .subscribe(function (success) { return console.log('Token is valid'); }, function (error) {
            _this.flash.error('An error occurred.', true);
            _this.router.navigate(['']);
        });
        this.buildForm();
    };
    ResetPasswordComponent.prototype.buildForm = function () {
        var _this = this;
        this.form = this.fb.group({
            'password': [this.model.password, [
                    forms_1.Validators.required,
                    forms_1.Validators.minLength(6),
                    forms_1.Validators.pattern(/^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/)
                ]],
            'passwordConf': [this.model.passwordConf, [
                    forms_1.Validators.required
                ]]
        });
        this.form.valueChanges
            .subscribe(function (data) { return _this.formOnValueChange(data); });
        this.formOnValueChange();
    };
    ResetPasswordComponent.prototype.formOnValueChange = function (data) {
        if (!this.form) {
            return;
        }
        var form = this.form;
        for (var field in this.formErrors) {
            // Clear previous error message
            this.formErrors[field] = '';
            var control = form.get(field);
            if (control && control.dirty && !control.valid) {
                var messages = this.formValidationMessages[field];
                for (var key in control.errors) {
                    if (this.formErrors[field] === '')
                        this.formErrors[field] = messages[key];
                }
            }
        }
    };
    ResetPasswordComponent.prototype.submitForm = function () {
        var _this = this;
        this.loading = true;
        this.model = this.form.value;
        this.model.token = this.token;
        this.userService.resetPassword(this.model)
            .subscribe(function (result) {
            _this.flash.success('Password reset. You can no sign in', true);
            _this.router.navigate(['']);
        }, function (error) {
            _this.loading = false;
            _this.handleError(error);
        });
    };
    ResetPasswordComponent.prototype.handleError = function (error) {
        if (error.password) {
            this.form.reset();
            this.formErrors.password = error.password.msg;
        }
    };
    return ResetPasswordComponent;
}());
ResetPasswordComponent = __decorate([
    core_1.Component({
        selector: 'app-reset-password',
        templateUrl: './reset-password.component.html',
        styleUrls: ['./reset-password.component.css']
    }),
    __metadata("design:paramtypes", [user_service_1.UserService,
        router_1.ActivatedRoute,
        router_1.Router,
        forms_1.FormBuilder,
        flash_service_1.FlashService])
], ResetPasswordComponent);
exports.ResetPasswordComponent = ResetPasswordComponent;
//# sourceMappingURL=reset-password.component.js.map