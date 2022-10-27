var Game = require('../models/game');

const { body, validationResult } = require("express-validator");

var async = require('async');

//Display list of all game
exports.game_list = function(req, res) {
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