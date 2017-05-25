import {Component, OnInit, Input} from "@angular/core";
import {AuthService} from "../auth.service";
import {User} from "../_models/user";
import {Comment} from "../_models/comment";
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {CommentService} from "../comment.service";
import {FlashService} from "../flash.service";
import {Observable} from "rxjs";

@Component({
    selector: 'app-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
    currentUser: User;
    loading = false;

    commentModel: Comment = new Comment();
    commentForm: FormGroup;

    @Input()
    imdb: string;

    comments: Comment[];

    constructor(
        private authService: AuthService,
        private fb: FormBuilder,
        private flash: FlashService,
        private commentService: CommentService
    ) { }

    ngOnInit() {
        this.currentUser = this.authService.currentUser();
        this.buildForm();

        this.commentService.get(this.imdb)
            .subscribe(
                comments => this.comments = comments,
                error => this.flash.error(error)
            )
    }

    buildForm(): void {
        this.commentForm = this.fb.group({
            'comment': [this.commentModel.comment, [
                Validators.required,
                Validators.maxLength(500)
            ]]
        });
        this.commentForm.valueChanges
            .subscribe(data => this.commentOnValueChange(data));
        this.commentOnValueChange();
    }

    commentFormErrors = {
        'comment': ''
    };

    commentFormValidationMessages = {
        'comment': {
            'required': 'Comment is required',
            'maxlength': 'Max len 500'
        }
    };


    commentOnValueChange(data?: any) {
        if (!this.commentForm) { return; }
        const form = this.commentForm;

        for (const field in this.commentFormErrors) {
            // Clear previous error message
            this.commentFormErrors[field] = '';
            const control = form.get(field);

            if (control && control.dirty && !control.valid) {
                const messages = this.commentFormValidationMessages[field];
                for (const key in control.errors) {
                    this.commentFormErrors[field] += messages[key] + ' ';
                }
            }
        }
    }

    commentSubmit(){
        this.loading = true;
        this.commentModel = this.commentForm.value;
        this.commentModel.user_id = this.currentUser;
        this.commentModel.imdb_code = this.imdb;
        this.commentService.save(this.commentModel.comment, this.commentModel.imdb_code)
            .subscribe(
                (comment: Comment) => {
                    this.flash.success('Your comment has been added');
                    this.loading = false;
                    this.commentModel = new Comment();
                    comment.user_id = this.currentUser;
                    this.comments.unshift(comment);
                    this.commentForm.reset();
                },
                error => { }
            )
    }

}