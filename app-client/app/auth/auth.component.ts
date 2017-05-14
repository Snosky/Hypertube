import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../auth.service";
import {FlashService} from "../flash.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {
    loading = false;
    returnUrl: string;

    loginModel: any = {};
    loginForm: FormGroup;

    registerModel: any = {};
    registerForm: FormGroup;

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private flash: FlashService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    buildForm(): void {
        this.loginForm = this.fb.group({
            'username': [this.loginModel.username, [
                Validators.required
            ]],
            'password': [this.loginModel.password, [
                Validators.required
            ]]
        });
        this.loginForm.valueChanges
            .subscribe(data => this.loginOnValueChange(data));
        this.loginOnValueChange();

        this.registerForm = this.fb.group({
            'username': [this.registerModel.username, [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(30)
            ]],
            'email': [this.registerModel.email, [
                Validators.required,
                Validators.email
            ]],
            'password': [this.registerModel.password, [
                Validators.required,
                Validators.minLength(6),
                Validators.pattern(/^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/)
            ]],
            'passwordConf': [this.registerModel.passwordConf, [
                Validators.required
            ]]
        });
        this.registerForm.valueChanges
            .subscribe(data => this.registerOnValueChange(data));
        this.registerOnValueChange();
    }

    registerFormErrors = {
        'username': '',
        'email': '',
        'password': '',
        'passwordConf': ''
    };

    registerValidationMessages = {
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

    registerOnValueChange(data?: any) {
        if (!this.registerForm) { return; }
        const form = this.registerForm;
        for (const field in this.registerFormErrors) {
            // Clear previous error message
            this.registerFormErrors[field] = '';
            const control = form.get(field);

            if (control && control.dirty && !control.valid) {
                const messages = this.registerValidationMessages[field];
                for (const key in control.errors) {
                    if (this.registerFormErrors[field] === '')
                        this.registerFormErrors[field] = messages[key];
                }
            }
        }
    }

    loginFormErrors = {
        'username': '',
        'password': ''
    };

    loginOnValueChange(data?: any) {
        if (!this.loginForm) { return; }
        const form = this.loginForm;

        for (const field in this.loginFormErrors) {
            // Clear previous error message
            this.loginFormErrors[field] = '';
            const control = form.get(field);

            if (control && control.dirty && !control.valid) {
                const messages = this.registerValidationMessages[field];
                for (const key in control.errors)
                    this.loginFormErrors[field] += messages[key] + ' ';
            }
        }
    }

    ngOnInit() {
        this.authService.logout();
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
        this.buildForm()
    }

    submitRegister() {
        this.loading = true;
        this.registerModel = this.registerForm.value;
        this.authService.register(this.registerModel)
            .then(data => {
                this.loading = false;
                this.flash.success('Registration successful. You can no sign in.');
                this.loginForm.get('username').setValue(this.registerForm.get('username').value);
                this.registerForm.reset();
            })
            .catch(error => {
                if (error.username && error.username.kind === 'unique')
                    this.registerFormErrors.username = 'Username already used.';
                if (error.email && error.email.kind === 'unique')
                    this.registerFormErrors.email = 'Email already used.';
                if (error.password) {
                    this.registerFormErrors.password = 'Passwords do not match.';
                    this.registerForm.get('passwordConf').reset();
                }
                this.loading = false;
                //console.log(error);
            })
    }

    submitLogin() {
        this.loading = true;
        this.loginModel = this.loginForm.value;
        this.authService.login(this.loginModel.username, this.loginModel.password)
            .then(data => {
                this.loading = false;
                if (data === true) {
                    this.flash.success('You are now logged in.', true);
                    this.router.navigate([this.returnUrl]);
                }
                else if (data === false)
                    this.flash.error('An error occurred. Please retry.');
            })
            .catch(error => {
                this.loading = false;
                if (error.kind === 'invalid_password') {
                    this.loginForm.get('password').reset();
                    this.loginFormErrors.password = 'Password not valid. Or wrong username.';
                }
            });
    }

}
