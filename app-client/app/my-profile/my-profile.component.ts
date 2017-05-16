import { Component, OnInit } from '@angular/core';
import {User} from "../_models/user";
import {AuthService} from "../auth.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {FlashService} from "../flash.service";
import {UserService} from "../user.service";

@Component({
    selector: 'app-my-profile',
    templateUrl: './my-profile.component.html',
    styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {
    currentUser: User;

    registerForm: FormGroup;
    registerModel: any = {};
    loading = false;

    constructor(
        private authService: AuthService,
        private fb: FormBuilder,
        private userService: UserService,
        private flash: FlashService
    ) { }

    buildForm(): void {
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
            'firstname': [this.registerModel.firstname, [
                Validators.required
            ]],
            'lastname': [this.registerModel.lastname, [
                Validators.required
            ]],
            'password': [this.registerModel.password, [
                Validators.minLength(6),
                Validators.pattern(/^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/)
            ]],
            'passwordConf': [this.registerModel.passwordConf]
        });

        this.registerForm.valueChanges
            .subscribe(data => this.registerOnValueChange(data));
        this.registerOnValueChange();
    }

    registerFormErrors = {
        'username': '',
        'email': '',
        'firstname': '',
        'lastname': '',
        'password': '',
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
        'firstname': {
            'required': 'Password confirmation is required.',
        },
        'lastname': {
            'required': 'Password confirmation is required.',
        },
        'password': {
            'minlength': 'Password must be at least 6 characters long.',
            'pattern': 'Password must contains at least 1 number and 1 uppercase'
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

    ngOnInit() {
        this.currentUser = this.authService.currentUser();
        this.registerModel.username = this.currentUser.username;
        this.registerModel.email = this.currentUser.email;
        this.registerModel.lastname = this.currentUser.lastname;
        this.registerModel.firstname = this.currentUser.firstname;
        this.buildForm();
    }

    formSubmit() {
        this.registerModel = this.registerForm.value;
        this.loading = true;
        this.userService.update(this.registerModel)
            .then(data => {
                this.loading = false;
                this.flash.success('Your profile have been successfully update.');
                this.registerForm.get('password').reset();
                this.registerForm.get('passwordConf').reset();
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
            })
    }
}
