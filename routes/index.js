var express = require('express');
var router = express.Router();
var config = require('../config/config');
var request = require('request');
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var connection = mysql.createConnection(config.db);
connection.connect((error) => {

});

const apiBaseUrl = 'http://api.themoviedb.org/3';
const nowPlayingUrl = apiBaseUrl + '/movie/now_playing?api_key=' + config.apiKey
const imageBaseUrl = 'http://image.tmdb.org/t/p/w300';

/* HOME */
router.get('/', function(req, res, next) {
    var message = req.query.msg;
    if (message == "registered") {
        message = "Congratulations! You are registered. Enjoy the site."
    } else if (message == "fail") {
        message = "That user/password combination is not recognized. Please re-enter."
    }
    request.get(nowPlayingUrl, (error, response, movieData) => {
        var parsedData = JSON.parse(movieData);
        if (parsedData !== undefined) {
            res.render('index', {
                title: 'Movie App',
                parsedData: parsedData.results,
                imageBaseUrl: imageBaseUrl,
                message: message
            });
        } else {
            res.json("There was an error.")
        }
    });
});

/* LOGIN */
router.get('/login', (req, res) => {
    res.render('login', {})
})
router.post('/loginProcess', (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    var selectQuery = "SELECT * FROM users WHERE email = ?"
    connection.query(selectQuery, [email], (error, results) => {
        if (results.length == 0) {
            console.log("these arent's the droids we are looking for");
            res.redirect('login?msg=badUser')
        } else {
            console.log("this IS the droid we are looking");
            var doTheyMatch = bcrypt.compareSync(password, results[0].password);
            if (doTheyMatch) {
                res.redirect('/?msg=loggedId')
            } else {
                res.redirect('/login?msg="tryagain')
            }
        }
    })
});

/* REGISTER */
router.get('/register', (req, res, next) => {
    res.render('register', {})
})

router.post('/registerProcess', (req, res, nex) => {
    // res.json(req.body);
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var hash = bcrypt.hashSync(password);
    console.log(hash);
    const selectQuery = "SELECT * FROM users WHERE email = ?;";
    connection.query(selectQuery, [email], (error, results) => {
        if (results.length == 0) {
            var insertQuery = "INSERT INTO users (name, email, password) VALUES (?,?,?);";
            connection.query(insertQuery, [name, email, hash], (error) => {
                if (error) {
                    throw error;
                } else {
                    res.redirect("/?msg=registered");
                }
            })
        } else {
            res.redirect("/?msg=fail")
        }
    });
})

/* FAVORITES */
router.get('/favorites', (req, res) => {
    var savedMovies = "SELECT savedMovies FROM favorites;";
    res.render('favorites'), {
        savedMovies: savedMovies,
        imageBaseUrl: imageBaseUrl
    }
})

/* SEARCH */
router.post('/search', (req, res) => {
    var userSearchTerm = req.body.movieSearch;
    var userSearchActor = req.body.actorSearch;
    var queryString = req.query.key;
    var searchUrl = `${apiBaseUrl}/search/movie?query=${userSearchTerm}&api_key=${config.apiKey}`;
    request.get(searchUrl, (error, response, movieData) => {
        var parsedData = JSON.parse(movieData);
        res.render('index', {
            parsedData: parsedData.results,
            imageBaseUrl: imageBaseUrl,
        });
    });
});
//if you have /: that part of th path is Wild!
//in this case, /movie/:movieId will trigger /movie/ANYTHING
// to access the ANYTHING, you go tot req.params.ANYTHING
// this makes your urls cleaner

router.get('/movie/:movieId', (req, res) => {
    // res.json(req.params);
    var movieId = req.params.movieId;
    var thisMovieUrl = `${apiBaseUrl}/movie/${movieId}?api_key=${config.apiKey}`;
    request.get(thisMovieUrl, (error, response, movieData) => {
        var parsedData = JSON.parse(movieData);
        // res.json(parsedData);
        res.render('single-movie', {
            movieData: parsedData,
            imageBaseUrl: imageBaseUrl
        })
    })
});

module.exports = router;