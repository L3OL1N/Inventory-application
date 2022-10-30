const Game = require('../models/game');

const { body, validationResult } = require("express-validator");

var async = require('async');
const publisher = require('../models/publisher');

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
