import { NgModule } from '@angular/core';
import {RouterModule, Routes} from "@angular/router";
import { HomeComponent } from "../home/home.component";
import { AuthComponent } from "../auth/auth.component";
import {AuthGuard} from "../auth.guard";
import {MyProfileComponent} from "../my-profile/my-profile.component";
import {MovieComponent} from "../movie/movie.component";
import {ShowsComponent} from "../shows/shows.component";
import {ShowComponent} from "../show/show.component";

const routes: Routes = [
    { path: '', component: HomeComponent, canActivate: [AuthGuard] },
    { path: 'auth', component: AuthComponent },
    { path: 'auth/:provider', component: AuthComponent },
    { path: 'profile', component: MyProfileComponent, canActivate: [AuthGuard] },
    { path: 'movie/:slug', component: MovieComponent, canActivate: [AuthGuard] },
    { path: 'shows', component: ShowsComponent, canActivate: [AuthGuard] },
    { path: 'show/:slug', component: ShowComponent, canActivate: [AuthGuard] },
    { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule { }
