"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var home_component_1 = require("../home/home.component");
var auth_component_1 = require("../auth/auth.component");
var auth_guard_1 = require("../auth.guard");
var my_profile_component_1 = require("../my-profile/my-profile.component");
var movie_component_1 = require("../movie/movie.component");
var shows_component_1 = require("../shows/shows.component");
var show_component_1 = require("../show/show.component");
var profile_component_1 = require("../profile/profile.component");
var reset_password_component_1 = require("../reset-password/reset-password.component");
var routes = [
    { path: '', component: home_component_1.HomeComponent, canActivate: [auth_guard_1.AuthGuard] },
    { path: 'auth', component: auth_component_1.AuthComponent },
    { path: 'auth/:provider', component: auth_component_1.AuthComponent },
    { path: 'profile/:id', component: profile_component_1.ProfileComponent },
    { path: 'profile', component: my_profile_component_1.MyProfileComponent, canActivate: [auth_guard_1.AuthGuard] },
    { path: 'movie/:slug', component: movie_component_1.MovieComponent, canActivate: [auth_guard_1.AuthGuard] },
    { path: 'shows', component: shows_component_1.ShowsComponent, canActivate: [auth_guard_1.AuthGuard] },
    { path: 'show/:slug', component: show_component_1.ShowComponent, canActivate: [auth_guard_1.AuthGuard] },
    { path: 'password/update/:token', component: reset_password_component_1.ResetPasswordComponent },
    { path: '**', redirectTo: '' }
];
var AppRoutingModule = (function () {
    function AppRoutingModule() {
    }
    return AppRoutingModule;
}());
AppRoutingModule = __decorate([
    core_1.NgModule({
        imports: [router_1.RouterModule.forRoot(routes)],
        exports: [router_1.RouterModule]
    })
], AppRoutingModule);
exports.AppRoutingModule = AppRoutingModule;
//# sourceMappingURL=app-routing.module.js.map