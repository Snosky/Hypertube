import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
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

@NgModule({
    imports:      [
        BrowserModule,
        HttpModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        NgbModule.forRoot()
    ],
    declarations: [
        AppComponent,
        SocialAuthComponent,
        HomeComponent,
        AuthComponent,
        FlashComponent
    ],
    providers: [
        AppConfig,
        AuthGuard,
        FlashService,
        SocialAuthService,
        AuthService
    ],
    bootstrap:    [ AppComponent]
})
export class AppModule { }
