#! /usr/bin/env node

console.log('This script populates some test games, publishers, genres to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/local_library?retryWrites=true');

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async')
var Game = require('./models/game')
var Genre = require('./models/genre')
var Publisher = require('./models/publisher')


var mongoose = require('mongoose');
var mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var games = []
var genres = []
var publishers = []

function genreCreate(name, cb) {
  var genre = new Genre({ name: name });
       
  genre.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Genre: ' + genre);
    genres.push(genre)
    cb(null, genre);
  }   );
}

function gameCreate(name, summary, date_of_publish, publisher, genre, steam_page, cb) {
  gamedetail = { 
    name: name,
    summary: summary,
    date_of_publish: date_of_publish,
    publisher: publisher,
    genre: genre,
    steam_page: steam_page
  }
  if (genre != false) gamedetail.genre = genre
  
  var game = new Game(gamedetail);    
  game.save(function (err) {
    if (err) {
      cb(err, null)
      return
    }
    console.log('New Game: ' + game);
    games.push(game)
    cb(null, game)
  }  );
}


function publisherCreate(name, founded, website, cb) {
  publisherdetail = { 
    name: name,
    founded: founded,
    website: website
  }    
    
  var publisher = new Publisher(publisherdetail);    
  publisher.save(function (err) {
    if (err) {
      console.log('ERROR CREATING Publisher: ' + publisher);
      cb(err, null)
      return
    }
    console.log('New Publisher: ' + publisher);
    publishers.push(publisher)
    cb(null, publisher)
  }  );
}

function createGenre(cb) {
    async.series([
        function(callback) {
          genreCreate("Classic", callback);
        },
        function(callback) {
          genreCreate("Action", callback);
        },
        function(callback) {
          genreCreate("RPG", callback);
        },
        function(callback) {
          genreCreate("Puzzle", callback);
        }
        ],
        // optional callback
        cb);
}

function createPublisher(cb) {
  async.series([
      function(callback) {
        publisherCreate("CAPCOM",'1979-5-30','https://www.capcom.co.jp/', callback);
      },
      function(callback) {
        publisherCreate("SNK",'1978-7-22','https://www.snk-corp.co.jp/', callback);
      },
      function(callback) {
        publisherCreate("Steel Crate Games",'2014-1-23','https://steelcrategames.com/', callback);
      }
      ],
      // optional callback
      cb);
}

function createGames(cb) {
    async.parallel([
        function(callback) {
          gameCreate('Dead Rising® 2', 'The sequel to the million-plus selling Dead Rising, Dead Rising 2 takes the zombie survival horror to Fortune City, Americas latest and greatest entertainment playground.','2010-09-27', publishers[0], [genres[1],], 'https://store.steampowered.com/app/45740/Dead_Rising_2/', callback);
        },
        function(callback) {
          gameCreate('METAL SLUG 3', '“METAL SLUG 3”, the masterpiece in SNKs emblematic 2D run & gun action shooting game series, still continues to fascinate millions of fans worldwide to this day for its intricate dot-pixel graphics, and simple and intuitive game controls!','2014-02-15', publishers[1], [genres[0],genres[1]], 'https://store.steampowered.com/app/250180/METAL_SLUG_3/', callback);
        },
        function(callback) {
          gameCreate('Keep Talking and Nobody Explodes', 'Find yourself trapped alone in a room with a ticking time bomb. Your friends have the manual to defuse it, but they cant see the bomb, so youre going to have to talk it out – fast!','2015-10-09', publishers[2], [genres[3],], 'https://store.steampowered.com/app/341800/Keep_Talking_and_Nobody_Explodes/', callback);
        }
        ],
        // optional callback
        cb);
}

async.series([
  createPublisher,
  createGenre,
  createGames,
],
// Optional callback
function(err, results) {
    if (err) {
        console.log('FINAL ERR: '+ err);
    }
    else {
        console.log('Publisher: '+ publishers);
        
    }
    // All done, disconnect from database
    mongoose.connection.close();
});




