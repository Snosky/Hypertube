import {Component, OnInit} from "@angular/core";
import {UserService} from "../user.service";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {FlashService} from "../flash.service";
@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit{
    form: FormGroup;
    model: any = {};
    loading = false;
    token: string;

    constructor(
        private userService: UserService,
        private route: ActivatedRoute,
        private router: Router,
        private fb: FormBuilder,
        private flash: FlashService
    ) { }

    ngOnInit() {
        this.token = this.route.snapshot.params['token'];

        this.userService.verifyToken(this.token)
            .subscribe(
                (success: any) => console.log('Token is valid'),
                (error: any) => {
                    this.flash.error('An error occurred.', true);
                    this.router.navigate([''])
                }
            );
        this.buildForm()
    }

    buildForm(): void {
        this.form = this.fb.group({
            'password': [this.model.password, [
                Validators.required,
                Validators.minLength(6),
                Validators.pattern(/^((?=\S*?[A-Z])(?=\S*?[a-z])(?=\S*?[0-9]).{6,})\S$/)
            ]],
            'passwordConf': [this.model.passwordConf, [
                Validators.required
            ]]
        });
        this.form.valueChanges
            .subscribe(data => this.formOnValueChange(data));
        this.formOnValueChange();
    }

    formErrors = {
        'password': '',
        'passwordConf': '',
    };

    formValidationMessages = {
        'password': {
            'required': 'Password is required.',
            'minlength': 'Password must be at least 6 characters long.',
            'pattern': 'Password must contains at least 1 number and 1 uppercase'
        },
        'passwordConf': {
            'required': 'Password confirmation is required.',
        }
    };

    formOnValueChange(data?: any) {
        if (!this.form) { return; }
        const form = this.form;
        for (const field in this.formErrors) {
            // Clear previous error message
            this.formErrors[field] = '';
            const control = form.get(field);

            if (control && control.dirty && !control.valid) {
                const messages = this.formValidationMessages[field];
                for (const key in control.errors) {
                    if (this.formErrors[field] === '')
                        this.formErrors[field] = messages[key];
                }
            }
        }
    }

    submitForm(){
        this.loading = true;
        this.model = this.form.value;
        this.model.token = this.token;
        this.userService.resetPassword(this.model)
            .subscribe(
                (result: any) => {
                    this.flash.success('Password reset. You can no sign in', true);
                    this.router.navigate(['']);
                },
                (error: any) => {
                    this.loading = false;
                    this.handleError(error)
                }
            )
    }

    handleError(error: any){
        if (error.password) {
            this.form.reset();
            this.formErrors.password = error.password.msg;
        }
    }
}