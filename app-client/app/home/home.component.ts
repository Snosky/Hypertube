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
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/share';
import {Subject} from "rxjs/Subject";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, AfterViewInit {
    currentUser: User;

    movies: any[] = [];

    scrollCallback: any;
    moviesContainerHeight: number = 0;

    private pageStream = new Subject<number>();
    page: number = 1;

    private searchTerms = new Subject<string>();
    term: string = '';

    private genreTerm = new Subject<string>();
    genre: string = '';

    search(term: string): void {
        this.page = 1;
        this.searchTerms.next(term);
    }

    filterGenre(term: string): void {
        this.page = 1;
        this.genreTerm.next(term);
    }

    constructor(
        private authService: AuthService,
        private ytsService: YtsService,
        private router: Router
    ) {
        this.scrollCallback = this.getNextPage.bind(this);
    }

    ngOnInit() {
        this.currentUser = this.authService.currentUser();

        const genreSource = this.genreTerm
            .map(genre => {
                this.genre = genre;
                return { query_term: this.term, page: 1, genre: genre };
            });

        const pageSource = this.pageStream
            .map(pageNumber => {
                this.page = pageNumber;
                return { query_term: this.term, page: pageNumber, genre: this.genre };
            });

        const searchSource = this.searchTerms
            .debounceTime(300)
            .distinctUntilChanged()
            .map(term => {
                this.term = term;
                return { query_term: term, page: 1, genre: this.genre };
            });

        const source = pageSource
            .merge(searchSource, genreSource)
            .startWith({ query_term: this.term, page: this.page, genre: this.genre })
            .switchMap((params: { query_term: string, page: number, genre: string }) => {
                return this.ytsService.search(params);
            })
            .catch((error: any) => {
                console.warn(error);
                return Observable.of<any[]>([]);
            });

        source.subscribe(movies => {
            if (!movies)
                return false;
            if (this.page > 1)
                this.movies = this.movies.concat(movies);
            else
                this.movies = movies;
        });
    }

    ngAfterViewInit() {
        this.moviesContainerHeight = document.documentElement.clientHeight - 56;
    }

    private getNextPage() {
        this.pageStream.next(this.page + 1);
        return this.ytsService.search({ query_term: this.term, page: this.page + 1 })
        // TODO : Change this to someting better
    }

    onResize(e: any) {
        this.moviesContainerHeight = document.documentElement.clientHeight - 56;
    }

    goToMovie(slug: string) {
        console.log(slug);
        this.router.navigate(['/slug', slug]);
    }
}



