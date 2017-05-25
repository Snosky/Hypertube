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
var comment_1 = require("../_models/comment");
var forms_1 = require("@angular/forms");
var comment_service_1 = require("../comment.service");
var flash_service_1 = require("../flash.service");
var CommentComponent = (function () {
    function CommentComponent(authService, fb, flash, commentService) {
        this.authService = authService;
        this.fb = fb;
        this.flash = flash;
        this.commentService = commentService;
        this.loading = false;
        this.commentModel = new comment_1.Comment();
        this.commentFormErrors = {
            'comment': ''
        };
        this.commentFormValidationMessages = {
            'comment': {
                'required': 'Comment is required',
                'maxlength': 'Max len 500'
            }
        };
    }
    CommentComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.currentUser = this.authService.currentUser();
        this.buildForm();
        this.commentService.get(this.imdb)
            .subscribe(function (comments) { return _this.comments = comments; }, function (error) { return _this.flash.error(error); });
    };
    CommentComponent.prototype.buildForm = function () {
        var _this = this;
        this.commentForm = this.fb.group({
            'comment': [this.commentModel.comment, [
                    forms_1.Validators.required,
                    forms_1.Validators.maxLength(500)
                ]]
        });
        this.commentForm.valueChanges
            .subscribe(function (data) { return _this.commentOnValueChange(data); });
        this.commentOnValueChange();
    };
    CommentComponent.prototype.commentOnValueChange = function (data) {
        if (!this.commentForm) {
            return;
        }
        var form = this.commentForm;
        for (var field in this.commentFormErrors) {
            // Clear previous error message
            this.commentFormErrors[field] = '';
            var control = form.get(field);
            if (control && control.dirty && !control.valid) {
                var messages = this.commentFormValidationMessages[field];
                for (var key in control.errors) {
                    this.commentFormErrors[field] += messages[key] + ' ';
                }
            }
        }
    };
    CommentComponent.prototype.commentSubmit = function () {
        var _this = this;
        this.loading = true;
        this.commentModel = this.commentForm.value;
        this.commentModel.user_id = this.currentUser;
        this.commentModel.imdb_code = this.imdb;
        this.commentService.save(this.commentModel.comment, this.commentModel.imdb_code)
            .subscribe(function (comment) {
            _this.flash.success('Your comment has been added');
            _this.loading = false;
            _this.commentModel = new comment_1.Comment();
            comment.user_id = _this.currentUser;
            _this.comments.unshift(comment);
            _this.commentForm.reset();
        }, function (error) { });
    };
    return CommentComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", String)
], CommentComponent.prototype, "imdb", void 0);
CommentComponent = __decorate([
    core_1.Component({
        selector: 'app-comment',
        templateUrl: './comment.component.html',
        styleUrls: ['./comment.component.css']
    }),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        forms_1.FormBuilder,
        flash_service_1.FlashService,
        comment_service_1.CommentService])
], CommentComponent);
exports.CommentComponent = CommentComponent;
//# sourceMappingURL=comment.component.js.map