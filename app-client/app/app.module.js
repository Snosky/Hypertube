"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var http_1 = require("@angular/http");
var forms_1 = require("@angular/forms");
var app_component_1 = require("./app.component");
var app_routing_module_1 = require("./app-routing/app-routing.module");
var social_auth_component_1 = require("./social-auth/social-auth.component");
var social_auth_service_1 = require("./social-auth.service");
var app_config_1 = require("./app.config");
var home_component_1 = require("./home/home.component");
var auth_component_1 = require("./auth/auth.component");
var auth_service_1 = require("./auth.service");
var auth_guard_1 = require("./auth.guard");
var ng_bootstrap_1 = require("@ng-bootstrap/ng-bootstrap");
var flash_component_1 = require("./flash/flash.component");
var flash_service_1 = require("./flash.service");
var my_profile_component_1 = require("./my-profile/my-profile.component");
var user_service_1 = require("./user.service");
var angular2_jwt_1 = require("angular2-jwt");
var infinite_scroller_directive_1 = require("./infinite-scroller.directive");
var movie_component_1 = require("./movie/movie.component");
var movie_service_1 = require("./movie.service");
var movie_torrent_service_1 = require("./movie-torrent.service");
var ng2_nouislider_1 = require("ng2-nouislider");
var shows_component_1 = require("./shows/shows.component");
var show_service_1 = require("./show.service");
var default_image_directive_1 = require("./default-image.directive");
var show_component_1 = require("./show/show.component");
var omdb_service_1 = require("./omdb.service");
var stream_component_1 = require("./stream/stream.component");
var core_2 = require("videogular2/core");
var controls_1 = require("videogular2/controls");
var overlay_play_1 = require("videogular2/overlay-play");
var buffering_1 = require("videogular2/buffering");
var comment_component_1 = require("./comment/comment.component");
var comment_service_1 = require("./comment.service");
var profile_component_1 = require("./profile/profile.component");
var subtitles_service_1 = require("./subtitles.service");
var reset_password_component_1 = require("./reset-password/reset-password.component");
function authHttpServiceFactory(http, options) {
    return new angular2_jwt_1.AuthHttp(new angular2_jwt_1.AuthConfig({
        tokenName: 'meanToken',
        tokenGetter: (function () { return localStorage.getItem('meanToken'); }),
        globalHeaders: [{ 'Content-Type': 'application/json' }],
    }), http, options);
}
exports.authHttpServiceFactory = authHttpServiceFactory;
var AppModule = (function () {
    function AppModule() {
    }
    return AppModule;
}());
AppModule = __decorate([
    core_1.NgModule({
        imports: [
            platform_browser_1.BrowserModule,
            http_1.HttpModule,
            forms_1.FormsModule,
            forms_1.ReactiveFormsModule,
            app_routing_module_1.AppRoutingModule,
            ng_bootstrap_1.NgbModule.forRoot(),
            ng2_nouislider_1.NouisliderModule,
            core_2.VgCoreModule,
            controls_1.VgControlsModule,
            overlay_play_1.VgOverlayPlayModule,
            buffering_1.VgBufferingModule
        ],
        declarations: [
            app_component_1.AppComponent,
            social_auth_component_1.SocialAuthComponent,
            home_component_1.HomeComponent,
            auth_component_1.AuthComponent,
            flash_component_1.FlashComponent,
            my_profile_component_1.MyProfileComponent,
            infinite_scroller_directive_1.InfiniteScrollerDirective,
            movie_component_1.MovieComponent,
            shows_component_1.ShowsComponent,
            default_image_directive_1.DefaultImageDirective,
            show_component_1.ShowComponent,
            stream_component_1.StreamComponent,
            comment_component_1.CommentComponent,
            profile_component_1.ProfileComponent,
            reset_password_component_1.ResetPasswordComponent
        ],
        providers: [
            app_config_1.AppConfig,
            {
                provide: angular2_jwt_1.AuthHttp,
                useFactory: authHttpServiceFactory,
                deps: [http_1.Http, http_1.RequestOptions]
            },
            auth_guard_1.AuthGuard,
            flash_service_1.FlashService,
            social_auth_service_1.SocialAuthService,
            auth_service_1.AuthService,
            user_service_1.UserService,
            movie_service_1.MovieService,
            movie_torrent_service_1.MovieTorrentService,
            show_service_1.ShowService,
            omdb_service_1.OmdbService,
            comment_service_1.CommentService,
            subtitles_service_1.SubtitlesService
        ],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map