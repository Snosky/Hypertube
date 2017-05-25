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
var auth_service_1 = require("../auth.service");
var forms_1 = require("@angular/forms");
var flash_service_1 = require("../flash.service");
var user_service_1 = require("../user.service");
var MyProfileComponent = (function () {
    function MyProfileComponent(authService, fb, userService, flash) {
        this.authService = authService;
        this.fb = fb;
        this.userService = userService;
        this.flash = flash;
        this.registerModel = {};
        this.loading = false;
        this.imageValid = false;
        this.image = null;
        this.registerFormErrors = {
            'username': '',
            'email': '',
            'firstname': '',
            'lastname': '',
            'password': '',
            'pic': ''
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
            'firstname': {
                'required': 'Password confirmation is required.',
            },
            'lastname': {
                'required': 'Password confirmation is required.',
            },
            'password': {
                'minlength': 'Password must be at least 6 characters long.',
                'pattern': 'Password must contains at least 1 number and 1 uppercase'
            },
            'pic': {
                'required': 'Please select an avatar.',
                'type': 'File type not allowed. Only png and jpeg are allowed.',
                'size': 'File is too big. 5Mo max.'
            }
        };
    }
    MyProfileComponent.prototype.buildForm = function () {
        var _this = this;
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
            'firstname': [this.registerModel.firstname, [
                    forms_1.Validators.required
                ]],
            'lastname': [this.registerModel.lastname, [
                    forms_1.Validators.required
                ]],
            'password': [this.registerModel.password, [
                    forms_1.Validators.minLength(6),
                    forms_1.Validators.pattern(/^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/)
                ]],
            'passwordConf': [this.registerModel.passwordConf]
        });
        this.registerForm.valueChanges
            .subscribe(function (data) { return _this.registerOnValueChange(data); });
        this.registerOnValueChange();
    };
    MyProfileComponent.prototype.picChangeEvent = function (fileInput) {
        this.registerFormErrors.pic = '';
        if (fileInput.target.files[0] === undefined) {
            this.imageValid = false;
            this.registerFormErrors.pic = this.registerValidationMessages.pic.required;
        }
        else if (['image/jpeg', 'image/jpg', 'image/png'].indexOf(fileInput.target.files[0].type) === -1) {
            this.imageValid = false;
            this.registerFormErrors.pic = this.registerValidationMessages.pic.type;
        }
        else if (fileInput.target.files[0].size > 5242880) {
            this.imageValid = false;
            this.registerFormErrors.pic = this.registerValidationMessages.pic.size;
        }
        else {
            this.image = fileInput.target.files[0];
            this.imageValid = true;
        }
        //this.registerFormValid = this.registerForm.valid && this.imageValid;
    };
    MyProfileComponent.prototype.registerOnValueChange = function (data) {
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
    MyProfileComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.currentUser = this.authService.currentUser();
        this.userService.me()
            .then(function (user) {
            _this.registerModel.username = user.username;
            _this.registerModel.email = user.email;
            _this.registerModel.lastname = user.lastname;
            _this.registerModel.firstname = user.firstname;
            _this.buildForm();
        });
    };
    MyProfileComponent.prototype.formSubmit = function () {
        var _this = this;
        this.registerModel = this.registerForm.value;
        if (this.imageValid)
            this.registerModel.pic = this.image;
        this.loading = true;
        this.userService.update(this.registerModel)
            .then(function (data) {
            _this.authService.saveToken(data.token);
            _this.loading = false;
            _this.flash.success('Your profile have been successfully update.');
            _this.registerForm.get('password').reset();
            _this.registerForm.get('passwordConf').reset();
        })
            .catch(function (error) {
            if (error.username && error.username.msg === 'Invalid username')
                _this.registerFormErrors.username = 'Invalid username. Must be alphanumeric (no space allowed)';
            if (error.username && error.username.kind === 'unique')
                _this.registerFormErrors.username = 'Username already used.';
            if (error.email && error.email.kind === 'unique')
                _this.registerFormErrors.email = 'Email already used.';
            if (error.password) {
                _this.registerFormErrors.password = 'Passwords do not match.';
                _this.registerForm.get('passwordConf').reset();
            }
            _this.loading = false;
        });
    };
    MyProfileComponent.prototype.profilePicChange = function (e) {
        //console.log(e.target.files);
        // TODO : Profile Pics
    };
    return MyProfileComponent;
}());
MyProfileComponent = __decorate([
    core_1.Component({
        selector: 'app-my-profile',
        templateUrl: './my-profile.component.html',
        styleUrls: ['./my-profile.component.css']
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        forms_1.FormBuilder,
        user_service_1.UserService,
        flash_service_1.FlashService])
], MyProfileComponent);
exports.MyProfileComponent = MyProfileComponent;
//# sourceMappingURL=my-profile.component.js.map