export class Movie {
    _id: string;
    imdb_code: string;
    title: string;
    slug: string;
    year: number;
    rating: number;
    runtime: number;
    genres: string[];
    description_intro: string;
    description_full: string;
    yt_trailer_code: string;
    language: string;
    mpa_rating: string;
    background_image: string;
    background_image_original: string;
    small_cover_image: string;
    medium_cover_image: string;
    large_cover_image: string;
    seen: boolean;
}
