import {AfterViewInit, Component, OnInit } from '@angular/core';
import {User} from "../_models/user";
import {AuthService} from "../auth.service";
import {Observable} from "rxjs/Observable";
import {Subject} from "rxjs/Subject";
import {MovieService} from "../movie.service";
import {Movie} from "../_models/movie";

import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/merge';
import 'rxjs/add/operator/share';


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

    yearsRange: any;
    yearsRangeFormat: any;
    ratingRangeFormat = [0, 100];

    private pageStream = new Subject<number>();
    page: number = 1;

    private searchTerms = new Subject<string>();
    term: string = '';

    private genreTerm = new Subject<Array<string>>();
    genres: Array<String> = [];

    private years = new Subject<Array<number>>();
    private rating = new Subject<Array<number>>();

    private orderTerm = new Subject<string>();
    order: string = '';

    search(term: string): void {
        this.page = 1;
        this.searchTerms.next(term);
    }

    filterGenre(select: any): void {
        let options: Array<string> = [];
        for (let i = 0; i < select.target.selectedOptions.length; i++)
            if (select.target.selectedOptions[i].value !== 'all')
                options[i] = select.target.selectedOptions[i].value;
        this.page = 1;
        this.genreTerm.next(options);
    }

    yearsRangeChange(e: Array<number>) {
        this.page = 1;
        this.years.next(e);
    };

    ratingRangeChange(e: Array<number>) {
        this.page = 1;
        this.rating.next(e);
    }

    filterOrder(term: string): void {
        this.page = 1;
        this.orderTerm.next(term);
    }

    constructor(private authService: AuthService,
                private movieService: MovieService) {
        this.scrollCallback = this.getNextPage.bind(this);
    }

    ngOnInit() {
        this.currentUser = this.authService.currentUser();

        // Get years range
        this.movieService.yearsRange()
            .then(range => {
                this.yearsRange = range;
                this.yearsRangeFormat = [range.min, range.max]
            });

        const pageSource = this.pageStream
            .map(pageNumber => {
                this.page = pageNumber;
                return {
                    query_term: this.term,
                    page: pageNumber,
                    genres: this.genres,
                    years: this.yearsRangeFormat,
                    rating: this.ratingRangeFormat,
                    order: this.order
                };
            });

        const genreSource = this.genreTerm
            .map(genres => {
                this.genres = genres;
                return {
                    query_term: this.term,
                    page: 1,
                    genres: genres,
                    years: this.yearsRangeFormat,
                    rating: this.ratingRangeFormat,
                    order: this.order
                };
            });

        const yearsSource = this.years
            .map(range => {
                this.yearsRangeFormat = range;
                return {
                    query_term: this.term,
                    page: 1,
                    genres: this.genres,
                    years: range,
                    rating: this.ratingRangeFormat,
                    order: this.order
                }
            });

        const ratingSource = this.rating
            .map(range => {
                this.ratingRangeFormat = range;
                return {
                    query_term: this.term,
                    page: 1,
                    genres: this.genres,
                    years: this.yearsRangeFormat,
                    rating: range,
                    order: this.order
                }
            });

        const orderSource = this.orderTerm
            .map(order => {
                this.order = order;
                return {
                    query_term: this.term,
                    page: 1,
                    genres: this.genres,
                    years: this.yearsRangeFormat,
                    rating: this.ratingRangeFormat,
                    order: order
                };
            });

        const searchSource = this.searchTerms
            .debounceTime(300)
            .distinctUntilChanged()
            .map(term => {
                this.term = term;
                return {
                    query_term: term,
                    page: 1,
                    genres: this.genres,
                    years: this.yearsRangeFormat,
                    rating: this.ratingRangeFormat,
                    order: this.order
                };
            });

        const source = pageSource
            .merge(searchSource, genreSource, yearsSource, ratingSource, orderSource)
            .startWith({
                query_term: this.term,
                page: this.page,
                genres: this.genres,
                years: this.yearsRangeFormat,
                rating: this.ratingRangeFormat,
                order: this.order
            })
            .switchMap((params: { query_term: string, page: number, genres: Array<string>, years: Array<number>, rating: Array<number>, order: string }) => {
                return this.movieService.search(params);
            })
            .catch((error: any) => {
                console.warn(error);
                return Observable.of<Movie[]>([]);
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
        return this.movieService.search({
            query_term: this.term,
            page: this.page + 1,
            genres: this.genres,
            years: this.yearsRangeFormat,
            rating: this.ratingRangeFormat
        })
        // TODO : Change this to someting better
    }

    onResize(e: any) {
        this.moviesContainerHeight = document.documentElement.clientHeight - 56;
    }
}
