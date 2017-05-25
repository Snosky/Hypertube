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
import {MovieService} from "./movie.service";
import {MovieTorrentService} from "./movie-torrent.service";
import {NouisliderModule} from "ng2-nouislider";
import { ShowsComponent } from './shows/shows.component';
import {ShowService} from "./show.service";
import { DefaultImageDirective } from './default-image.directive';
import { ShowComponent } from './show/show.component';
import {OmdbService} from "./omdb.service";
import { StreamComponent } from './stream/stream.component';
import {VgCoreModule} from 'videogular2/core';
import {VgControlsModule} from 'videogular2/controls';
import {VgOverlayPlayModule} from 'videogular2/overlay-play';
import {VgBufferingModule} from 'videogular2/buffering';
import {CommentComponent} from "./comment/comment.component";
import {CommentService} from "./comment.service";
import {ProfileComponent} from "./profile/profile.component";
import {SubtitlesService} from "./subtitles.service";
import {ResetPasswordComponent} from "./reset-password/reset-password.component";

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
        NouisliderModule,
        VgCoreModule,
        VgControlsModule,
        VgOverlayPlayModule,
        VgBufferingModule
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
        ShowsComponent,
        DefaultImageDirective,
        ShowComponent,
        StreamComponent,
        CommentComponent,
        ProfileComponent,
        ResetPasswordComponent
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
        MovieTorrentService,
        ShowService,
        OmdbService,
        CommentService,
        SubtitlesService
    ],
    bootstrap:    [ AppComponent]
})
export class AppModule { }
