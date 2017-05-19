let request = require('request');
let Movie = require('movie.js');
let Torrent = require('torrent.js');

let request_url = 'https://yts.ag/api/v2/list_movies.json?query_term=&limit=50&page=';


let page = 1;
let num_movie = 0;
let k = 0;

let updateMovievie = function () {
    return request(request_url + page, function (err, res, body) {
        parsed = JSON.parse(body);

        for(k in parsed.data.movies)
        {
            Movie.save(function(err, Movie, numAffected){
                if(err)
                    throw err;
            });
            num_movie++

        }
        page++;
        if (num_movie > parsed.data.movie_count)
            return;
        else
            updateMovievie();
    })
};