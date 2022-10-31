const Game = require('../models/game');
const Publisher = require('../models/publisher');
const Genre = require('../models/genre');

const { body, validationResult } = require("express-validator");

var async = require('async');

//Display list of all game
exports.game_list = function(req, res, next) {
    Game.find({},"name summary")
        .sort({name:1})
        .exec(function (err, list_games) {
            if (err) {
              return next(err);
            }
            //Successful, so render
            res.render("game_list", { title: "Wish List", game_list: list_games });
        });
};

// Display detail page for a specific Game.
exports.game_detail = (req, res, next) => {
  async.parallel(
    {
      game(callback) {
        Game.findById(req.params.id)
        .populate("publisher genre")
        .exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.game == null) {
        // No results.
        console.log(game)
        const err = new Error("Game not found");
        err.status = 404;
        return next(err);
      }
      // Successful, so render
      res.render("game_detail", {
        title: "Game Detail",
        game: results.game,
      });
    }
  );
};

// Display Genre create form on GET.
exports.game_create_get = (req, res) => {
  // Get all publishers and genres, which we can use for adding to our game.
  async.parallel(
    {
      publishers(callback) {
        Publisher.find(callback);
      },
      genres(callback) {
        Genre.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render("game_form", {
        title: "Create Gmae",
        publishers: results.publishers,
        genres: results.genres,
      });
    }
  );
}

// Handle game create on POST.
exports.game_create_post = [
  // Convert the genre to an array.
  (req, res, next) => {
    if (!Array.isArray(req.body.genre)) {
      req.body.genre =
        typeof req.body.genre === "undefined" ? [] : [req.body.genre];
    }
    next();
  },

  // Validate and sanitize fields.
  body("name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("publisher", "publisher must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("summary", "Summary must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("date", "Date must not be empty")
    .trim()
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body("genre.*").escape(),
  body("steam", "Steam page must not be empty.")
    .trim()
    .isLength({ min: 1 }),
  body("steam", "Must be steam page.")
    .isURL({protocols: ['https']})
    .matches('https://store.steampowered.com/app'),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Game object with escaped and trimmed data.
    const game = new Game({
      name: req.body.name,
      summary: req.body.summary,
      date_of_publish: req.body.data,
      publisher: req.body.publisher,
      genre: req.body.genre,
      steam_page:req.body.steam
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get all publishers and genres for form.
      async.parallel(
        {
          publishers(callback) {
            Publisher.find(callback);
          },
          genres(callback) {
            Genre.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }

          // Mark our selected genres as checked.
          for (const genre of results.genres) {
            if (game.genre.includes(genre._id)) {
              genre.checked = "true";
            }
          }
          res.render("game_form", {
            title: "Create Game",
            publishers: results.publishers,
            genres: results.genres,
            game,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    // Data from form is valid. Save book.
    game.save((err) => {
      if (err) {
        return next(err);
      }
      // Successful: redirect to new book record.
      res.redirect(game.url);
    });
  },
];

// Display game update form on GET.
exports.game_update_get = (req, res, next) => {
  // Get game for form.
  async.parallel(
    {
      game(callback) {
        Game.findById(req.params.id)
        .populate("publisher genre")
        .exec(callback);
      },
      publishers(callback) {
        Publisher.find(callback);
      },
      genres(callback) {
        Genre.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.game == null) {
        // No results.
        const err = new Error("Game not found");
        err.status = 404;
        return next(err);
      }
      // Success.
      res.render("game_form", {
        title: "Update Game",
        game: results.game,
        publishers: results.publishers,
        genres: results.genres,
      });
    }
  );
};

// Handle game update on POST.
exports.game_update_post = [

  // Validate and sanitize fields.
  body("name", "Name must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("publisher", "publisher must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("summary", "Summary must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("date", "Date must not be empty")
    .trim()
    .optional({ checkFalsy: true })
    .isISO8601()
    .toDate(),
  body("genre.*").escape(),
  body("steam", "Steam page must not be empty.")
    .trim()
    .isLength({ min: 1 }),
  body("steam", "Must be steam page.")
    .isURL({protocols: ['https']})
    .matches('https://store.steampowered.com/app'),
  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a game object with escaped and trimmed data.
    const game = new Game({ 
      name: req.body.name,
      summary: req.body.summary,
      date_of_publish: req.body.data,
      publisher: req.body.publisher,
      genre: req.body.genre,
      steam_page:req.body.steam,
      _id: req.params.id, //This is required, or a new ID will be assigned! 
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      // Get Game for form.
      async.parallel(
        {
          game(callback) {
            Game.findById(req.params.id)
            .populate("publisher genre")
            .exec(callback);
          },
          publishers(callback) {
            Publisher.find(callback);
          },
          genres(callback) {
            Genre.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }

          res.render("game_form", {
            title: "Update Game",
            game: results.game,
            publishers: results.publishers,
            genres: results.genres,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    // Data from form is valid. Update the record.
    Game.findByIdAndUpdate(req.params.id, game, {}, (err, thegame) => {
      if (err) {
        return next(err);
      }

      // Successful: redirect to genre detail page.
      res.redirect(thegame.url);
    });
  },
];
