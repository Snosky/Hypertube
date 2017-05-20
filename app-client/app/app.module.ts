import {NgModule}      from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {Http, HttpModule, RequestOptions} from '@angular/http';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import { AppComponent }  from './app.component';
import { AppRoutingModule } from "./app-routing/app-routing.module";
import { SocialAuthComponent } from './social-auth/social-auth.component';
import { SocialAuthService } from "./social-auth.service";
import { AppConfig } from "./app.config";
import { HomeComponent } from './home/home.component';
import { AuthComponent } from './auth/auth.component';
import {AuthService} from "./auth.service";
import {AuthGuard} from "./auth.guard";
import {NgbModule} from "@ng-bootstrap/ng-bootstrap";
import { FlashComponent } from './flash/flash.component';
import {FlashService} from "./flash.service";
import { MyProfileComponent } from './my-profile/my-profile.component';
import {UserService} from "./user.service";
import { AuthHttp, AuthConfig } from 'angular2-jwt';
import { InfiniteScrollerDirective } from './infinite-scroller.directive';
import { MovieComponent } from './movie/movie.component';
import { SafeHtmlPipe } from './safe-html.pipe';
import {MovieService} from "./movie.service";
import {MovieTorrentService} from "./movie-torrent.service";

export function authHttpServiceFactory(http: Http, options: RequestOptions) {
    return new AuthHttp(new AuthConfig({
        tokenName: 'meanToken',
        tokenGetter: (() => localStorage.getItem('meanToken')),
        globalHeaders: [{'Content-Type':'application/json'}],
    }), http, options);
}

@NgModule({
    imports:      [
        BrowserModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        NgbModule.forRoot(),
    ],
    declarations: [
        AppComponent,
        SocialAuthComponent,
        HomeComponent,
        AuthComponent,
        FlashComponent,
        MyProfileComponent,
        InfiniteScrollerDirective,
        MovieComponent,
        SafeHtmlPipe
    ],
    providers: [
        AppConfig,
        {
            provide: AuthHttp,
            useFactory: authHttpServiceFactory,
            deps: [Http, RequestOptions]
        },
        AuthGuard,
        FlashService,
        SocialAuthService,
        AuthService,
        UserService,
        MovieService,
        MovieTorrentService
    ],
    bootstrap:    [ AppComponent]
})
export class AppModule { }
