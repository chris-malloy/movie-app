var express = require('express');
var router = express.Router();
var config = require('../config/config');
var request = require('request');

const apiBaseUrl = 'http://api.themoviedb.org/3';
const nowPlayingUrl = apiBaseUrl + '/movie/now_playing?api_key=' + config.apiKey
const imageBaseUrl = 'http://image.tmdb.org/t/p/w300';

/* GET home page. */
router.get('/', function(req, res, next) {
    request.get(nowPlayingUrl, (error, response, movieData) => {
        var parsedData = JSON.parse(movieData);
        res.render('index', {
            parsedData: parsedData.results,
            imageBaseUrl: imageBaseUrl
        });
    });
});

router.post('/search', (req, res) => {
    request.get(nowPlayingUrl, (error, response, movieData) => {
        var userSearchTerm = req.body.movieSearch;
        var userSearchActor = req.body.actorSearch;
        // req.query.key fetches query value of key from request...
        //look to index.ejs to action value of form tag
        var queryString = req.query.key;
        var parsedData = JSON.parse(movieData);
        res.render('index', {
            parsedData: parsedData.results,
            imageBaseUrl: imageBaseUrl
        });
    });
})

//if you have /: that part of th path is Wild!
//in this case, /movie/:movieId will trigger /movie/ANYTHING
// to access the ANYTHING, you go tot req.params.ANYTHING
// this makes your urls cleaner

router.get('/movie/:movieId', (req, res) => {
    // res.json(req.params);
    var movieId = req.params.movieId;
    var thisMovieUrl = `${apiBaseUrl}/movie/${movieId}?api_Key=${config.apiKey}`
    request.get(thisMovieUrl, (error, response, movieData) => {
        var parsedData = JSON.parse(movieDta);
        // res.json(parsedData);
        res.render('single-movie', {
            movieData: parsedData,
            imageBaseUrl: imageBaseUrl
        })
    })
});

module.exports = router;