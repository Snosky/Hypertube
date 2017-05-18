import {AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import {User} from "../_models/user";
import {AuthService} from "../auth.service";
import {YtsService} from "../yts.service";
import {Observable} from "rxjs/Observable";

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/concat';
import {Subject} from "rxjs/Subject";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
    currentUser: User;
    page: number = 1;

    movies: Observable<any[]>;


    scrollCallback: any;
    moviesContainerHeight: number = 0;

    constructor(
        private authService: AuthService,
        private ytsService: YtsService
    ) {
        this.scrollCallback = this.getMovies.bind(this);
    }

    private searchTerm = new Subject<string>();
    search(term: string): void {
        this.searchTerm.next(term);
    }

    ngOnInit() {
        this.currentUser = this.authService.currentUser();

        this.movies = this.searchTerm
            .debounceTime(300)
            .distinctUntilChanged()
            .switchMap(term => this.ytsService.search({ query_term: term }))
            .catch(error => {
                console.warn(error);
                return Observable.of<any[]>([]);
            });
    }

    ngAfterViewInit() {
        this.moviesContainerHeight = document.documentElement.clientHeight - 56;
        this.getMovies();
    }

    getMovies() {
        /*this.ytsService.getDefault(this.page)
            .toPromise()
            .then((movies) => {
                if (this.movies[0])
                    this.movies = this.movies.concat(movies);
                else
                    this.movies = movies;
            });
        this.page++;
        /*return this.ytsService.getDefault(this.page)
            .then((movies) => {
                this.processMovies(movies);

            })*/
    }

    private processMovies = (movies: any) => {
        this.movies = this.movies.concat(movies);
    };

    onResize(e: any) {
        this.moviesContainerHeight = document.documentElement.clientHeight - 56;
    }
}
