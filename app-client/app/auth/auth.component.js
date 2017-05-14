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
var forms_1 = require("@angular/forms");
var auth_service_1 = require("../auth.service");
var flash_service_1 = require("../flash.service");
var router_1 = require("@angular/router");
var AuthComponent = (function () {
    function AuthComponent(fb, authService, flash, router, route) {
        this.fb = fb;
        this.authService = authService;
        this.flash = flash;
        this.router = router;
        this.route = route;
        this.loading = false;
        this.loginModel = {};
        this.registerModel = {};
        this.registerFormErrors = {
            'username': '',
            'email': '',
            'password': '',
            'passwordConf': ''
        };
        this.registerValidationMessages = {
            'username': {
                'required': 'Username is required.',
                'minlength': 'Username must be at least 4 characters long.',
                'maxlength': 'Username cannot be more than 30 characters long.'
            },
            'email': {
                'required': 'Email is required.',
                'email': 'Email is not a valid email.'
            },
            'password': {
                'required': 'Password is required.',
                'minlength': 'Password must be at least 6 characters long.',
                'pattern': 'Password must contains at least 1 number and 1 uppercase'
            },
            'passwordConf': {
                'required': 'Password confirmation is required.',
            }
        };
        this.loginFormErrors = {
            'username': '',
            'password': ''
        };
    }
    AuthComponent.prototype.buildForm = function () {
        var _this = this;
        this.loginForm = this.fb.group({
            'username': [this.loginModel.username, [
                    forms_1.Validators.required
                ]],
            'password': [this.loginModel.password, [
                    forms_1.Validators.required
                ]]
        });
        this.loginForm.valueChanges
            .subscribe(function (data) { return _this.loginOnValueChange(data); });
        this.loginOnValueChange();
        this.registerForm = this.fb.group({
            'username': [this.registerModel.username, [
                    forms_1.Validators.required,
                    forms_1.Validators.minLength(3),
                    forms_1.Validators.maxLength(30)
                ]],
            'email': [this.registerModel.email, [
                    forms_1.Validators.required,
                    forms_1.Validators.email
                ]],
            'password': [this.registerModel.password, [
                    forms_1.Validators.required,
                    forms_1.Validators.minLength(6),
                    forms_1.Validators.pattern(/^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/)
                ]],
            'passwordConf': [this.registerModel.passwordConf, [
                    forms_1.Validators.required
                ]]
        });
        this.registerForm.valueChanges
            .subscribe(function (data) { return _this.registerOnValueChange(data); });
        this.registerOnValueChange();
    };
    AuthComponent.prototype.registerOnValueChange = function (data) {
        if (!this.registerForm) {
            return;
        }
        var form = this.registerForm;
        for (var field in this.registerFormErrors) {
            // Clear previous error message
            this.registerFormErrors[field] = '';
            var control = form.get(field);
            if (control && control.dirty && !control.valid) {
                var messages = this.registerValidationMessages[field];
                for (var key in control.errors) {
                    if (this.registerFormErrors[field] === '')
                        this.registerFormErrors[field] = messages[key];
                }
            }
        }
    };
    AuthComponent.prototype.loginOnValueChange = function (data) {
        if (!this.loginForm) {
            return;
        }
        var form = this.loginForm;
        for (var field in this.loginFormErrors) {
            // Clear previous error message
            this.loginFormErrors[field] = '';
            var control = form.get(field);
            if (control && control.dirty && !control.valid) {
                var messages = this.registerValidationMessages[field];
                for (var key in control.errors)
                    this.loginFormErrors[field] += messages[key] + ' ';
            }
        }
    };
    AuthComponent.prototype.ngOnInit = function () {
        this.authService.logout();
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.buildForm();
    };
    AuthComponent.prototype.submitRegister = function () {
        var _this = this;
        this.loading = true;
        this.registerModel = this.registerForm.value;
        this.authService.register(this.registerModel)
            .then(function (data) {
            _this.loading = false;
            _this.flash.success('Registration successful. You can no sign in.');
            _this.loginForm.get('username').setValue(_this.registerForm.get('username').value);
            _this.registerForm.reset();
        })
            .catch(function (error) {
            if (error.username && error.username.kind === 'unique')
                _this.registerFormErrors.username = 'Username already used.';
            if (error.email && error.email.kind === 'unique')
                _this.registerFormErrors.email = 'Email already used.';
            if (error.password) {
                _this.registerFormErrors.password = 'Passwords do not match.';
                _this.registerForm.get('passwordConf').reset();
            }
            _this.loading = false;
            //console.log(error);
        });
    };
    AuthComponent.prototype.submitLogin = function () {
        var _this = this;
        this.loading = true;
        this.loginModel = this.loginForm.value;
        this.authService.login(this.loginModel.username, this.loginModel.password)
            .then(function (data) {
            _this.loading = false;
            if (data === true) {
                _this.flash.success('You are now logged in.', true);
                _this.router.navigate([_this.returnUrl]);
            }
            else if (data === false)
                _this.flash.error('An error occurred. Please retry.');
        })
            .catch(function (error) {
            _this.loading = false;
            if (error.kind === 'invalid_password') {
                _this.loginForm.get('password').reset();
                _this.loginFormErrors.password = 'Password not valid. Or wrong username.';
            }
        });
    };
    return AuthComponent;
}());
AuthComponent = __decorate([
    core_1.Component({
        selector: 'app-auth',
        templateUrl: './auth.component.html',
        styleUrls: ['./auth.component.css']
    }),
    __metadata("design:paramtypes", [forms_1.FormBuilder,
        auth_service_1.AuthService,
        flash_service_1.FlashService,
        router_1.Router,
        router_1.ActivatedRoute])
], AuthComponent);
exports.AuthComponent = AuthComponent;
//# sourceMappingURL=auth.component.js.map