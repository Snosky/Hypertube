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
var yts_service_1 = require("./yts.service");
var infinite_scroller_directive_1 = require("./infinite-scroller.directive");
var movie_component_1 = require("./movie/movie.component");
var safe_html_pipe_1 = require("./safe-html.pipe");
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
            safe_html_pipe_1.SafeHtmlPipe
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
            yts_service_1.YtsService
        ],
        bootstrap: [app_component_1.AppComponent]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map