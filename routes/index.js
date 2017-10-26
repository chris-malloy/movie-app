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
    // res.render('index', { title: 'Movie App' });
});

module.exports = router;